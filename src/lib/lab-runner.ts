import 'server-only';
export type LabAction='deploy'|'status'|'verify'|'destroy';
export type LabRun={id:string;project:string;action:LabAction;status:'running'|'success'|'failed';started_at:string;finished_at:string|null;exit_code:number|null;stdout:string;stderr:string;timed_out:boolean};
const actions=new Set(['deploy','status','verify','destroy']);
export function isLabAction(value:unknown):value is LabAction{return typeof value==='string'&&actions.has(value)}
function credentials(){
 const token=process.env.LAB_RUNNER_TOKEN;
 const endpoint=process.env.LAB_RUNNER_URL||'http://127.0.0.1:4401';
 const url=new URL(endpoint);
 if(url.protocol!=='http:'||!['127.0.0.1','localhost','[::1]'].includes(url.hostname)||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw new Error('Runner must be addressed through a localhost SSH tunnel');
 if(!token||Buffer.byteLength(token)<32)throw new Error('Configure LAB_RUNNER_TOKEN (32+ characters)');
 return {endpoint:url.origin,token};
}
export async function runnerRequest<T>(route:string,method:'GET'|'POST'='GET',payload?:unknown):Promise<T>{
 const {endpoint,token}=credentials();
 const request=await fetch(endpoint+route,{method,redirect:'error',headers:{authorization:'Bearer '+token,...(payload?{'content-type':'application/json'}:{})},body:payload?JSON.stringify(payload):undefined,signal:AbortSignal.timeout(10000),cache:'no-store'});
 const json=await request.json().catch(()=>({error:'Invalid runner response'}));
 if(!request.ok)throw new Error(typeof json?.error==='string'?json.error:'Runner returned '+request.status);
 return json as T;
}
