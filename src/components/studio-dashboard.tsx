'use client';
import Link from 'next/link';
import {useMemo,useState} from 'react';
import {ArrowUpRight,Search,BookOpen,Network,SlidersHorizontal} from 'lucide-react';
import type {Project} from '@/lib/types';
import TechnologyLogo from './technology-logo';
export default function StudioDashboard({projects}:{projects:Project[]}){
 const [search,setSearch]=useState(''),[scope,setScope]=useState('all');
 const scopes=['all',...new Set(projects.map(p=>p.domain))];
 const filtered=useMemo(()=>projects.filter(p=>(scope==='all'||p.domain===scope)&&[p.title,p.summary,p.domain,...p.stack].join(' ').toLowerCase().includes(search.trim().toLowerCase())),[projects,search,scope]);
 const pending=projects.reduce((sum,p)=>sum+p.checklist.filter(t=>!t.done).length,0);
 const completed=projects.reduce((sum,p)=>sum+p.checklist.filter(t=>t.done).length,0);
 const verified=projects.filter(p=>p.status==='verified').length;
 return <section className="studio-dashboard" aria-labelledby="dashboard-title">
  <div className="studio-work-summary"><div><small>PROJECT REGISTER</small><strong>{projects.length}</strong><span>Workspaces</span></div><div><small>ROADMAP</small><strong>{pending}</strong><span>Remaining checklist items</span></div><div><small>PROGRESS</small><strong>{completed}</strong><span>Completed checklist items</span></div><div><small>VERIFIED</small><strong>{verified}</strong><span>Projects with accepted evidence</span></div></div>
  <div className="studio-dashboard-toolbar"><div><h2 id="dashboard-title">ENGINEERING WORKSPACES</h2><span>Saved project specs / actual progress</span></div><label><Search size={17}/><input type="search" placeholder="Search project, technology..." aria-label="Search studio projects" value={search} onChange={e=>setSearch(e.target.value)}/></label></div>
  <div className="studio-dashboard-filter" aria-label="Filter projects by engineering area"><SlidersHorizontal size={16}/>{scopes.map(domain=><button type="button" key={domain} aria-pressed={scope===domain} className={scope===domain?'active':''} onClick={()=>setScope(domain)}>{domain.toUpperCase()}</button>)}</div>
  <div className="studio-dashboard-list">{filtered.map((p,i)=>{
   const complete=p.checklist.filter(x=>x.done).length,remaining=p.checklist.length-complete;
   return <article key={p.slug} className="studio-dashboard-item">
    <span className="studio-dashboard-index">{String(i+1).padStart(2,'0')}</span>
    <div className="studio-dashboard-body"><div className="studio-dashboard-meta"><span>{p.domain.toUpperCase()}</span><span className={'status-chip status-'+p.status}>{p.status.replace('_',' ').toUpperCase()}</span></div><h3>{p.title}</h3><p>{p.summary}</p><div className="studio-dashboard-tech">{p.stack.slice(0,4).map(name=><TechnologyLogo name={name} compact key={name}/>)}</div></div>
    <div className="studio-dashboard-progress"><span>WORK CHECKLIST</span><b>{complete} / {p.checklist.length}</b><div role="progressbar" aria-label={p.title+' checklist'} aria-valuemin={0} aria-valuemax={p.checklist.length} aria-valuenow={complete}><i style={{width:(p.checklist.length?Math.round(complete/p.checklist.length*100):0)+'%'}}/></div><small>{remaining} remaining · {p.topology.nodes.length} saved nodes</small></div>
    <div className="studio-dashboard-actions"><Link href={'/studio/'+p.slug+'?tab=roadmap'}><BookOpen size={16}/> ROADMAP</Link><Link href={'/studio/'+p.slug}><Network size={16}/> WORKSPACE <ArrowUpRight size={16}/></Link></div>
   </article>;
  })}{filtered.length===0&&<p className="wb-empty">No project matches this search.</p>}</div>
 </section>;
}
