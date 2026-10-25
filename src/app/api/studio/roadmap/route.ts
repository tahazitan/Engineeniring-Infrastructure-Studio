import {NextResponse} from 'next/server';
import {z} from 'zod';
import {isPrivate,isSameOrigin,pool} from '@/lib/server';
import {roadmapWeeks,roadmapCourses} from '@/lib/engineering-roadmap';
import {advancedCertifications} from '@/lib/advanced-certifications';
export const runtime='nodejs';export const dynamic='force-dynamic';
const schema=z.object({
 type:z.enum(['week','course','certification']),
 id:z.string().min(1).max(32),
 status:z.enum(['planned','in_progress','completed']),
 notes:z.string().trim().max(1400).default('')
}).strict();
const sql=`CREATE TABLE IF NOT EXISTS engineering_roadmap_progress(
 item_id text PRIMARY KEY,
 status text NOT NULL DEFAULT 'planned' CHECK(status IN ('planned','in_progress','completed')),
 notes text NOT NULL DEFAULT '',
 updated_at timestamptz NOT NULL DEFAULT now()
)`;
async function ensure(){await pool().query(sql)}
const denied=()=>NextResponse.json({error:'Private Engineering Studio only'},{status:403});
export async function GET(){
 if(!isPrivate())return denied();
 try{
  await ensure();
  const result=await pool().query('SELECT item_id,status,notes,updated_at FROM engineering_roadmap_progress ORDER BY item_id');
  return NextResponse.json({weeks:roadmapWeeks.length,progress:result.rows},{headers:{'Cache-Control':'private, no-store'}});
 }catch{return NextResponse.json({error:'Roadmap PostgreSQL database unavailable'},{status:503})}
}
export async function PATCH(req:Request){
 if(!isPrivate())return denied();
 if(!isSameOrigin(req))return NextResponse.json({error:'Origin verification failed'},{status:403});
 let raw:unknown;
 try{raw=await req.json()}catch{return NextResponse.json({error:'Invalid JSON'},{status:400})}
 const result=schema.safeParse(raw);
 if(!result.success)return NextResponse.json({error:'Invalid roadmap entry'},{status:400});
 const value=result.data;
 const valid=value.type==='week'?roadmapWeeks.some(w=>String(w.number)===value.id):value.type==='course'?roadmapCourses.some(c=>c.id===value.id):advancedCertifications.some(c=>c.id===value.id);
 if(!valid)return NextResponse.json({error:'Unknown roadmap item'},{status:404});
 const itemId=value.type+':'+value.id;
 try{
  await ensure();
  const entry=await pool().query(`INSERT INTO engineering_roadmap_progress(item_id,status,notes)
 VALUES($1,$2,$3) ON CONFLICT(item_id) DO UPDATE SET status=excluded.status,notes=excluded.notes,updated_at=now()
 RETURNING item_id,status,notes,updated_at`,[itemId,value.status,value.notes]);
  return NextResponse.json({ok:true,entry:entry.rows[0]},{headers:{'Cache-Control':'private, no-store'}});
 }catch{return NextResponse.json({error:'Unable to save roadmap entry'},{status:503})}
}
