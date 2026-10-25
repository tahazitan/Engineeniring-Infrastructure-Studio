'use client';
import {useCallback,useEffect,useState} from 'react';
import {RefreshCw,Database,HardDrive,Network} from 'lucide-react';
type Service={key:string;label:string;description:string;url:string;Icon:typeof Database};
const services:Service[]=[
 {key:'database',label:'PostgreSQL',description:'Project & test records',url:'/api/health',Icon:Database},
 {key:'storage',label:'Object Storage',description:'Evidence Vault / S3',url:'/api/storage',Icon:HardDrive},
 {key:'gns3',label:'GNS3 Server',description:'Local topology API',url:'/api/gns3',Icon:Network},
];
export default function RuntimeStatus(){
 const [checks,setChecks]=useState<Record<string,boolean|null>>({database:null,storage:null,gns3:null});
 const [busy,setBusy]=useState(false);
 const refresh=useCallback(async()=>{
  setBusy(true);
  const next:Record<string,boolean|null>={};
  await Promise.all(services.map(async item=>{
   try{const response=await fetch(item.url,{cache:'no-store'}),body=await response.json();
    next[item.key]=response.ok&&(item.key==='database'?body.database==='ok':body.connected===true);
   }catch{next[item.key]=false;}
  }));
  setChecks(next);setBusy(false);
 },[]);
 useEffect(()=>{void refresh();},[refresh]);
 return <section className="runtime-status" aria-label="Local infrastructure services">
  <div className="runtime-header"><span>LOCAL INFRASTRUCTURE / LIVE HEALTH</span><button onClick={()=>void refresh()} disabled={busy} type="button"><RefreshCw size={14} className={busy?'spinning':''}/> Refresh</button></div>
  <div className="runtime-grid">{services.map(({key,label,description,Icon})=><div className="runtime-service" key={key}>
   <div className="runtime-service-icon"><Icon size={22}/></div><div><b>{label}</b><small>{description}</small></div>
   <span className={'runtime-pill '+(checks[key]===true?'online':checks[key]===false?'offline':'checking')}>{checks[key]===true?'CONNECTED':checks[key]===false?'OFFLINE':'CHECKING'}</span>
  </div>)}</div>
  <p className="runtime-help">GNS3 imports device diagrams from your local GNS3 instance. Lab execution still needs an isolated Linux runner; connectivity alone does not mean a lab has been deployed.</p>
 </section>;
}
