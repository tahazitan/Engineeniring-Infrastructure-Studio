import {NextResponse} from 'next/server';
import {createHash,randomUUID} from 'node:crypto';
import {bucket,isPrivate,minio,pool} from '@/lib/server';
import {runnerRequest,type LabRun} from '@/lib/lab-runner';
export const runtime='nodejs';export const dynamic='force-dynamic';
type Ctx={params:Promise<{id:string}>};
export async function GET(_request:Request,{params}:Ctx){
 if(!isPrivate())return NextResponse.json({error:'Private studio only'},{status:403});
 const {id}=await params;if(!/^[a-f0-9-]{36}$/i.test(id))return NextResponse.json({error:'Invalid run ID'},{status:400});
 try{
 const db=await pool();const entry=await db.query('SELECT * FROM lab_runs WHERE id=$1 AND project_slug=$2',[id,'enterprise-multisite']);
 if(!entry.rowCount)return NextResponse.json({error:'Run not found'},{status:404});
 let row=entry.rows[0];
 if(row.state==='running'){
  let job:LabRun;
  try{job=await runnerRequest<LabRun>('/v1/runs/'+id)}
  catch(e){
   const reason=e instanceof Error?e.message:'Runner offline';
   if(reason.includes('Run not found')){
    await db.query("UPDATE lab_runs SET state='failed',finished_at=now(),stderr=$2,updated_at=now() WHERE id=$1 AND state='running'",[id,'Agent restarted; operation status could not be recovered. Inspect the Linux VM before retrying.']);
    job={id,project:'enterprise-multisite',action:row.action,status:'failed',started_at:row.started_at,finished_at:new Date().toISOString(),exit_code:null,stdout:row.stdout||'',stderr:'Agent restarted',timed_out:false};
   }else return NextResponse.json({run:{...row,status:'running'},warning:reason});
  }
  if(job.status!=='running'){
   await db.query(`UPDATE lab_runs SET state=$2,finished_at=COALESCE(finished_at,$3),exit_code=$4,stdout=$5,stderr=$6,timed_out=$7,updated_at=now() WHERE id=$1`,
   [id,job.status,job.finished_at,job.exit_code,job.stdout,job.stderr,job.timed_out]);
  }
 }
 row=(await db.query('SELECT * FROM lab_runs WHERE id=$1',[id])).rows[0];
 if(row.state!=='running'&&!row.evidence_id){
  try{
   const artifact={id:row.id,project:row.project_slug,action:row.action,status:row.state,started_at:row.started_at,finished_at:row.finished_at,exit_code:row.exit_code,timed_out:row.timed_out,stdout:row.stdout,stderr:row.stderr};
   const content=Buffer.from(JSON.stringify(artifact,null,2));
   const hash=createHash('sha256').update(content).digest('hex');
   const evidenceId=randomUUID(),key='enterprise-multisite/'+evidenceId+'/lab-run-'+id+'.json';
   const client=minio();const name=await bucket(client);
   await client.putObject(name,key,content,content.length,{'Content-Type':'application/json'});
   const tx=await db.connect();
   try{
    await tx.query('BEGIN');
    const locked=await tx.query('SELECT evidence_id FROM lab_runs WHERE id=$1 FOR UPDATE',[id]);
    if(!locked.rows[0].evidence_id){
     await tx.query('INSERT INTO evidence(id,project_slug,filename,content_type,bytes,sha256,object_key,caption) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',
      [evidenceId,'enterprise-multisite','lab-run-'+id+'.json','application/json',content.length,hash,key,'Containerlab '+row.action+' execution: '+row.state]);
     await tx.query('UPDATE lab_runs SET evidence_id=$2 WHERE id=$1',[id,evidenceId]);
    }else{
     await client.removeObject(name,key).catch(()=>{});
    }
    await tx.query('COMMIT');
   }catch(e){await tx.query('ROLLBACK');throw e}finally{tx.release()}
  }catch{
   // Keep the operation result in PostgreSQL; the next poll retries evidence registration.
  }
 }
 row=(await db.query('SELECT * FROM lab_runs WHERE id=$1',[id])).rows[0];
 return NextResponse.json({run:{...row,status:row.state}});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Run unavailable'},{status:503})}
}
