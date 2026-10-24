import test from 'node:test';
import assert from 'node:assert/strict';
import {ACTIONS,supportedAction,validToken,createLabAgent} from './agent.mjs';
import {EventEmitter} from 'node:events';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
test('runner rejects arbitrary commands and project names',()=>{
 assert(supportedAction('deploy'));
 assert(supportedAction('verify'));
 assert(supportedAction('destroy'));
 assert(!supportedAction('rm'));
 assert(!supportedAction('shell'));
 assert(!supportedAction('deploy; rm -rf /'));
 assert.equal(Object.keys(ACTIONS).length,4);
});
test('bearer token verification is constant-time with exact length',()=>{
 assert(validToken('a'.repeat(40),'a'.repeat(40)));
 assert(!validToken('a'.repeat(39),'a'.repeat(40)));
 assert(!validToken('a'.repeat(39)+'b','a'.repeat(40)));
});
test('runner allows fixed operations, returns jobs and rejects concurrent operations',async()=>{
 const calls=[];
 function fakeSpawn(command,args,options){
  calls.push({command,args,options});
  const child=new EventEmitter();child.pid=111;child.stdout=new EventEmitter();child.stderr=new EventEmitter();
  setTimeout(()=>{child.stdout.emit('data',Buffer.from('OSPF FULL'));child.emit('close',0,null)},150);
  return child;
 }
 const token='abcde'.repeat(10);
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
 const server=createLabAgent({token,root,execute:fakeSpawn});
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 try{
  const address='http://127.0.0.1:'+server.address().port;
  const headers={authorization:'Bearer '+token,'content-type':'application/json'};
  const invalid=await fetch(address+'/v1/run',{method:'POST',headers,body:JSON.stringify({project:'enterprise-multisite',action:'shell'})});assert.equal(invalid.status,400);
  const unauthorized=await fetch(address+'/v1/health');assert.equal(unauthorized.status,401);
  const started=await fetch(address+'/v1/run',{method:'POST',headers,body:JSON.stringify({project:'enterprise-multisite',action:'verify'})});
  assert.equal(started.status,202);
  const job=await started.json();
  const concurrent=await fetch(address+'/v1/run',{method:'POST',headers,body:JSON.stringify({project:'enterprise-multisite',action:'deploy'})});
  assert.equal(concurrent.status,409);
  await new Promise(ok=>setTimeout(ok,230));
  const completed=await fetch(address+'/v1/runs/'+job.id,{headers});
  const result=await completed.json();
  assert.equal(result.status,'success');
  assert.equal(result.stdout,'OSPF FULL');
  assert.equal(calls[0].command,'bash');
  assert.deepEqual(calls[0].args,['scripts/verify.sh']);
  assert.equal(calls[0].options.shell,false);
 }finally{await new Promise(ok=>server.close(ok))}
});
