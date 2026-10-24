import http from 'node:http';
import {spawn} from 'node:child_process';
import {randomUUID,timingSafeEqual} from 'node:crypto';
import {realpathSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

export const ACTIONS=Object.freeze({
 deploy:{command:'sudo',args:['-n','containerlab','deploy','-t','topology.clab.yml'],timeout:180000},
 status:{command:'sudo',args:['-n','containerlab','inspect','-t','topology.clab.yml','--format','json'],timeout:30000},
 verify:{command:'bash',args:['scripts/verify.sh'],timeout:120000},
 destroy:{command:'sudo',args:['-n','containerlab','destroy','-t','topology.clab.yml','--cleanup'],timeout:100000}
});
export const supportedAction=action=>Object.hasOwn(ACTIONS,action);
export const validToken=(candidate,expected)=>{
 if(typeof candidate!=='string'||typeof expected!=='string'||!expected)return false;
 const left=Buffer.from(candidate),right=Buffer.from(expected);
 return left.length===right.length&&timingSafeEqual(left,right);
};
export const projectId='enterprise-multisite';
const maxLog=64000;
const allowLoopback=address=>['127.0.0.1','::1','::ffff:127.0.0.1'].includes(address||'');
function appendLog(old,chunk){
 const next=old+chunk.toString('utf8');
 return next.length>maxLog?next.slice(0,maxLog)+'\n[output truncated]':next;
}
export function createLabAgent({token,root:workspace,execute=spawn}){
 if(!token||Buffer.byteLength(token)<32)throw new Error('LAB_RUNNER_TOKEN must contain at least 32 characters');
 const labDir=path.join(realpathSync(workspace),'labs','enterprise-network');
 if(!existsSync(path.join(labDir,'topology.clab.yml'))||!existsSync(path.join(labDir,'scripts','verify.sh')))throw new Error('Enterprise network lab files are missing');
 const jobs=new Map();let busy=false;
 function launch(action){
  const id=randomUUID(),now=new Date().toISOString();
  const job={id,project:projectId,action,status:'running',started_at:now,finished_at:null,exit_code:null,stdout:'',stderr:'',timed_out:false};
  jobs.set(id,job);busy=true;
  const spec=ACTIONS[action];let child,ended=false;
  const finalize=(code,signal,error)=>{
   if(ended)return;ended=true;clearTimeout(timer);
   job.exit_code=Number.isInteger(code)?code:null;
   job.status=code===0&&!error&&!job.timed_out?'success':'failed';
   job.finished_at=new Date().toISOString();
   if(error)job.stderr=appendLog(job.stderr,Buffer.from(String(error)));
   if(signal)job.stderr=appendLog(job.stderr,Buffer.from(' Signal: '+signal));
   busy=false;
  };
  let timer;
  try{
   child=execute(spec.command,spec.args,{cwd:labDir,env:{PATH:process.env.PATH||'/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',HOME:process.env.HOME||'/root',LANG:'C.UTF-8'},shell:false,detached:true,stdio:['ignore','pipe','pipe']});
   child.stdout?.on('data',chunk=>{if(job.stdout.length<maxLog)job.stdout=appendLog(job.stdout,chunk)});
   child.stderr?.on('data',chunk=>{if(job.stderr.length<maxLog)job.stderr=appendLog(job.stderr,chunk)});
   child.on('error',error=>finalize(null,null,error));
   child.on('close',(code,signal)=>finalize(code,signal));
   timer=setTimeout(()=>{
    job.timed_out=true;
    try{if(child.pid)process.kill(-child.pid,'SIGKILL');else child.kill('SIGKILL')}catch{}
    setTimeout(()=>finalize(null,'timeout',new Error('Action timed out')),2500).unref();
   },spec.timeout);
   timer.unref();
  }catch(error){finalize(null,null,error)}
  if(jobs.size>100){for(const [key,value] of jobs){if(jobs.size<=100)break;if(value.status!=='running')jobs.delete(key)}}
  return job;
 }
 function json(res,status,data){res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(data))}
 const handler=async(req,res)=>{
  if(!allowLoopback(req.socket.remoteAddress))return json(res,403,{error:'Loopback access only'});
  if(!validToken((req.headers.authorization||'').replace(/^Bearer /,''),token))return json(res,401,{error:'Unauthorized'});
  const requestUrl=new URL(req.url||'/', 'http://127.0.0.1');
  if(req.method==='GET'&&requestUrl.pathname==='/v1/health')return json(res,200,{status:'ready',project:projectId,busy});
  const match=/^\/v1\/runs\/([0-9a-f-]{36})$/.exec(requestUrl.pathname);
  if(req.method==='GET'&&match){const found=jobs.get(match[1]);return found?json(res,200,found):json(res,404,{error:'Run not found (agent may have restarted)'})}
  if(req.method==='POST'&&requestUrl.pathname==='/v1/run'){
   let body='';for await(const chunk of req){body+=chunk;if(body.length>500){return json(res,413,{error:'Request too large'})}}
   let request;try{request=JSON.parse(body)}catch{return json(res,400,{error:'Invalid JSON'})}
   if(request?.project!==projectId||!supportedAction(request?.action))return json(res,400,{error:'Unknown project or action'});
   if(busy)return json(res,409,{error:'Another lab operation is running'});
   return json(res,202,launch(request.action));
  }
  return json(res,404,{error:'Unknown endpoint'});
 };
 return http.createServer((req,res)=>{void handler(req,res).catch(()=>json(res,500,{error:'Runner error'}))});
}
const isDirect=process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href;
if(isDirect){
 const root=process.env.LAB_REPO_ROOT||path.dirname(path.dirname(fileURLToPath(import.meta.url)));
 const agent=createLabAgent({token:process.env.LAB_RUNNER_TOKEN,root});
 const port=Number(process.env.LAB_RUNNER_PORT||4401);
 agent.listen(port,'127.0.0.1',()=>console.log('Lab Runner ready on 127.0.0.1:'+port+' (SSH tunnel required from macOS)'));
}
