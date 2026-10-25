'use client';
import {useCallback,useEffect,useState} from 'react';
import {Network,Plus,Link2,RefreshCw,UploadCloud,Server} from 'lucide-react';
import type {StudioTopology} from '@/lib/gns3';
type Project={project_id:string;name:string;status?:string};
type Template={template_id:string;name:string;template_type?:string};
type TopologyNode={id:string;data:{label:string}};
async function request(body:Record<string,unknown>){const res=await fetch('/api/gns3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await res.json();if(!res.ok)throw Error(data.error||'GNS3 operation failed');return data.result;}
export default function Gns3Builder({onImport}:{onImport:(topology:StudioTopology)=>void}){
 const [projects,setProjects]=useState<Project[]>([]),[templates,setTemplates]=useState<Template[]>([]);
 const [selected,setSelected]=useState(''),[projectName,setProjectName]=useState('Taha Network Engineering Lab');
 const [deviceName,setDeviceName]=useState('HQ Switch'),[deviceKind,setDeviceKind]=useState('ethernet_switch'),[template,setTemplate]=useState('');
 const [status,setStatus]=useState('Checking GNS3 Server…'),[busy,setBusy]=useState(false);
 const [nodes,setNodes]=useState<TopologyNode[]>([]);
 const [from,setFrom]=useState(''),[to,setTo]=useState(''),[sourcePort,setSourcePort]=useState('0'),[targetPort,setTargetPort]=useState('0');
 const refresh=useCallback(async(projectId?:string)=>{
  try{
   const [p,t]=await Promise.all([fetch('/api/gns3?action=projects'),fetch('/api/gns3?action=templates')]);
   const pd=await p.json(),td=await t.json();if(!p.ok)throw Error(pd.error||'GNS3 unavailable');
   const rows=(pd.projects||[]) as Project[];
   setProjects(rows);setTemplates(td.templates||[]);
   const chosen=projectId||selected||rows[0]?.project_id||'';
   if(chosen)setSelected(chosen);
   setStatus('GNS3 connected · '+rows.length+' native projects · '+(td.templates?.length||0)+' installed templates');
   if(chosen){const r=await fetch('/api/gns3?action=topology&project_id='+encodeURIComponent(chosen)),b=await r.json();if(r.ok)setNodes(b.topology.nodes);else setNodes([]);}
   else setNodes([]);
  }catch(e){setStatus(e instanceof Error?e.message:'GNS3 offline');setNodes([]);}
 },[selected]);
 useEffect(()=>{void refresh()},[]); // Only on first mount; user controls subsequent refresh
 const action=async(cb:()=>Promise<void>)=>{setBusy(true);try{await cb()}catch(e){setStatus(e instanceof Error?e.message:'Operation failed')}finally{setBusy(false)}};
 const create=()=>action(async()=>{const p=await request({action:'create_project',name:projectName});setStatus('New GNS3 project created: '+p.name);await refresh(p.project_id);});
 const add=()=>action(async()=>{
  if(!selected)throw Error('Select or create a GNS3 project first.');
  const chosen=templates.find(t=>t.template_id===template);
  if(chosen)await request({action:'add_template_node',project_id:selected,template_id:chosen.template_id,name:deviceName,x:100+nodes.length%4*250,y:100+Math.floor(nodes.length/4)*180});
  else await request({action:'add_builtin_node',project_id:selected,name:deviceName,kind:deviceKind,x:100+nodes.length%4*250,y:100+Math.floor(nodes.length/4)*180});
  setStatus('Device created inside GNS3 project. Review native GNS3 properties and interfaces.');await refresh(selected);
 });
 const connect=()=>action(async()=>{if(!selected||!from||!to||from===to)throw Error('Choose two different GNS3 devices');await request({action:'connect_link',project_id:selected,source_node_id:from,target_node_id:to,source_adapter:0,target_adapter:0,source_port:Number(sourcePort)||0,target_port:Number(targetPort)||0});setStatus('GNS3 link created on selected ports.');await refresh(selected);});
 const importCurrent=()=>action(async()=>{if(!selected)throw Error('Choose a GNS3 project first');const r=await fetch('/api/gns3?action=topology&project_id='+encodeURIComponent(selected)),b=await r.json();if(!r.ok)throw Error(b.error||'Unable to load GNS3 topology');onImport(b.topology);setStatus('Imported '+b.topology.nodes.length+' devices / '+b.topology.edges.length+' links into Studio. Save project in the top bar to preserve a snapshot.');});
 return <section className="gns-builder" aria-label="Native GNS3 project builder">
  <div className="gns-builder-heading"><h3><Network size={17}/> LIVE GNS3 BUILDER</h3><button type="button" onClick={()=>void refresh(selected)} disabled={busy} aria-label="Refresh GNS3 projects"><RefreshCw size={15}/></button></div>
  <p className="gns-builder-status" role="status">{status}</p>
  <label>Native GNS3 project</label><select className="wb-input" value={selected} onChange={e=>{setSelected(e.target.value);void refresh(e.target.value)}}><option value="">Select project</option>{projects.map(p=><option value={p.project_id} key={p.project_id}>{p.name}</option>)}</select>
  <button type="button" className="wb-control gns-builder-full" disabled={!selected||busy} onClick={()=>action(async()=>{await request({action:'open_project',project_id:selected});setStatus('Native GNS3 project opened');await refresh(selected)})}>Open selected native project</button>
  <div className="gns-builder-compact"><input className="wb-input" aria-label="Name of new GNS3 project" value={projectName} onChange={e=>setProjectName(e.target.value)} maxLength={90}/><button type="button" className="wb-control" disabled={busy||projectName.trim().length<2} onClick={create}><Plus size={14}/> Create Project</button></div>
  <div className="gns-builder-separator"/>
  <label>Installed GNS3 template (optional)</label><select className="wb-input" value={template} onChange={e=>setTemplate(e.target.value)}><option value="">Use built-in device instead</option>{templates.map(t=><option key={t.template_id} value={t.template_id}>{t.name}</option>)}</select>
  {!template&&<select className="wb-input" value={deviceKind} aria-label="Built-in GNS3 node type" onChange={e=>setDeviceKind(e.target.value)}><option value="ethernet_switch">Ethernet Switch</option><option value="vpcs">VPCS Client</option></select>}
  <label>Device name</label><input className="wb-input" aria-label="Device name in GNS3" value={deviceName} maxLength={90} onChange={e=>setDeviceName(e.target.value)}/>
  <button type="button" className="wb-control gns-builder-full" disabled={busy||!selected||deviceName.trim().length<2} onClick={add}><Server size={15}/> Add device to GNS3</button>
  <div className="gns-builder-separator"/>
  <label>Connect native device interfaces</label>
  <div className="gns-builder-compact"><select className="wb-input" aria-label="Source GNS3 device" value={from} onChange={e=>setFrom(e.target.value)}><option value="">Source device</option>{nodes.map(n=><option value={n.id} key={n.id}>{n.data.label}</option>)}</select><input className="wb-input gns-builder-port" aria-label="Source port number" type="number" min="0" max="128" value={sourcePort} onChange={e=>setSourcePort(e.target.value)}/></div>
  <div className="gns-builder-compact"><select className="wb-input" aria-label="Target GNS3 device" value={to} onChange={e=>setTo(e.target.value)}><option value="">Target device</option>{nodes.map(n=><option value={n.id} key={n.id}>{n.data.label}</option>)}</select><input className="wb-input gns-builder-port" aria-label="Target port number" type="number" min="0" max="128" value={targetPort} onChange={e=>setTargetPort(e.target.value)}/></div>
  <button type="button" className="wb-control gns-builder-full" disabled={busy||nodes.length<2||!from||!to||from===to} onClick={connect}><Link2 size={15}/> Connect devices in GNS3</button>
  <button type="button" className="wb-control primary gns-builder-full" disabled={busy||!selected} onClick={importCurrent}><UploadCloud size={15}/> Load GNS3 → Studio canvas</button>
  <p className="gns-builder-note">Creates real GNS3 project objects, native devices and links on your local authenticated GNS3 Server. No node is started automatically. Imported canvas snapshots and config notes are saved separately in Studio; changing them does not push configs to live appliances.</p>
 </section>;
}
