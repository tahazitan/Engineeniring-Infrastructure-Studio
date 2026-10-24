import {NextResponse} from 'next/server';
import {randomUUID,createHash} from 'node:crypto';
import {bucket,findProject,ensureProjectRow,isPrivate,isSameOrigin,minio,pool} from '@/lib/server';
export const runtime='nodejs';export const dynamic='force-dynamic';
type Ctx={params:Promise<{slug:string}>};
const denied=()=>NextResponse.json({error:'Private studio only'},{status:403});
export async function GET(_req:Request,ctx:Ctx){
 if(!isPrivate())return denied();
 const {slug}=await ctx.params;
 if(!/^[a-z0-9-]{2,80}$/.test(slug))return NextResponse.json({error:'Invalid slug'},{status:400});
 try{const r=await pool().query('SELECT id,filename,content_type,bytes,sha256,caption,created_at FROM evidence WHERE project_slug=$1 ORDER BY created_at DESC',[slug]);
 return NextResponse.json({evidence:r.rows});}catch{return NextResponse.json({error:'Evidence database unavailable'},{status:503})}
}
export async function POST(req:Request,ctx:Ctx){
 if(!isPrivate())return denied();
 if(!isSameOrigin(req))return NextResponse.json({error:'Origin verification failed'},{status:403});
 const {slug}=await ctx.params;
 if(!/^[a-z0-9-]{2,80}$/.test(slug))return NextResponse.json({error:'Invalid project'},{status:400});
 if(!(await findProject(slug)))return NextResponse.json({error:'Project not found'},{status:404});
 try{await ensureProjectRow(slug)}catch{return NextResponse.json({error:'Project database unavailable'},{status:503})}
 if(Number(req.headers.get('content-length')||0)>12*1024*1024)return NextResponse.json({error:'Upload exceeds maximum size'},{status:413});
 let form:FormData;try{form=await req.formData()}catch{return NextResponse.json({error:'Expected multipart form data'},{status:400})}
 const file=form.get('file');
 if(!(file instanceof File))return NextResponse.json({error:'Missing file'},{status:400});
 if(file.size<1||file.size>10*1024*1024)return NextResponse.json({error:'Max file size: 10 MB'},{status:413});
 const types=['image/png','image/jpeg','image/webp','text/plain','application/json','text/csv','application/pdf','application/octet-stream'];
 if(!types.includes(file.type))return NextResponse.json({error:'Unsupported evidence content type'},{status:415});
 const name=file.name.replace(/[^a-z0-9._-]/gi,'_').slice(0,160)||'evidence';
 const caption=String(form.get('caption')||'').slice(0,400);
 const data=Buffer.from(await file.arrayBuffer());
 const hash=createHash('sha256').update(data).digest('hex');
 const id=randomUUID();const key=slug+'/'+id+'/'+name;
 try{
 const client=minio();const b=await bucket(client);
 await client.putObject(b,key,data,data.length,{'Content-Type':file.type||'application/octet-stream'});
 try{
 await pool().query('INSERT INTO evidence(id,project_slug,filename,content_type,bytes,sha256,object_key,caption) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',[id,slug,name,file.type||'application/octet-stream',data.length,hash,key,caption]);
 }catch(e){await client.removeObject(b,key).catch(()=>{});throw e}
 return NextResponse.json({id,filename:name,bytes:data.length,sha256:hash,caption},{status:201});
 }catch{return NextResponse.json({error:'Evidence service unavailable. Check PostgreSQL and MinIO.'},{status:503})}
}
