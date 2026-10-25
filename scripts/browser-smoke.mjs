// Browser-facing smoke audit against a developer-owned loopback Chromium CDP instance.
// Start browser with --remote-debugging-port=9339 --remote-allow-origins=* and an isolated profile.
const endpoint='http://127.0.0.1:9339',base='http://127.0.0.1:3000';
const targets=await(await fetch(endpoint+'/json/list')).json();
const target=targets.find(x=>x.type==='page');
if(!target)throw Error('No CDP page; start headless Brave or Chromium in a separate profile.');
const socket=new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
let next=1;const pending=new Map(),errors=[];
socket.addEventListener('message',ev=>{
 const msg=JSON.parse(String(ev.data));
 if(msg.id){const task=pending.get(msg.id);if(task){pending.delete(msg.id);msg.error?task.reject(Error(msg.error.message)):task.resolve(msg.result)}}
 if(msg.method==='Runtime.exceptionThrown')errors.push('JS exception: '+(msg.params.exceptionDetails.text||'unknown'));
 if(msg.method==='Log.entryAdded'&&msg.params.entry.level==='error'&&!/fonts.googleapis|ERR_INTERNET_DISCONNECTED/.test(msg.params.entry.text))errors.push(msg.params.entry.text.slice(0,160));
});
function send(method,params={}){return new Promise((resolve,reject)=>{const id=next++;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))})}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');await send('Log.enable');
async function evaluate(expr){const r=await send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result?.value}
const slugs=['enterprise-multisite','vlans-intervlan','routing-resilience','vpn-secure-wan','identity-ad','linux-platform','virtualization','observability','security-monitoring','security-hardening','infra-automation','recovery-resilience'];
const pages=['/','/studio',...slugs.map(x=>'/studio/'+x)];
let failed=false;
for(const path of pages){
 await send('Page.navigate',{url:base+path});await wait(1500);
 const info=await evaluate('({title:document.title,text:(document.body?.innerText||"").slice(0,180),error:document.body?.innerText?.includes("Application error"),images:Array.from(document.images).filter(i=>i.loading!=="lazy"&&(!i.complete||i.naturalWidth===0)).map(i=>i.getAttribute("src")),nodes:document.querySelectorAll(".equipment-node").length,preview:document.querySelectorAll(".topology-preview").length})');
 const bad=info.error||info.images.length>0||!info.text;
 if(bad)failed=true;
 console.log((bad?'FAIL':'PASS')+' '+path,JSON.stringify(info));
}
await send('Page.navigate',{url:base+'/' });await wait(2800);
const dynamic=await evaluate('(()=>{const s=document.querySelector("#topology-project-select");if(!s)return {error:"missing selector"};s.value="identity-ad";s.dispatchEvent(new Event("change",{bubbles:true}));return {options:s.options.length,selected:s.value};})()');
await wait(1000);
const updated=await evaluate('({selected:document.querySelector("#topology-project-select")?.value,realNodeLabel:document.querySelector(".network-showcase-topology")?.textContent?.includes("Windows")})');
console.log('INTERACTIVE TOPOLOGY SWITCH',dynamic,updated);
if(updated.selected!=='identity-ad'||!updated.realNodeLabel)failed=true;
console.log('RUNTIME ERRORS',errors.slice(0,15));
if(errors.some(x=>/TypeError|Unhandled Runtime|Application error|Cannot read properties/.test(x)))failed=true;
socket.close();
if(failed)process.exitCode=1;
