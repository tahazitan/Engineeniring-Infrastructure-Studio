'use client';
import {useMemo,useState} from 'react';
import {ExternalLink,Save,ShieldCheck} from 'lucide-react';
import {advancedCertifications,certificationFocus} from '@/lib/advanced-certifications';
import type {TrackId} from '@/lib/engineering-roadmap';
type Status='planned'|'in_progress'|'completed';
type Entry={item_id:string;status:Status;notes:string};
type Props={entries:Record<string,Entry>;notes:Record<string,string>;busy:string;setNotes:(key:string,value:string)=>void;update:(type:'week'|'course'|'certification',id:string,status:Status)=>Promise<void>};
const horizons=['all','Year 1 candidate','Year 2–3','Year 3–5+'] as const;
export default function AdvancedCertifications({entries,notes,busy,setNotes,update}:Props){
 const [focus,setFocus]=useState<TrackId|'all'>('all'),[horizon,setHorizon]=useState<typeof horizons[number]>('all');
 const visible=useMemo(()=>advancedCertifications.filter(c=>(focus==='all'||c.tracks.includes(focus))&&(horizon==='all'||c.horizon===horizon)).sort((a,b)=>a.priority-b.priority),[focus,horizon]);
 const recorded=advancedCertifications.filter(c=>entries['certification:'+c.id]?.status==='completed').length;
 return <section className="year-roadmap-advanced" id="advanced-certifications" aria-labelledby="advanced-certs-title">
  <div className="year-roadmap-section-heading"><span>05 / INDUSTRY RECOGNITION / ADVANCED PATHS</span><h2 id="advanced-certs-title">High-value professional certifications</h2><p>Progress from CCNA and hands-on Linux administration toward enterprise architecture, advanced security, cloud infrastructure and ethical offensive testing. Choose credentials for the job you want; collecting everything is not the objective.</p></div>
  <div className="advanced-warning"><ShieldCheck size={24}/><p><strong>Coursera Premium supports training, not automatic vendor exam access.</strong> Certifications such as CCNP, RHCE, AWS Specialty, OSCP and GIAC have separate issuer-defined examination or eligibility requirements. Exact exam versions, prices and policies must be checked with the issuer before enrollment. With 3–5 study hours weekly, most advanced credentials are realistic 2–5-year targets, not a promise for year one.</p></div>
  <div className="advanced-filter-bar">
   <label>CAREER SPECIALTY<select value={focus} onChange={e=>setFocus(e.target.value as TrackId|'all')}><option value="all">All specialties</option>{certificationFocus.filter(x=>x!=='all').map(x=><option key={x} value={x}>{x.toUpperCase()}</option>)}</select></label>
   <label>PLANNING HORIZON<select value={horizon} onChange={e=>setHorizon(e.target.value as typeof horizons[number])}>{horizons.map(x=><option key={x} value={x}>{x==='all'?'All horizons':x}</option>)}</select></label>
   <div className="advanced-count"><strong>{recorded}</strong><span>Self-reported earned / {advancedCertifications.length} mapped</span></div>
  </div>
  <div className="advanced-cert-list">{visible.map(c=>{
   const id='certification:'+c.id,state=entries[id]?.status||'planned';
   return <article key={c.id} className="advanced-cert-entry">
    <div className="advanced-cert-heading"><span>{c.issuer.toUpperCase()} / {c.specialty.toUpperCase()}</span><div><span>{c.level}</span><span>{c.horizon}</span></div></div>
    <div className="advanced-cert-main"><div><h3>{c.name}</h3><p>{c.value}</p><div className="advanced-cert-meta"><strong>PREPARATION</strong><span>{c.requires}</span><strong>ASSESSMENT EVIDENCE</strong><span>{c.proof}</span></div></div><div className="advanced-cert-controls"><a href={c.url} target="_blank" rel="noopener noreferrer">Issuer certification portal <ExternalLink size={15}/></a><label>PERSONAL STATUS<select value={state} onChange={e=>void update('certification',c.id,e.target.value as Status)} disabled={busy===id}><option value="planned">TARGET / NOT STARTED</option><option value="in_progress">PREPARING</option><option value="completed">EARNED (SELF-REPORTED)</option></select></label><label>Evidence / learning plan<textarea rows={3} value={notes[id]??''} onChange={e=>setNotes(id,e.target.value)} placeholder="Official exam result, credential URL or prerequisite notes."></textarea></label><button type="button" onClick={()=>void update('certification',c.id,state)} disabled={busy===id}><Save size={15}/> Save progress</button></div></div>
   </article>;
  })}</div>
 </section>;
}
