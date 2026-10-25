import {readFileSync} from 'node:fs';
import {homedir} from 'node:os';
import {join} from 'node:path';
import {NextResponse} from 'next/server';
import {z} from 'zod';
import {isPrivate,isSameOrigin} from '@/lib/server';
import {gns3ToStudio} from '@/lib/gns3';
export const runtime='nodejs';export const dynamic='force-dynamic';
const uuid=z.string().uuid(),name=z.string().trim().min(2).max(90).regex(/^[\p{L}\p{N} ._()\-/]+$/u);
const endpoint=(path:string)=>'http://127.0.0.1:3080'+path;
function authHeader(){
 const config=readFileSync(join(homedir(),'.config/GNS3/2.2/gns3_server.conf'),'utf8');
 const setting=(key:string)=>config.match(new RegExp('^\\s*'+key+'\\s*=\\s*(.+?)\\s*$','m'))?.[1]||'';
 const username=setting('user'),secret=setting('password');
 return username&&secret?'Basic '+Buffer.from(username+':'+secret).toString('base64'):'';
}
async function call(path:string,method:'GET'|'POST'|'PUT'='GET',data?:unknown){
 const token=authHeader();
 const response=await fetch(endpoint(path),{method,signal:AbortSignal.timeout(15000),cache:'no-store',headers:{...(token?{Authorization:token}:{}),'Content-Type':'application/json'},...(data!==undefined?{body:JSON.stringify(data)}:{})});
 let payload:unknown;
 try{payload=await response.json()}catch{payload={}};
 if(!response.ok)throw Error('GNS3 HTTP '+response.status+': '+(typeof payload==='object'&&payload!==null&&'message' in payload?String((payload as {message:unknown}).message).slice(0,150):'Operation rejected'));
 return payload;
}
const vUuid=(s:string)=>uuid.safeParse(s).success;
export async function GET(req:Request){
 if(!isPrivate())return NextResponse.json({error:'Private studio only'},{status:403});
 const params=new URL(req.url).searchParams,action=params.get('action')||'status';
 try{
  if(action==='status')return NextResponse.json({connected:true,version:await call('/v2/version')});
  if(action==='projects'){const data=await call('/v2/projects');return NextResponse.json({projects:Array.isArray(data)?data.map(p=>({project_id:p.project_id,name:p.name,status:p.status})):[]});}
  if(action==='templates'){const data=await call('/v2/templates');return NextResponse.json({templates:Array.isArray(data)?data.map(t=>({template_id:t.template_id,name:t.name,template_type:t.template_type})):[]});}
  if(action==='topology'){
   const id=params.get('project_id')||'';if(!vUuid(id))return NextResponse.json({error:'Invalid project ID'},{status:400});
   const [nodes,links]=await Promise.all([call('/v2/projects/'+id+'/nodes'),call('/v2/projects/'+id+'/links')]);
   return NextResponse.json({topology:gns3ToStudio({nodes,links})});
  }
  return NextResponse.json({error:'Unknown action'},{status:400});
 }catch(e){return NextResponse.json({connected:false,error:e instanceof Error?e.message:'GNS3 unavailable',hint:'Start local GNS3 server on 127.0.0.1:3080'},{status:503});}
}
const requestSchema=z.discriminatedUnion('action',[
 z.object({action:z.literal('create_project'),name}),
 z.object({action:z.literal('open_project'),project_id:uuid}),
 z.object({action:z.literal('add_builtin_node'),project_id:uuid,name,kind:z.enum(['vpcs','ethernet_switch']),x:z.number().int().min(-10000).max(10000),y:z.number().int().min(-10000).max(10000)}),
 z.object({action:z.literal('add_template_node'),project_id:uuid,template_id:uuid,name,x:z.number().int().min(-10000).max(10000),y:z.number().int().min(-10000).max(10000)}),
 z.object({action:z.literal('connect_link'),project_id:uuid,source_node_id:uuid,target_node_id:uuid,source_adapter:z.number().int().min(0).max(16),target_adapter:z.number().int().min(0).max(16),source_port:z.number().int().min(0).max(128),target_port:z.number().int().min(0).max(128)}),
 z.object({action:z.literal('update_node'),project_id:uuid,node_id:uuid,name,x:z.number().int().min(-10000).max(10000),y:z.number().int().min(-10000).max(10000)})
]);
export async function POST(req:Request){
 if(!isPrivate())return NextResponse.json({error:'Private studio only'},{status:403});
 if(!isSameOrigin(req))return NextResponse.json({error:'Origin verification failed'},{status:403});
 let raw:unknown;try{raw=await req.json()}catch{return NextResponse.json({error:'Invalid JSON'},{status:400})}
 const parsed=requestSchema.safeParse(raw);
 if(!parsed.success)return NextResponse.json({error:'Invalid GNS3 operation',issues:parsed.error.flatten()},{status:400});
 const a=parsed.data;
 try{
  if(a.action==='create_project')return NextResponse.json({result:await call('/v2/projects','POST',{name:a.name,auto_open:true})},{status:201});
  if(a.action==='open_project')return NextResponse.json({result:await call('/v2/projects/'+a.project_id+'/open','POST')});
  if(a.action==='add_builtin_node')return NextResponse.json({result:await call('/v2/projects/'+a.project_id+'/nodes','POST',{name:a.name,node_type:a.kind,compute_id:'local',x:a.x,y:a.y})},{status:201});
  if(a.action==='add_template_node')return NextResponse.json({result:await call('/v2/projects/'+a.project_id+'/templates/'+a.template_id,'POST',{name:a.name,x:a.x,y:a.y})},{status:201});
  if(a.action==='connect_link')return NextResponse.json({result:await call('/v2/projects/'+a.project_id+'/links','POST',{nodes:[{node_id:a.source_node_id,adapter_number:a.source_adapter,port_number:a.source_port},{node_id:a.target_node_id,adapter_number:a.target_adapter,port_number:a.target_port}]})},{status:201});
  if(a.action==='update_node')return NextResponse.json({result:await call('/v2/projects/'+a.project_id+'/nodes/'+a.node_id,'PUT',{name:a.name,x:a.x,y:a.y})});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'GNS3 operation failed'},{status:503});}
 return NextResponse.json({error:'Invalid action'},{status:400});
}
