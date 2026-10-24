import {NextResponse} from 'next/server';
import {projects} from '@/lib/catalog';
import {isPrivate,listProjects} from '@/lib/server';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(){
 try{
 let all=await listProjects();
 if(!isPrivate())all=all.filter(x=>x.public_visible&&x.status==='verified');
 return NextResponse.json({projects:all});
 }catch{
 if(!isPrivate())return NextResponse.json({projects:[]});
 return NextResponse.json({projects,storage:'unavailable',message:'Database offline; catalog blueprint fallback.'},{status:200});
 }
}
