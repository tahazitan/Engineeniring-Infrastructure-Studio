import {existsSync} from 'node:fs';
import {connect} from 'node:net';
import {resolve} from 'node:path';

const checks=[];
if (existsSync(resolve('.env'))) {
  try { process.loadEnvFile(resolve('.env')); }
  catch(e) { console.error('Cannot read .env:', e.message); process.exit(1); }
} else {
  console.error('Missing local .env. Copy .env.example to .env and configure it.');
  process.exit(1);
}
const log=(name,ok,detail,required=true)=>{if(required)checks.push(ok);console.log((ok?'PASS':required?'FAIL':'WARN')+'  '+name+' — '+detail)};
async function tcp(name,host,port){
  return new Promise(ok=>{
    const client=connect({host,port});
    client.setTimeout(2200);
    let done=false;
    const finish=(pass,msg)=>{if(done)return;done=true;client.destroy();log(name,pass,msg);ok(pass)};
    client.once('connect',()=>finish(true,host+':'+port+' reachable'));
    client.once('timeout',()=>finish(false,'connection timed out'));
    client.once('error',e=>finish(false,e.code||'connection error'));
  });
}
if(process.env.STUDIO_MODE!=='private'){
  log('Studio mode',false,'set STUDIO_MODE=private for the local workbench');
}else log('Studio mode',true,'private');
try{
  const db=new URL(process.env.DATABASE_URL||'');
  if(!['postgresql:','postgres:'].includes(db.protocol))throw Error('Invalid PostgreSQL URL');
  await tcp('PostgreSQL',db.hostname,Number(db.port||5432));
}catch(e){log('PostgreSQL',false,e.message)}
const storageHost=process.env.MINIO_ENDPOINT||'127.0.0.1';
await tcp('S3 storage',storageHost,Number(process.env.MINIO_PORT||9000));
try{
 const runner=new URL(process.env.LAB_RUNNER_URL||'http://127.0.0.1:4401');
 if(runner.protocol!=='http:'||!['127.0.0.1','localhost','[::1]'].includes(runner.hostname))throw Error('Runner must be reachable through localhost tunnel');
 const token=process.env.LAB_RUNNER_TOKEN||'';
 if(Buffer.byteLength(token)<32||token.startsWith('replace-with'))throw Error('Configure a unique random token');
 const response=await fetch(runner.origin+'/v1/health',{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(2500)});
 if(!response.ok)throw Error('runner HTTP '+response.status);
 const health=await response.json();
 log('Lab runner',health.status==='ready',health.status==='ready'?'authenticated and ready':'unexpected health status',false);
}catch(e){log('Lab runner',false,e.message+' (optional Linux VM integration)',false)}
console.log('\n'+checks.filter(Boolean).length+'/'+checks.length+' core integration checks passed.');
if(checks.some(x=>!x))process.exitCode=1;
