import {NextResponse} from 'next/server';
import {ensureProjectRow,isPrivate,isSameOrigin,pool} from '@/lib/server';
import {isLabAction,runnerRequest,type LabRun} from '@/lib/lab-runner';
export const runtime='nodejs';export const dynamic='force-dynamic';
const project='enterprise-multisite';
export async function GET(){
 if(!isPrivate())return NextResponse.json({error:'Private studio only'},{status:403});
 try{
 const rows=await pool().query('SELECT id,project_slug,action,state AS status,started_at,finished_at,exit_code,stdout,stderr,timed_out,evidence_id FROM lab_runs WHERE project_slug=$1 ORDER BY started_at DESC LIMIT 25',[project]);
 const health=await runnerRequest<{status:string;busy:boolean}>('/v1/health').catch(()=>null);
 return NextResponse.json({runs:rows.rows,agent:health?.status||'offline',busy:health?.busy||false});
 }catch{return NextResponse.json({error:'Lab history database unavailable. Apply the 002_lab_runs migration.'},{status:503})}
}
export async function POST(req:Request){
 if(!isPrivate())return NextResponse.json({error:'Private studio only'},{status:403});
 if(!isSameOrigin(req))return NextResponse.json({error:'Origin verification failed'},{status:403});
 let body:unknown;try{body=await req.json()}catch{return NextResponse.json({error:'Invalid JSON'},{status:400})}
 const action=(body as {action?:unknown})?.action;
 if(!isLabAction(action))return NextResponse.json({error:'Unsupported lab operation'},{status:400});
 try{
 await ensureProjectRow(project);
 await pool().query('SELECT 1 FROM lab_runs LIMIT 1');
 const running=await pool().query('SELECT id FROM lab_runs WHERE project_slug=$1 AND state=$2 ORDER BY started_at DESC LIMIT 1',[project,'running']);
 if(running.rowCount){
  // Stale jobs are reconciled when their detail endpoint is polled.
  return NextResponse.json({error:'A lab job is already recorded as running. Refresh it before starting another.'},{status:409});
 }
 const result=await runnerRequest<LabRun>('/v1/run','POST',{project,action});
 await pool().query('INSERT INTO lab_runs(id,project_slug,action,state,started_at) VALUES($1,$2,$3,$4,$5)',[result.id,project,action,result.status,result.started_at]);
 return NextResponse.json({run:result},{status:202});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Runner unavailable'},{status:503})}
}
