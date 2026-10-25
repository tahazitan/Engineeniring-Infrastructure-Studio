import {NextResponse} from 'next/server';
import {isPrivate,minio} from '@/lib/server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){
 if(!isPrivate())return NextResponse.json({error:'Private studio only'},{status:403});
 try{
  const client=minio();
  const exists=await client.bucketExists(process.env.MINIO_BUCKET||'studio-evidence');
  return NextResponse.json({service:'s3-compatible',connected:true,bucketReady:exists},{status:exists?200:503});
 }catch{
  return NextResponse.json({service:'s3-compatible',connected:false,bucketReady:false},{status:503});
 }
}
