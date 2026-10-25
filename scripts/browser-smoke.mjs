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
const pages=['/','/services','/projects','/about','/contact','/fr','/fr/services','/fr/about','/fr/projects','/fr/contact','/ar','/ar/services','/ar/about','/ar/projects','/ar/contact','/studio',...slugs.map(x=>'/studio/'+x)];
let failed=false;
for(const path of pages){
 await send('Page.navigate',{url:base+path});await wait(1500);
 const info=await evaluate('({title:document.title,text:(document.body?.innerText||"").slice(0,180),error:document.body?.innerText?.includes("Application error"),images:Array.from(document.images).filter(i=>i.loading!=="lazy"&&(!i.complete||i.naturalWidth===0)).map(i=>i.getAttribute("src")),nodes:document.querySelectorAll(".equipment-node").length,preview:document.querySelectorAll(".topology-preview").length})');
 const bad=info.error||info.images.length>0||!info.text;
 if(bad)failed=true;
 console.log((bad?'FAIL':'PASS')+' '+path,JSON.stringify(info));
}

await send('Page.navigate',{url:base+'/contact'});await wait(1900);
const contact=await evaluate('({service:document.querySelector("#contact-service")?.options?.length,description:!!document.querySelector("#contact-description"),brief:document.body.innerText.includes("Copy service brief"),links:document.querySelectorAll(".agency-contact-channels a").length})');
console.log('CONTACT BRIEF',contact);if(!contact.brief||contact.links<2||!contact.description)failed=true;
await send('Page.navigate',{url:base+'/studio/enterprise-multisite'});await wait(2400);
const gns=await evaluate('({builder:!!document.querySelector(".gns-builder"),nativeButton:document.body.innerText.includes("Create Project"),gnsConnected:document.querySelector(".gns-builder-status")?.textContent?.includes("GNS3 connected")})');
console.log('GNS3 BUILDER',gns);if(!gns.builder||!gns.nativeButton||!gns.gnsConnected)failed=true;
await evaluate('Array.from(document.querySelectorAll(".wb-tab")).find(x=>x.textContent?.includes("ROADMAP"))?.click()');await wait(260);
const road=await evaluate('({visible:!!document.querySelector(".training-roadmap"),tasks:document.querySelectorAll(".training-task").length,tests:document.querySelectorAll(".training-test").length})');
console.log('STUDIO TRAINING ROADMAP',road);if(!road.visible||!road.tasks||!road.tests)failed=true;
await evaluate('Array.from(document.querySelectorAll(".wb-tab")).find(x=>x.textContent?.includes("EDRAWMAX"))?.click()');await wait(260);
const edraw=await evaluate('({panel:!!document.querySelector(".edraw-reference"),upload:!!document.querySelector(".edraw-reference input[type=file]"),message:document.querySelector(".edraw-reference")?.textContent?.includes("EdrawMax")})');
console.log('EDRAWMAX FILE INTEGRATION',edraw);if(!edraw.panel||!edraw.upload||!edraw.message)failed=true;
await send('Page.navigate',{url:base+'/ar'});await wait(1500);
const arabic=await evaluate('({lang:document.documentElement.lang,dir:document.documentElement.dir,text:document.querySelector(".agency-hero h1")?.textContent,links:document.querySelectorAll(".agency-lang a").length})');
console.log('ARABIC LANGUAGE',arabic);if(arabic.lang!=='ar'||arabic.dir!=='rtl'||arabic.links!==3)failed=true;

await send('Emulation.setDeviceMetricsOverride',{width:420,height:900,deviceScaleFactor:1,mobile:true});
await send('Page.navigate',{url:base+'/'});await wait(1400);
const mobile=await evaluate('({viewport:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,menu:!!document.querySelector(".marketing-mobile-button"),portrait:document.querySelector(".agency-photo-panel img")?.naturalWidth})');
console.log('MOBILE LAYOUT',mobile);
if(mobile.scrollWidth>mobile.viewport+2||!mobile.menu||!mobile.portrait)failed=true;
await evaluate('document.querySelector(".marketing-mobile-button")?.click()');await wait(250);
const mobileOpen=await evaluate('!!document.querySelector(".marketing-nav.active")');
console.log('MOBILE NAVIGATION',mobileOpen);if(!mobileOpen)failed=true;
console.log('RUNTIME ERRORS',errors.slice(0,15));
if(errors.some(x=>/TypeError|Unhandled Runtime|Application error|Cannot read properties/.test(x)))failed=true;
socket.close();
if(failed)process.exitCode=1;
