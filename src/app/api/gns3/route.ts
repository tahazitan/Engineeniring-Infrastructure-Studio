import {readFileSync} from 'node:fs';
import {homedir} from 'node:os';
import {join} from 'node:path';
import {NextResponse} from 'next/server';
import {isPrivate} from '@/lib/server';
import {gns3ToStudio} from '@/lib/gns3';
export const runtime='nodejs'; export const dynamic='force-dynamic';
function localCredentials(){
 const config=readFileSync(join(homedir(),'.config/GNS3/2.2/gns3_server.conf'),'utf8');
 const value=(key:string)=>{const match=config.match(new RegExp('^\\s*'+key+'\\s*=\\s*(.+?)\\s*$','m'));return match?.[1]||''};
 const user=value('user'),password=value('password');return user&&password?'Basic '+Buffer.from(user+':'+password).toString('base64'):'';
}
async function query(path:string){const auth=localCredentials();const response=await fetch('http://127.0.0.1:3080'+path,{signal:AbortSignal.timeout(2500),cache:'no-store',headers:auth?{Authorization:auth}:{}});if(!response.ok)throw Error('GNS3 returned HTTP '+response.status);return response.json();}
export async function GET(req:Request){
 if(!isPrivate())return NextResponse.json({error:'Private studio only'},{status:403});
 const params=new URL(req.url).searchParams,action=params.get('action')||'status';
 try{
  if(action==='status')return NextResponse.json({connected:true,version:await query('/v2/version')});
  if(action==='projects'){const projects=await query('/v2/projects');return NextResponse.json({projects:Array.isArray(projects)?projects.map(p=>({project_id:p.project_id,name:p.name,status:p.status})):[]});}
  if(action==='topology'){const id=params.get('project_id')||'';if(!/^[a-fA-F0-9-]{36}$/.test(id))return NextResponse.json({error:'Invalid project id'},{status:400});const [nodes,links]=await Promise.all([query('/v2/projects/'+id+'/nodes'),query('/v2/projects/'+id+'/links')]);return NextResponse.json({topology:gns3ToStudio({nodes,links})});}
  return NextResponse.json({error:'Unknown action'},{status:400});
 }catch(e){return NextResponse.json({connected:false,error:e instanceof Error?e.message:'GNS3 unreachable',hint:'Run GNS3 server locally on 127.0.0.1:3080.'},{status:503});}
}
