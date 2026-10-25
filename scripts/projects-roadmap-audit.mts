import assert from 'node:assert/strict';
import pg from 'pg';
import {projectRoadmap,projectPhases} from '../src/lib/project-roadmap.ts';
const base='http://127.0.0.1:3000';
assert.equal(projectRoadmap.length,12,'12 monthly project plans');
assert.equal(projectPhases.length,48,'4 phases per month = 48');
assert.equal(new Set(projectPhases.map(p=>p.id)).size,48,'unique phase IDs');
for(const m of projectRoadmap){
 assert.equal(m.steps.length,4);
 assert.ok(m.stack.length>1&&m.materials.length>=2);
 assert.ok(m.steps.every(p=>p.learn&&p.build&&p.verify&&p.evidence));
 assert.ok(m.acceptance.length>=3&&m.deliverables.length>=3);
 for(const link of m.materials)assert.ok(link.url.startsWith('https://'));
}
console.log('PASS  All 12 planned projects: prerequisites, 48 build/test phases, resources and deliverables');
const headers={Origin:base,'Content-Type':'application/json'};
const get=async()=>{const r=await fetch(base+'/api/studio/roadmap');assert.equal(r.status,200);return r.json()};
const list=await get();assert.ok(Array.isArray(list.progress));
const write=async payload=>{const r=await fetch(base+'/api/studio/roadmap',{method:'PATCH',headers,body:JSON.stringify(payload)});return{status:r.status,result:await r.json()}};
assert.equal((await write({type:'project_step',id:'unknown',status:'completed',notes:''})).status,404);
console.log('PASS  Unknown phase IDs are rejected');
const hostile=await fetch(base+'/api/studio/roadmap',{method:'PATCH',headers:{...headers,Origin:'https://untrusted.example'},body:JSON.stringify({type:'project_step',id:'p01-1',status:'completed'})});
assert.equal(hostile.status,403);console.log('PASS  Cross-origin updates are forbidden');
if(!process.env.DATABASE_URL)throw Error('DATABASE_URL required for temporary isolated persistence test');
const db=new pg.Client({connectionString:process.env.DATABASE_URL});await db.connect();
const id='project_step:p12-4';
const existing=await db.query('SELECT item_id FROM engineering_roadmap_progress WHERE item_id=$1',[id]);
if(existing.rowCount){console.log('SKIP  Preserved existing personal project progress (no edits)');}
else{
 const stamp='Temporary automated project-roadmap test';
 try{
  const created=await write({type:'project_step',id:'p12-4',status:'in_progress',notes:stamp});
  assert.equal(created.status,200);
  assert.equal(created.result.entry.notes,stamp);
  const after=await get();
  assert.ok(after.progress.some(p=>p.item_id===id&&p.status==='in_progress'&&p.notes===stamp));
  console.log('PASS  Project phase and notes persist and load from PostgreSQL');
 }finally{await db.query('DELETE FROM engineering_roadmap_progress WHERE item_id=$1 AND notes=$2',[id,stamp]);}
}
await db.end();console.log('PASS  Personal roadmap data left unchanged');
