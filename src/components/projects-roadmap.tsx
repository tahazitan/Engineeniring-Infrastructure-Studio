'use client';
import {useCallback,useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowUpRight,BookOpen,CheckCircle2,ClipboardList,ExternalLink,FlaskConical,HardDrive,Save,ShieldCheck} from 'lucide-react';
import {projectRoadmap,projectPhases,type ProjectMonth} from '@/lib/project-roadmap';
import {roadmapTracks,type TrackId} from '@/lib/engineering-roadmap';
import TechnologyLogo from './technology-logo';
type Status='planned'|'in_progress'|'completed';
type ProgressEntry={item_id:string;status:Status;notes:string;updated_at:string};
export default function ProjectsRoadmap(){
 const [progress,setProgress]=useState<Record<string,ProgressEntry>>({});
 const [drafts,setDrafts]=useState<Record<string,string>>({});
 const [selected,setSelected]=useState(1);
 const [track,setTrack]=useState<TrackId|'all'>('all');
 const [saving,setSaving]=useState('');
 const [notice,setNotice]=useState('Loading project progress from PostgreSQL…');
 const load=useCallback(async()=>{
  try{
   const res=await fetch('/api/studio/roadmap',{cache:'no-store'});
   const body=await res.json();
   if(!res.ok)throw Error(body.error||'Roadmap currently unavailable');
   const state:Record<string,ProgressEntry>={},texts:Record<string,string>={};
   for(const item of body.progress as ProgressEntry[]){state[item.item_id]=item;texts[item.item_id]=item.notes||''}
   setProgress(state);setDrafts(texts);setNotice('Your project roadmap is available. All progress is self-reported and saved independently of live GNS3 networks.');
  }catch(e){setNotice(e instanceof Error?e.message:'Could not load progress')}
 },[]);
 useEffect(()=>{void load()},[load]);
 const filtered=useMemo(()=>track==='all'?projectRoadmap:projectRoadmap.filter(m=>m.domain.includes(track)),[track]);
 const month=projectRoadmap.find(m=>m.month===selected)||projectRoadmap[0];
 const done=projectPhases.filter(x=>progress['project_step:'+x.id]?.status==='completed').length;
 const completedMonths=projectRoadmap.filter(m=>m.steps.every(x=>progress['project_step:'+x.id]?.status==='completed')).length;
 const save=async(id:string,status:Status)=>{
  const key='project_step:'+id;setSaving(key);
  try{
   const result=await fetch('/api/studio/roadmap',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'project_step',id,status,notes:drafts[key]??progress[key]?.notes??''})});
   const body=await result.json();
   if(!result.ok)throw Error(body.error||'Save failed');
   setProgress(v=>({...v,[key]:body.entry}));setDrafts(v=>({...v,[key]:body.entry.notes||''}));
   setNotice('Saved '+id+' to PostgreSQL. No work was executed or approved automatically.');
  }catch(e){setNotice(e instanceof Error?e.message:'Failed to save')}finally{setSaving('')}
 };
 const chooseTrack=(v:TrackId|'all')=>{setTrack(v);const first=v==='all'?1:projectRoadmap.find(m=>m.domain.includes(v))?.month||1;setSelected(first)};
 const stepComplete=month.steps.filter(s=>progress['project_step:'+s.id]?.status==='completed').length;
 return <div className="projects-roadmap">
  <header className="projects-roadmap-nav"><Link href="/studio"><ArrowLeft size={17}/> ENGINEERING STUDIO</Link><span>PRIVATE / DESIGN · BUILD · TEST · DOCUMENT</span><Link href="/studio/roadmap">COURSES & CERTIFICATIONS <ArrowUpRight size={16}/></Link></header>
  <section className="projects-roadmap-hero"><div><span>YEAR-LONG LAB DELIVERY / 12 PROJECTS</span><h1>BUILD REAL <em>INFRASTRUCTURE SKILLS.</em></h1><p>Structured project work from help desk to enterprise networking, identity, Linux, firewall, SOC and controlled offensive-security labs. Each step tells you what to study, implement, verify and deliver.</p><div className="projects-roadmap-numbers"><span><b>12</b> monthly projects</span><span><b>48</b> practical phases</span><span><b>{done}</b> completed steps</span><span><b>{completedMonths}</b> finished projects</span></div></div><div className="projects-roadmap-progress"><span>PERSONAL PROJECT COMPLETION</span><strong>{Math.round(done/projectPhases.length*100)}%</strong><div role="progressbar" aria-label="Project roadmap completion" aria-valuemin={0} aria-valuemax={48} aria-valuenow={done}><i style={{width:(done/projectPhases.length*100)+'%'}}/></div><small>{projectPhases.length-done} remaining phases · 3–5 h/week suggested, adaptable</small></div></section>
  <div className="projects-roadmap-notice" role="status">{notice}</div>
  <section className="projects-roadmap-body"><div className="projects-roadmap-heading"><span>01 / PROJECT PIPELINE</span><h2>Choose a project and specialization</h2><p>Project status begins at Planned. Lab results and certificates are not claimed on your behalf.</p></div>
  <div className="projects-track-filter" aria-label="Project specialization filter">{[{id:'all' as const,title:'All fields'},...roadmapTracks.map(t=>({id:t.id,title:t.title}))].map(t=><button key={t.id} type="button" aria-pressed={track===t.id} className={track===t.id?'active':''} onClick={()=>chooseTrack(t.id)}>{t.title}</button>)}</div>
  <div className="projects-month-tabs">{filtered.map(m=><button key={m.month} type="button" className={selected===m.month?'active':''} aria-pressed={selected===m.month} onClick={()=>setSelected(m.month)}><b>{String(m.month).padStart(2,'0')}</b><span>{m.name}</span><small>{m.steps.filter(s=>progress['project_step:'+s.id]?.status==='completed').length}/4 verified-by-user</small></button>)}</div>
  <section className="projects-project-card" aria-labelledby="project-name"><div className="projects-card-header"><div><span>PROJECT {String(month.month).padStart(2,'0')} / MONTH {month.month} OF 12</span><h2 id="project-name">{month.name}</h2><p>{month.goal}</p></div><div><span>{stepComplete}/4</span><small>PROJECT PHASES COMPLETE</small></div></div>
   <div className="projects-architecture"><div><h3><ClipboardList size={18}/> Lab architecture</h3><p>{month.architecture}</p></div><div><h3><HardDrive size={18}/> Prerequisites & equipment</h3><ul>{month.requirements.map(x=><li key={x}>{x}</li>)}</ul></div></div>
   <div className="projects-tech-strip">{month.stack.map(name=><TechnologyLogo key={name} name={name}/>)}</div>
   {month.studioSlug&&<Link href={'/studio/'+month.studioSlug} className="projects-open-studio"><FlaskConical size={17}/> Open matching Engineering Studio workspace <ArrowUpRight size={16}/></Link>}
  </section>
  <div className="projects-roadmap-heading"><span>02 / IMPLEMENTATION CHECKLIST</span><h2>Learn → Build → Test → Deliver</h2><p>Write observed results and link your evidence. Updating the status saves the stage to PostgreSQL; it does not start virtual machines or run commands.</p></div>
  <div className="projects-step-list">{month.steps.map((phase,index)=>{
   const key='project_step:'+phase.id,status=progress[key]?.status||'planned';
   return <article className="projects-step" key={phase.id}><div className="projects-step-number"><span>STEP</span><b>{String(index+1).padStart(2,'0')}</b></div><div className="projects-step-main"><h3>{phase.title}</h3><div className="projects-step-grid"><div><b>LEARN</b><p>{phase.learn}</p></div><div><b>BUILD</b><p>{phase.build}</p></div><div><b>TEST</b><p>{phase.verify}</p></div><div><b>DELIVER</b><p>{phase.evidence}</p></div></div><label htmlFor={'project-notes-'+phase.id}>Your notes / command output reference / actual evidence</label><textarea id={'project-notes-'+phase.id} rows={3} maxLength={1400} value={drafts[key]??''} placeholder="Write findings, link your saved Studio evidence, issues and next steps…" onChange={e=>setDrafts(v=>({...v,[key]:e.target.value}))}/></div><div className="projects-step-controls"><label htmlFor={'project-status-'+phase.id}>STATUS</label><select id={'project-status-'+phase.id} value={status} disabled={saving===key} onChange={e=>void save(phase.id,e.target.value as Status)}><option value="planned">PLANNED</option><option value="in_progress">IN PROGRESS</option><option value="completed">COMPLETED</option></select><button type="button" disabled={saving===key} onClick={()=>void save(phase.id,status)}><Save size={15}/>{saving===key?'Saving…':'Save notes'}</button>{status==='completed'&&<span className="projects-step-done"><CheckCircle2 size={15}/> Recorded complete</span>}</div></article>;
  })}</div>
  <div className="projects-roadmap-lower"><section><div className="projects-roadmap-heading"><span>03 / VALIDATION</span><h2>Acceptance criteria</h2></div><ul className="projects-check-list">{month.acceptance.map(t=><li key={t}><ShieldCheck size={17}/>{t}</li>)}</ul><h3>Deliverables</h3><ul className="projects-check-list">{month.deliverables.map(t=><li key={t}><ClipboardList size={17}/>{t}</li>)}</ul></section>
   <section><div className="projects-roadmap-heading"><span>04 / STUDY MATERIALS</span><h2>Docs, tutorials & courses</h2></div><p>Sources are supporting learning resources. Verify course availability and version in your own Coursera Premium account.</p><div className="projects-materials">{month.materials.map(m=><a key={m.url} href={m.url} target="_blank" rel="noopener noreferrer"><span>{m.type}</span><strong>{m.label}</strong><ExternalLink size={17}/></a>)}</div></section></div>
  </section>
  <footer className="projects-roadmap-footer"><p>Isolated, explicitly authorized labs only. Practical completion is a personal record, not third-party accreditation or production proof.</p><Link href="/studio/roadmap"><BookOpen size={16}/> Learning roadmap & advanced certifications <ArrowUpRight size={16}/></Link></footer>
 </div>;
}
