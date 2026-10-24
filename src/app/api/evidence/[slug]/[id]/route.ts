import {NextResponse} from 'next/server';
import {isPrivate,minio,pool,bucket} from '@/lib/server';
export const runtime='nodejs';export const dynamic='force-dynamic';
type Ctx={params:Promise<{slug:string;id:string}>};
export async function GET(_req:Request,ctx:Ctx){
 if(!isPrivate())return NextResponse.json({error:'Private studio only'},{status:403});
 const {slug,id}=await ctx.params;
 if(!/^[a-z0-9-]{2,80}$/.test(slug)||!/^[a-z0-9-]{30,40}$/i.test(id))return NextResponse.json({error:'Invalid identifier'},{status:400});
 try{
 const r=await pool().query('SELECT filename,content_type,object_key FROM evidence WHERE id=$1 AND project_slug=$2',[id,slug]);
 if(!r.rowCount)return NextResponse.json({error:'Not found'},{status:404});
 const row=r.rows[0];const client=minio();const b=await bucket(client);
 const stream=await client.getObject(b,row.object_key);const buffers:Buffer[]=[];
 for await(const chunk of stream)buffers.push(Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk));
 const payload=Buffer.concat(buffers);
 return new Response(new Uint8Array(payload),{headers:{'Content-Type':row.content_type,'Content-Disposition':'attachment; filename="'+row.filename.replace(/[\r\n"]/g,'_')+'"','X-Content-Type-Options':'nosniff','Cache-Control':'private, no-store'}});
 }catch{return NextResponse.json({error:'Unable to retrieve evidence'},{status:503})}
}
