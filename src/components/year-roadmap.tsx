'use client';
import {useCallback,useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowUpRight,BookOpen,CheckCircle2,ClipboardCheck,ExternalLink,Network,Save,Search,ShieldCheck} from 'lucide-react';
import {roadmapTracks,roadmapMonths,roadmapWeeks,roadmapCourses,roadmapCourseById,type TrackId} from '@/lib/engineering-roadmap';
import TechnologyLogo from '@/components/technology-logo';
import AdvancedCertifications from '@/components/advanced-certifications';
type Status='planned'|'in_progress'|'completed';
type Entry={item_id:string;status:Status;notes:string;updated_at:string};
const statusNames:Record<Status,string>={planned:'PLANNED',in_progress:'IN PROGRESS',completed:'COMPLETED'};
export default function YearRoadmap(){
 const [entries,setEntries]=useState<Record<string,Entry>>({});
 const [notes,setNotes]=useState<Record<string,string>>({});
 const [filter,setFilter]=useState<TrackId|'all'>('all');
 const [month,setMonth]=useState(1);
 const [busy,setBusy]=useState('');
 const [feedback,setFeedback]=useState('Checking saved roadmap progress...');
 const load=useCallback(async()=>{
  try{
   const response=await fetch('/api/studio/roadmap',{cache:'no-store'});
   const body=await response.json();
   if(!response.ok)throw Error(body.error||'Progress unavailable');
   const next:Record<string,Entry>={};const drafts:Record<string,string>={};
   (body.progress as Entry[]).forEach(item=>{next[item.item_id]=item;drafts[item.item_id]=item.notes||''});
   setEntries(next);setNotes(drafts);setFeedback('Your 52-week learning plan is ready. Progress updates are saved to PostgreSQL.');
  }catch(e){setFeedback(e instanceof Error?e.message:'Cannot load roadmap')}
 },[]);
 useEffect(()=>{void load()},[load]);
 const update=async(type:'week'|'course'|'certification',id:string,status:Status)=>{
  const key=type+':'+id;setBusy(key);setFeedback('Saving '+key+'...');
  try{
   const response=await fetch('/api/studio/roadmap',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,id,status,notes:notes[key]??entries[key]?.notes??''})});
   const body=await response.json();
   if(!response.ok)throw Error(body.error||'Save failed');
   setEntries(prev=>({...prev,[key]:body.entry}));setNotes(prev=>({...prev,[key]:body.entry.notes||''}));
   setFeedback('Saved '+key+' to PostgreSQL. Only actions you explicitly record affect progress.');
  }catch(e){setFeedback(e instanceof Error?e.message:'Save failed')}finally{setBusy('')}
 };
 const totalDone=roadmapWeeks.filter(w=>entries['week:'+w.number]?.status==='completed').length;
 const progress=Math.round(totalDone/52*100);
 const selectedMonth=roadmapMonths[month-1];
 const filteredWeeks=selectedMonth.weeks.map((_title,index)=>{
  const offset=roadmapMonths.slice(0,selectedMonth.number-1).reduce((sum,m)=>sum+m.weeks.length,0);
  return roadmapWeeks[offset+index];
 }).filter(w=>filter==='all'||w.tracks.includes(filter));
 const relatedMonths=filter==='all'?roadmapMonths:roadmapMonths.filter(m=>m.tracks.includes(filter));
 const relatedCourses=useMemo(()=>{
  const ids=new Set((filter==='all'?roadmapMonths:relatedMonths).flatMap(m=>m.courses));
  return roadmapCourses.filter(c=>ids.has(c.id));
 },[filter]);
 const chooseTrack=(next:TrackId|'all')=>{setFilter(next);const first=next==='all'?1:roadmapMonths.find(m=>m.tracks.includes(next))?.number||1;setMonth(first)};
 return <div className="year-roadmap">
  <header className="year-roadmap-top"><Link href="/studio"><ArrowLeft size={16}/> ENGINEERING STUDIO</Link><span>PERSONAL DEVELOPMENT / 52 WEEKS / PRIVATE</span><Link href="/studio/enterprise-multisite"><Network size={16}/> ENTERPRISE LAB</Link></header>
  <section className="year-roadmap-hero">
   <div><span className="year-roadmap-eyebrow">PROFESSIONAL ENGINEERING DEVELOPMENT · 3–5 HOURS / WEEK</span><h1>THE 12-MONTH <em>ENGINEERING ROADMAP.</em></h1><p>From IT Support and Cisco networking through Windows/Linux administration, security operations, ethical penetration testing and Red Team simulations — organized into weekly practice, source-linked learning and tangible lab outcomes.</p><div className="year-roadmap-stats"><span><b>12</b> Months</span><span><b>52</b> Weeks</span><span><b>10</b> Skill tracks</span><span><b>{totalDone}</b> Completed</span></div></div>
   <div className="year-roadmap-meter"><strong>{progress}%</strong><small>YOUR RECORDED LEARNING PROGRESS</small><div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Self-reported roadmap completion"><span style={{width:progress+'%'}}/></div><p>{52-totalDone} weeks remaining on your personal plan</p></div>
  </section>
  <div className="year-roadmap-notice" role="status">{feedback}</div>
  <div className="roadmap-dual-nav"><Link href="/studio/projects-roadmap">Build projects alongside this training plan <ArrowUpRight size={16}/></Link></div>
  <section className="year-roadmap-tracks" aria-label="Choose career track"><div className="year-roadmap-section-heading"><span>01 / CAREER TRACKS</span><h2>Choose a specialization</h2><p>Each track includes its own topics, labs, assessment criteria and Coursera resources. Select a track to focus the calendar.</p></div><div className="year-track-grid">
   <button type="button" onClick={()=>chooseTrack('all')} aria-pressed={filter==='all'} className={filter==='all'?'active':''}><span>00</span><strong>COMPLETE ENGINEERING PATH</strong><small>All disciplines · 52-week plan</small></button>
   {roadmapTracks.map((track,index)=><button type="button" key={track.id} aria-pressed={filter===track.id} className={filter===track.id?'active':''} onClick={()=>chooseTrack(track.id)}><span>{String(index+1).padStart(2,'0')}</span><strong>{track.title}</strong><small>{track.months.map(i=>'M'+i).join(' / ')}</small></button>)}
  </div>
  {filter!=='all'&&<div className="year-track-summary"><div><h3>{roadmapTracks.find(t=>t.id===filter)?.title}</h3><p>{roadmapTracks.find(t=>t.id===filter)?.summary}</p><strong>Target: {roadmapTracks.find(t=>t.id===filter)?.target}</strong></div><div className="year-track-logos">{roadmapTracks.find(t=>t.id===filter)?.tools.map(t=><TechnologyLogo key={t} name={t}/>)}</div></div>}
  </section>
  <section className="year-roadmap-main"><div className="year-roadmap-section-heading"><span>02 / YEARLY TRAINING PROGRAM</span><h2>Monthly progression</h2><p>Every month has a practical deliverable, test criteria and targeted course. Your completion status is never changed automatically.</p></div>
  <div className="year-month-switcher" role="group" aria-label="Select month">{relatedMonths.map(m=><button type="button" key={m.number} className={month===m.number?'active':''} aria-pressed={month===m.number} onClick={()=>setMonth(m.number)}><b>{String(m.number).padStart(2,'0')}</b><span>{m.title}</span></button>)}</div>
  <div className="year-month-detail"><div><span>MONTH {String(selectedMonth.number).padStart(2,'0')} / 12</span><h3>{selectedMonth.title}</h3><p>{selectedMonth.focus}</p></div><div><b>DELIVERABLE</b><p>{selectedMonth.deliverable}</p><b>ACCEPTANCE TEST</b><p>{selectedMonth.check}</p></div></div>
  <div className="year-week-list">{filteredWeeks.map(w=>{
   const key='week:'+w.number,status=entries[key]?.status||'planned';
   return <article className={'year-week-row week-'+status} key={key}>
    <div className="year-week-index">WK <b>{String(w.number).padStart(2,'0')}</b></div>
    <div className="year-week-main"><h4>{w.title}</h4><p>{w.focus}</p><label htmlFor={'week-note-'+w.number}>Lab notes / proof / next action</label><textarea id={'week-note-'+w.number} maxLength={1400} rows={2} value={notes[key]??''} onChange={e=>setNotes(p=>({...p,[key]:e.target.value}))} placeholder="Write actual observations, test outputs, GitHub commit or lab notes..."/></div>
    <div className="year-week-actions"><select aria-label={'Week '+w.number+' status'} value={status} onChange={e=>void update('week',String(w.number),e.target.value as Status)} disabled={busy===key}><option value="planned">PLANNED</option><option value="in_progress">IN PROGRESS</option><option value="completed">COMPLETED</option></select><button type="button" disabled={busy===key} onClick={()=>void update('week',String(w.number),status)}><Save size={14}/>{busy===key?'Saving…':'Save notes'}</button>{status==='completed'&&<span className="year-week-complete"><CheckCircle2 size={14}/> Recorded complete</span>}</div>
   </article>;
  })}</div>
  {filteredWeeks.length===0&&<p>No weeks in this month for the selected track.</p>}
  </section>
  <section className="year-roadmap-courses"><div className="year-roadmap-section-heading"><span>03 / VERIFIED LEARNING CATALOG</span><h2>Coursera learning & course certificates</h2><p>These are Coursera course pages found in the connected catalog. Your Premium access may cover many courses or specializations; check eligibility for each one. Enrollment, certificate eligibility and payment depend on the course and your account; no certificate is marked earned unless you do so yourself.</p></div><div className="year-course-list">{relatedCourses.map(c=>{
   const key='course:'+c.id,st=entries[key]?.status||'planned';
   return <article key={c.id}><div><span>{c.provider}</span><h3>{c.title}</h3><p>{c.scope}</p></div><div><a href={c.url} target="_blank" rel="noopener noreferrer">View Coursera course <ExternalLink size={15}/></a><select aria-label={c.title+' progress'} value={st} disabled={busy===key} onChange={e=>void update('course',c.id,e.target.value as Status)}><option value="planned">TO EXPLORE</option><option value="in_progress">STUDYING</option><option value="completed">COMPLETED (SELF-REPORTED)</option></select></div></article>;
  })}</div>
  </section>
  <AdvancedCertifications entries={entries} notes={notes} busy={busy} setNotes={(key,value)=>setNotes(prev=>({...prev,[key]:value}))} update={update}/>
  <section className="year-roadmap-cert"><div><ShieldCheck size={29}/><span>04 / CERTIFICATION STRATEGY</span><h2>Skills first. Credentials after verification.</h2><p>Review CCNA for networking, Microsoft identity/server fundamentals, Linux administration credentials, Security+ and junior security testing certificates as optional independent examination targets. Coursera course certificates are learning achievements, not substitutes for vendor exams.</p></div><div><BookOpen size={26}/><h3>Weekly allocation · 3–5 hours</h3><p>1 h course lessons · 2–3 h hands-on lab · 30–60 min documentation and verification. Keep real GNS3 outputs and reports in the project Evidence Vault.</p><Link href="/studio">Open engineering projects <ArrowUpRight size={16}/></Link></div></section>
 </div>;
}
