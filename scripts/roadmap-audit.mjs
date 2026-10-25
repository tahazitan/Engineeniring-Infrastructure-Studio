import assert from 'node:assert/strict';
import pg from 'pg';
const base='http://127.0.0.1:3000';
const http=(path,opts={})=>fetch(base+path,opts);
const response=await http('/api/studio/roadmap');
assert.equal(response.status,200,'Private Studio roadmap GET available');
const data=await response.json();
assert.equal(data.weeks,52);
assert.ok(Array.isArray(data.progress));
console.log('PASS  52-week roadmap API and progress read');
const headers={'Content-Type':'application/json',Origin:base};
const invalid=await http('/api/studio/roadmap',{method:'PATCH',headers,body:JSON.stringify({type:'certification',id:'nonexistent',status:'completed',notes:'test'})});
assert.equal(invalid.status,404);
console.log('PASS  Invalid certification IDs rejected');
const forged=await http('/api/studio/roadmap',{method:'PATCH',headers:{...headers,Origin:'https://invalid.example'},body:JSON.stringify({type:'week',id:'52',status:'completed',notes:'test'})});
assert.equal(forged.status,403);
console.log('PASS  Cross-origin progress writes rejected');
if(!process.env.DATABASE_URL)throw Error('Run with DB env loaded locally');
const client=new pg.Client({connectionString:process.env.DATABASE_URL});
await client.connect();
const marker='certification:crto';
try{
 const exists=await client.query('SELECT item_id FROM engineering_roadmap_progress WHERE item_id=$1',[marker]);
 if(exists.rowCount===0){
  const note='Temporary isolated test, immediately removed';
  try{
   const saved=await http('/api/studio/roadmap',{method:'PATCH',headers,body:JSON.stringify({type:'certification',id:'crto',status:'in_progress',notes:note})});
   assert.equal(saved.status,200);
   const result=await saved.json();
   assert.equal(result.entry.status,'in_progress');
   const reread=await(await http('/api/studio/roadmap')).json();
   assert.ok(reread.progress.some(p=>p.item_id===marker&&p.notes===note));
   console.log('PASS  Advanced certification status and notes saved/retrieved from PostgreSQL');
  }finally{await client.query('DELETE FROM engineering_roadmap_progress WHERE item_id=$1 AND notes=$2',[marker,note]);}
 }else{console.log('SKIP  Save test: existing user certification progress retained untouched');}
}finally{await client.end();}
