'use client';
import {useState,useCallback,useEffect,useMemo} from 'react';
import Link from 'next/link';
import {ReactFlow,Background,Controls,MiniMap,addEdge,useNodesState,useEdgesState,Handle,Position,type NodeProps,type Node,type Edge,type Connection} from '@xyflow/react';
import dynamic from 'next/dynamic';
import {ArrowLeft,Save,Download,UploadCloud,Plus,Network,TerminalSquare,ClipboardCheck,Archive,PlayCircle,RotateCw,AlertTriangle,Router,Server,Shield,Monitor,Cloud} from 'lucide-react';
import type {Project} from '@/lib/types';
import TechnologyLogo,{getLogo} from './technology-logo';
import {gns3ToStudio,inferKind} from '@/lib/gns3';
const Editor=dynamic(()=>import('@monaco-editor/react'),{ssr:false,loading:()=> <textarea className="config-loading" readOnly value="Loading configuration editor…"/>});
type StudioEdge=Edge&{sourcePort?:string;targetPort?:string};
type Evidence={id:string;filename:string;bytes:number;sha256:string;caption:string;created_at:string};
type Tab='architecture'|'configuration'|'verification'|'evidence'|'lab';
type LabAction='deploy'|'status'|'verify'|'destroy';
type LabJob={id:string;action:LabAction;status:'running'|'success'|'failed';started_at:string;finished_at?:string|null;exit_code?:number|null;stdout?:string;stderr?:string;timed_out?:boolean;evidence_id?:string|null};

function EquipmentNode({data}:NodeProps){
 const label=String(data.label||'Device');
 const platform=String(data.platform||'');
 const kind=String(data.kind||inferKind(label,platform));
 const Icon=kind==='router'?Router:kind==='firewall'?Shield:kind==='switch'?Network:kind==='client'?Monitor:kind==='cloud'?Cloud:kind==='server'?Server:Network;
 const logo=getLogo(label+' '+platform);
 return <div className={'equipment-node kind-'+kind}><Handle type="target" position={Position.Top}/>
 <span className="eq-head">{logo?<img src={'/tech/'+logo+'.svg'} alt="" width="18" height="18"/>:<Icon size={18} strokeWidth={1.5}/>} {kind.toUpperCase()}</span>
 <strong>{label}</strong>{platform&&<small className="eq-platform">{platform}</small>}
 <span className="eq-ports"><i/><i/><i/><i/><i/></span><Handle type="source" position={Position.Bottom}/></div>;
}
const nodeTypes={equipment:EquipmentNode};
export default function Workbench({initial}:{initial:Project}){
 const [draft,setDraft]=useState<Project>(initial);
 const [nodes,setNodes,onNodesChange]=useNodesState<Node>(initial.topology.nodes.map(n=>({...n,type:'equipment'})));
 const [edges,setEdges,onEdgesChange]=useEdgesState<StudioEdge>(initial.topology.edges.map(e=>({...e,label:[e.sourcePort,e.targetPort].filter(Boolean).join(' ↔ ')||undefined})));
 const [active,setActive]=useState<Tab>('architecture');
 const [message,setMessage]=useState('Workspace ready. Use Save to persist changes to PostgreSQL.');
 const [busy,setBusy]=useState(false);
 const [evidence,setEvidence]=useState<Evidence[]>([]);
 const [caption,setCaption]=useState('');
 const [file,setFile]=useState<File|null>(null);
 const [fileInputKey,setFileInputKey]=useState(0);
 const [newLabel,setNewLabel]=useState('');
 const [gnsProjects,setGnsProjects]=useState<{project_id:string;name:string}[]>([]);
 const [gnsSelected,setGnsSelected]=useState('');
 const [gnsStatus,setGnsStatus]=useState('GNS3 is not connected');
 const [labRuns,setLabRuns]=useState<LabJob[]>([]);
 const [agentState,setAgentState]=useState('checking');
 const [labBusy,setLabBusy]=useState(false);
 const [labMessage,setLabMessage]=useState('Linux VM lab agent connection');
 const [activeRunId,setActiveRunId]=useState<string|null>(null);
 const [openedRun,setOpenedRun]=useState<string|null>(null);
 const labSupported=draft.slug==='enterprise-multisite';
 const labUrl='/api/labs/enterprise-multisite';
 const onConnect=useCallback((connection:Connection)=>setEdges(old=>addEdge({...connection,animated:true},old)),[setEdges]);
 const slug=draft.slug;
 const loadEvidence=useCallback(async()=>{
  try{const r=await fetch('/api/evidence/'+slug,{cache:'no-store'});const body=await r.json();
  if(r.ok)setEvidence(body.evidence||[]);else setMessage(body.error||'Evidence service unavailable');}
  catch{setMessage('Evidence service offline. Start the local Docker services to use it.');}
 },[slug]);
 useEffect(()=>{void loadEvidence()},[loadEvidence]);
 const loadLab=useCallback(async()=>{
  if(!labSupported)return;
  try{
   const resp=await fetch(labUrl,{cache:'no-store'}),data=await resp.json();
   if(!resp.ok)throw new Error(data.error||'Unable to load lab operations');
   setLabRuns(data.runs||[]);setAgentState(data.agent||'offline');
   const running=(data.runs as LabJob[]).find(x=>x.status==='running');
   if(running)setActiveRunId(running.id);
  }catch(e){setAgentState('offline');setLabMessage(e instanceof Error?e.message:'Lab services unavailable');}
 },[labSupported,labUrl]);
 useEffect(()=>{void loadLab()},[loadLab]);
 useEffect(()=>{
  if(!activeRunId||!labSupported)return;
  let closed=false;
  const poll=async()=>{
   try{
    const resp=await fetch(labUrl+'/'+activeRunId,{cache:'no-store'}),body=await resp.json();
    if(!resp.ok)throw Error(body.error||'Unable to retrieve lab job');
    if(closed)return;
    const job=body.run as LabJob;
    setLabRuns(old=>[job,...old.filter(r=>r.id!==job.id)]);
    if(job.status!=='running'){
      setActiveRunId(null);setLabBusy(false);
      setLabMessage(job.action.toUpperCase()+' '+job.status.toUpperCase()+' (exit '+String(job.exit_code??'unknown')+')');
      await loadLab();await loadEvidence();
    }else if(body.warning)setLabMessage(body.warning);
   }catch(e){if(!closed)setLabMessage(e instanceof Error?e.message:'Polling failed');}
  };
  void poll();const timer=window.setInterval(()=>{void poll()},3000);
  return ()=>{closed=true;window.clearInterval(timer)};
 },[activeRunId,labSupported,labUrl,loadLab,loadEvidence]);
 const runLab=async(action:LabAction)=>{
  if(!labSupported||labBusy||activeRunId)return;
  if(action==='destroy'&&!window.confirm('Destroy the isolated Enterprise Network containers in your Linux lab VM?'))return;
  setLabBusy(true);setLabMessage('Submitting '+action+' job to the Linux VM…');
  try{
   const resp=await fetch(labUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action})});
   const body=await resp.json();if(!resp.ok)throw Error(body.error||'Unable to execute lab action');
   const job=body.run as LabJob;
   setLabRuns(old=>[job,...old]);setActiveRunId(job.id);setOpenedRun(job.id);
   setLabMessage(action.toUpperCase()+' dispatched to the Linux VM. Execution results will appear below.');
  }catch(e){setLabMessage(e instanceof Error?e.message:'Runner unavailable');setLabBusy(false);}
 };

 const current=useMemo<Project>(()=>({...draft,topology:{
  nodes:nodes.map(({id,position,data})=>({id,position,data:{label:String(data.label||'Device'),...(data.kind?{kind:String(data.kind)}:{}),...(data.platform?{platform:String(data.platform)}:{})}})),
  edges:edges.map(({id,source,target,animated,sourcePort,targetPort})=>({id,source,target,animated,...(sourcePort?{sourcePort}:{}),...(targetPort?{targetPort}:{})}))
 }}),[draft,nodes,edges]);
 const doneTests=current.test_plan.filter(x=>x.status==='passed').length;
 const doneChecklist=current.checklist.filter(x=>x.done).length;
 const change=(patch:Partial<Project>)=>setDraft(prev=>({...prev,...patch}));
 const save=async()=>{
  setBusy(true);setMessage('Saving project…');
  try{const r=await fetch('/api/projects/'+slug,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(current)});
  const body=await r.json();if(!r.ok)throw Error(body.error||'Save failed');
  setMessage('Saved. Architecture, configuration and test results are now persistent.');}
  catch(e){setMessage(e instanceof Error?e.message:'Unable to save project.');}
  finally{setBusy(false);}
 };
 const sendEvidence=async()=>{
  if(!file){setMessage('Choose an evidence file first.');return;}
  setBusy(true);setMessage('Uploading evidence…');
  try{const form=new FormData();form.set('file',file);form.set('caption',caption);
  const r=await fetch('/api/evidence/'+slug,{method:'POST',body:form});const body=await r.json();
  if(!r.ok)throw Error(body.error||'Upload failed');
  setMessage('Evidence saved to S3-compatible storage with SHA-256 checksum.');setFile(null);setCaption('');setFileInputKey(x=>x+1);await loadEvidence();}
  catch(e){setMessage(e instanceof Error?e.message:'Upload failed');}
  finally{setBusy(false);}
 };
 const exportJson=()=>{
  const url=URL.createObjectURL(new Blob([JSON.stringify(current,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=slug+'.project.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  setMessage('Project JSON exported.');
 };
 const importJson=async(event:React.ChangeEvent<HTMLInputElement>)=>{
  const f=event.target.files?.[0];if(!f)return;
  try{const imported=JSON.parse(await f.text()) as Project;
  if(imported.slug!==slug||!Array.isArray(imported.topology?.nodes)||!Array.isArray(imported.topology?.edges)||!Array.isArray(imported.test_plan))throw Error('Select a valid project JSON with a matching slug.');
  setDraft(imported);setNodes(imported.topology.nodes.map(n=>({...n,type:'equipment'})));setEdges(imported.topology.edges.map(e=>({...e,label:[e.sourcePort,e.targetPort].filter(Boolean).join(' ↔ ')||undefined})));
  setMessage('Project imported. Select Save to persist changes.');}
  catch(e){setMessage(e instanceof Error?e.message:'Invalid JSON file');}
  event.target.value='';
 };
 const addNode=()=>{
  const name=newLabel.trim();if(!name)return;
  setNodes(existing=>[...existing,{id:'device-'+Date.now(),type:'equipment',position:{x:100+(existing.length%4)*140,y:120+(existing.length%3)*100},data:{label:name}}]);setNewLabel('');
 };
 const applyTopology=(topology:ReturnType<typeof gns3ToStudio>)=>{setNodes(topology.nodes.map(n=>({...n,type:'equipment'})));setEdges(topology.edges.map(e=>({...e,label:[e.sourcePort,e.targetPort].filter(Boolean).join(' ↔ ')||undefined})));setMessage('GNS3 topology imported. Review and select Save project to persist.');setGnsStatus('Topology imported · '+topology.nodes.length+' nodes / '+topology.edges.length+' links');};
 const importGns3=async(event:React.ChangeEvent<HTMLInputElement>)=>{
  const f=event.target.files?.[0];if(!f)return;
  try{if(f.size>3000000)throw Error('GNS3 project is too large (maximum 3 MB)');const raw=JSON.parse(await f.text());applyTopology(gns3ToStudio(raw))}
  catch(e){setMessage(e instanceof Error?e.message:'Invalid GNS3 file');}
  event.target.value='';
 };
 const connectGns3=useCallback(async()=>{
  setGnsStatus('Checking local GNS3 server…');
  try{const status=await fetch('/api/gns3?action=status');if(!status.ok)throw Error('GNS3 Server offline on 127.0.0.1:3080');
   const resp=await fetch('/api/gns3?action=projects');const body=await resp.json();if(!resp.ok)throw Error(body.error||'Cannot list GNS3 projects');
   setGnsProjects(body.projects||[]);setGnsSelected(body.projects?.[0]?.project_id||'');setGnsStatus('GNS3 connected · '+(body.projects||[]).length+' projects available');
  }catch(e){setGnsStatus(e instanceof Error?e.message:'GNS3 offline');}
 },[]);
 useEffect(()=>{void connectGns3()},[connectGns3]);
 const pullGns3=async()=>{
  if(!gnsSelected)return;
  try{const response=await fetch('/api/gns3?action=topology&project_id='+encodeURIComponent(gnsSelected));const body=await response.json();if(!response.ok)throw Error(body.error||'GNS3 topology unavailable');applyTopology(body.topology)}
  catch(e){setGnsStatus(e instanceof Error?e.message:'Import failed');}
 };
 const markTest=(id:string,status:'pending'|'passed'|'failed')=>change({test_plan:draft.test_plan.map(t=>t.id===id?{...t,status}:t)});
 const editNotes=(id:string,text:string)=>change({test_plan:draft.test_plan.map(t=>t.id===id?{...t,notes:text}:t)});
 const canVerify=doneTests===current.test_plan.length&&doneChecklist===current.checklist.length&&evidence.length>0;
 const tabs:[Tab,string,React.ReactNode][]=[['architecture','TOPOLOGY',<Network size={16} key="top"/>],['configuration','CONFIGURATION',<TerminalSquare size={16} key="cfg"/>],['verification','TEST & VALIDATE',<ClipboardCheck size={16} key="tests"/>],['evidence','EVIDENCE VAULT',<Archive size={16} key="evidence"/>],['lab','LAB OPERATIONS',<PlayCircle size={16} key="lab"/>]];
 return <main className="workbench">
  <header className="wb-top"><Link href="/studio" className="wb-back"><ArrowLeft size={15}/> STUDIO</Link><div className="wb-heading"><small>ENGINEERING PROJECT / {draft.domain.toUpperCase()}</small><b>{draft.title}</b></div><div className="wb-controls"><label className="wb-control" style={{cursor:'pointer'}}><UploadCloud size={14}/> Import JSON <input hidden type="file" accept="application/json,.json" onChange={importJson}/></label><button className="wb-control" onClick={exportJson}><Download size={14}/> Export</button><button className="wb-control primary" disabled={busy} onClick={save}><Save size={14}/> {busy?'Working…':'Save project'}</button></div></header>
  <section className="wb-title-row"><div><div className="section-tag">ENGINEERING WORKBENCH / {slug.toUpperCase()}</div><h1>{draft.title}</h1><p>{draft.summary}</p><div className="wb-stack-row">{draft.stack.map(name=><TechnologyLogo key={name} name={name} compact/>)}</div></div><div className="wb-stats"><div className="wb-stat"><b>{nodes.length}</b><small>DEVICES</small></div><div className="wb-stat"><b>{doneTests}/{current.test_plan.length}</b><small>TESTS PASSED</small></div><div className="wb-stat"><b>{evidence.length}</b><small>EVIDENCE ITEMS</small></div></div></section>
  <div role="status" aria-live="polite" className="wb-message">{message}</div>
  <nav className="wb-tabs" aria-label="Engineering workbench sections">{tabs.map(([key,label,icon])=><button className={active===key?'wb-tab active':'wb-tab'} onClick={()=>setActive(key)} key={key}>{icon} {label}</button>)}</nav>
  <section className="wb-content">
  {active==='architecture'&&<div className="wb-two"><div className="wb-panel"><div className="wb-panel-header"><b>NETWORK ARCHITECTURE / INTERACTIVE TOPOLOGY</b><span>{nodes.length} nodes · {edges.length} links</span></div><div className="flow-surface"><ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView colorMode="dark" minZoom={.2} maxZoom={2} deleteKeyCode={['Backspace','Delete']}><Background color="#244353" gap={22} size={1}/><Controls/><MiniMap zoomable pannable nodeColor="#5abca9" maskColor="rgba(6,17,27,.68)"/></ReactFlow></div></div><aside className="wb-aside"><h3>Architecture editor</h3><p>Drag equipment to arrange the topology. Connect output handles to input handles; select a node or link and press Delete to remove it.</p><label htmlFor="new-device">New equipment label</label><div className="wb-add"><input id="new-device" className="wb-input" value={newLabel} onChange={e=>setNewLabel(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')addNode()}} placeholder="e.g. Branch firewall"/><button onClick={addNode} aria-label="Add equipment"><Plus size={16}/></button></div><div className="gns-import"><h3>GNS3 / Network Topology</h3><p>Import a native .gns3 project diagram or connect to your local GNS3 server. Imported devices and links become editable in the topology workspace.</p>
 <label className="wb-control gns-file">Import .gns3 file<input type="file" hidden accept=".gns3,.json" onChange={importGns3}/></label>
 <a className="wb-control" href="/examples/taha-network-demo.gns3" download>Download demo topology</a>
 <button className="wb-control" onClick={()=>void connectGns3()}>Connect GNS3 Server</button>
 <div className="gns-status" role="status">{gnsStatus}</div>
 {gnsProjects.length>0&&<><select aria-label="GNS3 project" className="wb-input" value={gnsSelected} onChange={e=>setGnsSelected(e.target.value)}>{gnsProjects.map(p=><option value={p.project_id} key={p.project_id}>{p.name}</option>)}</select><button className="wb-control" onClick={()=>void pullGns3()} disabled={!gnsSelected}>Load GNS3 topology</button></>}
 </div><h3 style={{marginTop:30}}>Design objectives</h3><ul>{current.objectives.map((o,i)=><li key={i}>{o}</li>)}</ul></aside></div>}
  {active==='configuration'&&<div className="wb-two"><div className="wb-panel"><div className="wb-panel-header"><b>CONFIGURATION WORKSPACE / TEXT EDITOR</b><span>Versioned on Save</span></div><div className="wb-config"><Editor height="100%" defaultLanguage="yaml" theme="vs-dark" value={draft.configuration} onChange={value=>change({configuration:value||''})} options={{fontSize:13,minimap:{enabled:false},automaticLayout:true,scrollBeyondLastLine:false,tabSize:2,wordWrap:'on'}}/></div></div><aside className="wb-aside"><h3>Configuration design</h3><p>Store infrastructure configuration snippets, commands, diagnostics and annotated design notes alongside the project. Use Export JSON for local snapshots.</p><h3 style={{marginTop:28}}>Technology stack</h3><ul>{current.stack.map(s=><li key={s}>{s}</li>)}</ul></aside></div>}
  {active==='verification'&&<div className="wb-report"><div className="wb-section"><h3>Acceptance test plan</h3>{current.test_plan.map(t=><div className="wb-row" key={t.id}><div style={{flex:1}}><span>{t.title}</span><div className="wb-field"><label>Observed result / command output notes</label><textarea value={t.notes||''} onChange={e=>editNotes(t.id,e.target.value)} placeholder="Record real test command, expected vs. observed result…"/></div></div><select value={t.status} onChange={e=>markTest(t.id,e.target.value as 'pending'|'passed'|'failed')} aria-label={'Status: '+t.title}><option value="pending">PENDING</option><option value="passed">PASSED</option><option value="failed">FAILED</option></select></div>)}</div><div className="wb-section"><h3>Engineering checklist</h3>{current.checklist.map(item=><label className="wb-row" key={item.id}><input type="checkbox" checked={item.done} onChange={e=>change({checklist:draft.checklist.map(x=>x.id===item.id?{...x,done:e.target.checked}:x)})}/><span>{item.title}</span></label>)}<h3 style={{marginTop:22}}>Project verification</h3><div className="wb-field"><label>Lifecycle state</label><select value={draft.status} onChange={e=>change({status:e.target.value as Project['status']})}><option value="planned">Planned</option><option value="in_progress">In progress</option><option value="verified" disabled={!canVerify}>Verified</option></select></div><p className="wb-hint">Verified requires all tests passed, all checklist items complete, and at least one uploaded evidence file. Saving performs the same checks on the server.</p><label className="wb-publish"><input type="checkbox" checked={draft.public_visible} onChange={e=>change({public_visible:e.target.checked})}/> Approve this project's public visibility when verified</label><div className="wb-preview"><span>VALIDATION</span><strong>{doneTests} / {current.test_plan.length} tests passed</strong><strong>{doneChecklist} / {current.checklist.length} checklist tasks complete</strong><strong>{evidence.length} evidence artifacts registered</strong></div></div></div>}
  {active==='evidence'&&<div className="wb-evidence"><div className="wb-section"><h3>Capture & archive evidence</h3><p className="wb-hint">Attach command outputs, screenshots, structured results, packet summaries or technical reports. Files are stored in local S3-compatible object storage; SHA-256 checksums are recorded in PostgreSQL.</p><div className="wb-field"><label>Evidence file (up to 10 MB)</label><input key={fileInputKey} type="file" onChange={e=>setFile(e.target.files?.[0]||null)} accept=".png,.jpg,.jpeg,.webp,.txt,.json,.csv,.pdf,.log"/></div><div className="wb-field"><label>Technical context</label><textarea value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Test command, environment, observation and relevant acceptance criterion"/></div><button className="wb-control primary" disabled={busy||!file} onClick={sendEvidence}><UploadCloud size={15}/> Upload evidence</button></div><div className="wb-evidence-list"><div className="wb-panel-header"><b>EVIDENCE LIBRARY</b><span>{evidence.length} FILES</span></div>{evidence.length===0?<div className="wb-empty">Your evidence register will appear here after the first upload.</div>:evidence.map(item=><div className="wb-evidence-item" key={item.id}><div><b>{item.filename}</b><small>{item.caption}</small><small>SHA256: {item.sha256}</small><small>{new Date(item.created_at).toLocaleString()} · {(item.bytes/1024).toFixed(1)} KB</small></div><a href={'/api/evidence/'+slug+'/'+item.id} download>DOWNLOAD ↗</a></div>)}</div></div>}
  {active==='lab'&&<div className="lab-container">
   {!labSupported?<div className="wb-section"><h3>Engineering lab integrations</h3><p className="wb-hint">This workspace is ready for configurations and evidence. The dedicated Containerlab runner is currently connected to Enterprise Multi-Site Infrastructure; additional lab profiles can be registered using the same action API.</p><Link className="wb-control primary" href="/studio/enterprise-multisite">OPEN ENTERPRISE NETWORK LAB →</Link></div>:<>
   <div className="lab-overview"><div className="lab-card"><span className="section-tag">CONNECTED LAB</span><h3>Enterprise Network / FRRouting & OSPF</h3><p>Deploy, inspect, verify and destroy the Linux VM Containerlab environment directly from the engineering studio.</p><div className="lab-labels"><span>CONTAINERLAB</span><span>OSPF AREA 0</span><span>LINUX VM</span><span>FRROUTING</span></div></div><div className="lab-card status-card"><span className="section-tag">EXECUTION ENGINE</span><strong className={agentState==='ready'?'online':'offline'}>{agentState==='ready'?'RUNNER ONLINE':'RUNNER OFFLINE'}</strong><p>SSH-tunneled local runner · restricted lab action set · automatic operation journal</p><button className="wb-control" onClick={()=>void loadLab()}><RotateCw size={14}/> Refresh connection</button></div></div>
   <div className="lab-actions"><div><span className="section-tag">LAB CONTROL</span><h3>Operate the infrastructure</h3></div><div className="lab-buttons">{(['deploy','status','verify','destroy'] as LabAction[]).map(action=><button key={action} className={action==='destroy'?'lab-danger':'wb-control'} disabled={agentState!=='ready'||labBusy||Boolean(activeRunId)} onClick={()=>void runLab(action)}><PlayCircle size={14}/>{action.toUpperCase()}</button>)}</div></div>
   <div role="status" className="lab-notice"><AlertTriangle size={15}/>{labMessage}</div>
   <div className="lab-history"><div className="wb-panel-header"><b>EXECUTION HISTORY</b><span>{labRuns.length} RUNS / POSTGRESQL</span></div>
    {labRuns.length===0?<p className="wb-empty">Execute a lab action to record its exit status, output and SHA-256 evidence.</p>:labRuns.map(run=><article key={run.id} className="lab-run">
     <button className="lab-run-title" onClick={()=>setOpenedRun(openedRun===run.id?null:run.id)}><span className="lab-operation">{run.action.toUpperCase()}</span><span className={'lab-result '+run.status}>{run.status.toUpperCase()}</span><span>{new Date(run.started_at).toLocaleString()}</span><span>{run.exit_code===null||run.exit_code===undefined?'—':'exit '+run.exit_code}</span><span>{openedRun===run.id?'▴':'▾'}</span></button>
     {openedRun===run.id&&<div className="lab-run-output"><div className="lab-output-title">STANDARD OUTPUT</div><pre>{run.stdout||'(no output yet)'}</pre>{Boolean(run.stderr)&&<><div className="lab-output-title">STANDARD ERROR</div><pre>{run.stderr}</pre></>}{run.evidence_id&&<a className="lab-evidence-link" href={'/api/evidence/'+slug+'/'+run.evidence_id} download>DOWNLOAD VERIFIED RUN EVIDENCE ↗</a>}</div>}
    </article>)}</div>
   <p className="wb-hint" style={{marginTop:18}}>Lab execution results are captured from the isolated Linux VM. A successful run records a successful command exit code; project acceptance criteria and verified status remain part of the engineering review.</p>
   </>}
  </div>}
  </section>
 </main>;
}
