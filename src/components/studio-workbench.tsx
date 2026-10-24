'use client';
import {useState,useCallback,useEffect,useMemo} from 'react';
import Link from 'next/link';
import {ReactFlow,Background,Controls,MiniMap,addEdge,useNodesState,useEdgesState,Handle,Position,type NodeProps,type Node,type Edge,type Connection} from '@xyflow/react';
import dynamic from 'next/dynamic';
import {ArrowLeft,Save,Download,UploadCloud,Plus,Network,TerminalSquare,ClipboardCheck,Archive} from 'lucide-react';
import type {Project} from '@/lib/types';
const Editor=dynamic(()=>import('@monaco-editor/react'),{ssr:false,loading:()=> <textarea className="config-loading" readOnly value="Loading configuration editor…"/>});
type Evidence={id:string;filename:string;bytes:number;sha256:string;caption:string;created_at:string};
type Tab='architecture'|'configuration'|'verification'|'evidence';
function EquipmentNode({data}:NodeProps){
 return <div className="equipment-node"><Handle type="target" position={Position.Top}/>
 <span className="eq-head"><Network size={15}/> EQUIPMENT</span><strong>{String(data.label||'Device')}</strong>
 <span className="eq-ports"><i/><i/><i/></span><Handle type="source" position={Position.Bottom}/></div>;
}
const nodeTypes={equipment:EquipmentNode};
export default function Workbench({initial}:{initial:Project}){
 const [draft,setDraft]=useState<Project>(initial);
 const [nodes,setNodes,onNodesChange]=useNodesState<Node>(initial.topology.nodes.map(n=>({...n,type:'equipment'})));
 const [edges,setEdges,onEdgesChange]=useEdgesState<Edge>(initial.topology.edges);
 const [active,setActive]=useState<Tab>('architecture');
 const [message,setMessage]=useState('Workspace ready. Use Save to persist changes to PostgreSQL.');
 const [busy,setBusy]=useState(false);
 const [evidence,setEvidence]=useState<Evidence[]>([]);
 const [caption,setCaption]=useState('');
 const [file,setFile]=useState<File|null>(null);
 const [fileInputKey,setFileInputKey]=useState(0);
 const [newLabel,setNewLabel]=useState('');
 const [notes,setNotes]=useState('');
 const onConnect=useCallback((connection:Connection)=>setEdges(old=>addEdge({...connection,animated:true},old)),[setEdges]);
 const slug=draft.slug;
 const loadEvidence=useCallback(async()=>{
  try{const r=await fetch('/api/evidence/'+slug,{cache:'no-store'});const body=await r.json();
  if(r.ok)setEvidence(body.evidence||[]);else setMessage(body.error||'Evidence service unavailable');}
  catch{setMessage('Evidence service offline. Start the local Docker services to use it.');}
 },[slug]);
 useEffect(()=>{void loadEvidence()},[loadEvidence]);
 const current=useMemo<Project>(()=>({...draft,topology:{
  nodes:nodes.map(({id,position,data})=>({id,position,data:{label:String(data.label||'Device')}})),
  edges:edges.map(({id,source,target,animated})=>({id,source,target,animated}))
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
  setMessage('Evidence saved to MinIO with SHA-256 checksum.');setFile(null);setCaption('');setFileInputKey(x=>x+1);await loadEvidence();}
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
  setDraft(imported);setNodes(imported.topology.nodes.map(n=>({...n,type:'equipment'})));setEdges(imported.topology.edges);
  setMessage('Project imported. Select Save to persist changes.');}
  catch(e){setMessage(e instanceof Error?e.message:'Invalid JSON file');}
  event.target.value='';
 };
 const addNode=()=>{
  const name=newLabel.trim();if(!name)return;
  setNodes(existing=>[...existing,{id:'device-'+Date.now(),type:'equipment',position:{x:100+(existing.length%4)*140,y:120+(existing.length%3)*100},data:{label:name}}]);setNewLabel('');
 };
 const markTest=(id:string,status:'pending'|'passed'|'failed')=>change({test_plan:draft.test_plan.map(t=>t.id===id?{...t,status}:t)});
 const editNotes=(id:string,text:string)=>change({test_plan:draft.test_plan.map(t=>t.id===id?{...t,notes:text}:t)});
 const canVerify=doneTests===current.test_plan.length&&doneChecklist===current.checklist.length&&evidence.length>0;
 const tabs:[Tab,string,React.ReactNode][]=[['architecture','TOPOLOGY',<Network size={16} key="top"/>],['configuration','CONFIGURATION',<TerminalSquare size={16} key="cfg"/>],['verification','TEST & VALIDATE',<ClipboardCheck size={16} key="tests"/>],['evidence','EVIDENCE VAULT',<Archive size={16} key="evidence"/>]];
 return <main className="workbench">
  <header className="wb-top"><Link href="/studio" className="wb-back"><ArrowLeft size={15}/> STUDIO</Link><div className="wb-heading"><small>ENGINEERING PROJECT / {draft.domain.toUpperCase()}</small><b>{draft.title}</b></div><div className="wb-controls"><label className="wb-control" style={{cursor:'pointer'}}><UploadCloud size={14}/> Import JSON <input hidden type="file" accept="application/json,.json" onChange={importJson}/></label><button className="wb-control" onClick={exportJson}><Download size={14}/> Export</button><button className="wb-control primary" disabled={busy} onClick={save}><Save size={14}/> {busy?'Working…':'Save project'}</button></div></header>
  <section className="wb-title-row"><div><div className="section-tag">ENGINEERING WORKBENCH / {slug.toUpperCase()}</div><h1>{draft.title}</h1><p>{draft.summary}</p></div><div className="wb-stats"><div className="wb-stat"><b>{nodes.length}</b><small>DEVICES</small></div><div className="wb-stat"><b>{doneTests}/{current.test_plan.length}</b><small>TESTS PASSED</small></div><div className="wb-stat"><b>{evidence.length}</b><small>EVIDENCE ITEMS</small></div></div></section>
  <div role="status" aria-live="polite" className="wb-message">{message}</div>
  <nav className="wb-tabs" aria-label="Engineering workbench sections">{tabs.map(([key,label,icon])=><button className={active===key?'wb-tab active':'wb-tab'} onClick={()=>setActive(key)} key={key}>{icon} {label}</button>)}</nav>
  <section className="wb-content">
  {active==='architecture'&&<div className="wb-two"><div className="wb-panel"><div className="wb-panel-header"><b>NETWORK ARCHITECTURE / INTERACTIVE TOPOLOGY</b><span>{nodes.length} nodes · {edges.length} links</span></div><div className="flow-surface"><ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView colorMode="dark" minZoom={.2} maxZoom={2} deleteKeyCode={['Backspace','Delete']}><Background color="#244353" gap={22} size={1}/><Controls/><MiniMap zoomable pannable nodeColor="#5abca9" maskColor="rgba(6,17,27,.68)"/></ReactFlow></div></div><aside className="wb-aside"><h3>Architecture editor</h3><p>Drag equipment to arrange the topology. Connect output handles to input handles; select a node or link and press Delete to remove it.</p><label htmlFor="new-device">New equipment label</label><div className="wb-add"><input id="new-device" className="wb-input" value={newLabel} onChange={e=>setNewLabel(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')addNode()}} placeholder="e.g. Branch firewall"/><button onClick={addNode} aria-label="Add equipment"><Plus size={16}/></button></div><h3 style={{marginTop:30}}>Design objectives</h3><ul>{current.objectives.map((o,i)=><li key={i}>{o}</li>)}</ul></aside></div>}
  {active==='configuration'&&<div className="wb-two"><div className="wb-panel"><div className="wb-panel-header"><b>CONFIGURATION WORKSPACE / TEXT EDITOR</b><span>Versioned on Save</span></div><div className="wb-config"><Editor height="100%" defaultLanguage="yaml" theme="vs-dark" value={draft.configuration} onChange={value=>change({configuration:value||''})} options={{fontSize:13,minimap:{enabled:false},automaticLayout:true,scrollBeyondLastLine:false,tabSize:2,wordWrap:'on'}}/></div></div><aside className="wb-aside"><h3>Configuration design</h3><p>Store infrastructure configuration snippets, commands, diagnostics and annotated design notes alongside the project. Use Export JSON for local snapshots.</p><h3 style={{marginTop:28}}>Technology stack</h3><ul>{current.stack.map(s=><li key={s}>{s}</li>)}</ul></aside></div>}
  {active==='verification'&&<div className="wb-report"><div className="wb-section"><h3>Acceptance test plan</h3>{current.test_plan.map(t=><div className="wb-row" key={t.id}><div style={{flex:1}}><span>{t.title}</span><div className="wb-field"><label>Observed result / command output notes</label><textarea value={t.notes||''} onChange={e=>editNotes(t.id,e.target.value)} placeholder="Record real test command, expected vs. observed result…"/></div></div><select value={t.status} onChange={e=>markTest(t.id,e.target.value as 'pending'|'passed'|'failed')} aria-label={'Status: '+t.title}><option value="pending">PENDING</option><option value="passed">PASSED</option><option value="failed">FAILED</option></select></div>)}</div><div className="wb-section"><h3>Engineering checklist</h3>{current.checklist.map(item=><label className="wb-row" key={item.id}><input type="checkbox" checked={item.done} onChange={e=>change({checklist:draft.checklist.map(x=>x.id===item.id?{...x,done:e.target.checked}:x)})}/><span>{item.title}</span></label>)}<h3 style={{marginTop:22}}>Project verification</h3><div className="wb-field"><label>Lifecycle state</label><select value={draft.status} onChange={e=>change({status:e.target.value as Project['status']})}><option value="planned">Planned</option><option value="in_progress">In progress</option><option value="verified" disabled={!canVerify}>Verified</option></select></div><p className="wb-hint">Verified requires all tests passed, all checklist items complete, and at least one uploaded evidence file. Saving performs the same checks on the server.</p><label className="wb-publish"><input type="checkbox" checked={draft.public_visible} onChange={e=>change({public_visible:e.target.checked})}/> Approve this project's public visibility when verified</label><div className="wb-preview"><span>VALIDATION</span><strong>{doneTests} / {current.test_plan.length} tests passed</strong><strong>{doneChecklist} / {current.checklist.length} checklist tasks complete</strong><strong>{evidence.length} evidence artifacts registered</strong></div></div></div>}
  {active==='evidence'&&<div className="wb-evidence"><div className="wb-section"><h3>Capture & archive evidence</h3><p className="wb-hint">Attach command outputs, screenshots, structured results, packet summaries or technical reports. Files are stored in local MinIO object storage; SHA-256 checksums are recorded in PostgreSQL.</p><div className="wb-field"><label>Evidence file (up to 10 MB)</label><input key={fileInputKey} type="file" onChange={e=>setFile(e.target.files?.[0]||null)} accept=".png,.jpg,.jpeg,.webp,.txt,.json,.csv,.pdf,.log"/></div><div className="wb-field"><label>Technical context</label><textarea value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Test command, environment, observation and relevant acceptance criterion"/></div><button className="wb-control primary" disabled={busy||!file} onClick={sendEvidence}><UploadCloud size={15}/> Upload evidence</button></div><div className="wb-evidence-list"><div className="wb-panel-header"><b>EVIDENCE LIBRARY</b><span>{evidence.length} FILES</span></div>{evidence.length===0?<div className="wb-empty">Your evidence register will appear here after the first upload.</div>:evidence.map(item=><div className="wb-evidence-item" key={item.id}><div><b>{item.filename}</b><small>{item.caption}</small><small>SHA256: {item.sha256}</small><small>{new Date(item.created_at).toLocaleString()} · {(item.bytes/1024).toFixed(1)} KB</small></div><a href={'/api/evidence/'+slug+'/'+item.id} download>DOWNLOAD ↗</a></div>)}</div></div>}
  </section>
 </main>;
}
