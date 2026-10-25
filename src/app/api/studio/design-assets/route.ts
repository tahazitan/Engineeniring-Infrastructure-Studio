import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {NextResponse} from 'next/server';
import {isPrivate} from '@/lib/server';
export const runtime='nodejs';export const dynamic='force-dynamic';
const items={
 preview:{name:'template-reference.jpg',type:'image/jpeg',download:false},
 ai:{name:'template.ai',type:'application/octet-stream',download:true},
 eps:{name:'template.eps',type:'application/postscript',download:true}
} as const;
export async function GET(req:Request){
 const url=new URL(req.url);
 if(!isPrivate()||!['127.0.0.1','localhost','[::1]'].includes(url.hostname))return NextResponse.json({error:'Only available in the private local Studio'},{status:403});
 const choice=url.searchParams.get('asset')||'';
 if(!(choice in items))return NextResponse.json({error:'Unknown design source'},{status:400});
 const selected=items[choice as keyof typeof items];
 try{
  const bytes=await readFile(join(process.cwd(),'.studio-assets',selected.name));
  return new NextResponse(new Uint8Array(bytes),{headers:{
   'Content-Type':selected.type,'Cache-Control':'no-store, private','X-Content-Type-Options':'nosniff',
   'Content-Disposition':(selected.download?'attachment':'inline')+'; filename="'+selected.name+'"'
  }});
 }catch{return NextResponse.json({error:'Original user template is not present in the local private asset directory'},{status:404});}
}
