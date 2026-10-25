'use client';
import type {Project} from '@/lib/types';
import {CheckCircle2,ClipboardCheck,BookOpen,ArrowUpRight} from 'lucide-react';
type Props={project:Project;onChecklist:(id:string,done:boolean)=>void;onTest:(id:string,status:'pending'|'passed'|'failed',notes?:string)=>void;onSave:()=>void};
export default function TrainingRoadmap({project,onChecklist,onTest,onSave}:Props){
 const total=project.checklist.length,finished=project.checklist.filter(x=>x.done).length;
 const pass=project.test_plan.filter(x=>x.status==='passed').length;
 const percent=total?Math.round(finished/total*100):0;
 const next=project.checklist.find(x=>!x.done);
 return <div className="training-roadmap">
  <div className="training-overview"><div><span>PROJECT ROADMAP / ACTUAL SAVED CHECKLIST</span><h2>{project.title}</h2><p>{project.summary}</p></div><div className="training-progress"><b>{percent}%</b><small>CHECKLIST PROGRESS</small><div role="progressbar" aria-label="Checklist progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{width:percent+'%'}}/></div></div></div>
  <div className="training-grid">
   <section className="wb-section"><h3><BookOpen size={19}/> Learning objectives</h3><ol className="training-objectives">{project.objectives.map((goal,i)=><li key={i}><span>{String(i+1).padStart(2,'0')}</span><p>{goal}</p></li>)}</ol><div className="training-next"><span>NEXT UNFINISHED ACTION</span><strong>{next?next.title:'No unfinished checklist item'}</strong></div></section>
   <section className="wb-section"><h3><CheckCircle2 size={19}/> Work checklist</h3><p className="wb-hint">These tasks are part of the saved project specification. Mark only work you actually completed. Changes remain drafts until Save Project.</p>{project.checklist.map(x=><label className="training-task" key={x.id}><input type="checkbox" checked={x.done} onChange={e=>onChecklist(x.id,e.target.checked)}/><span className={x.done?'training-done':''}>{x.title}</span></label>)}</section>
  </div>
  <section className="wb-section training-tests"><div className="training-test-title"><div><h3><ClipboardCheck size={19}/> Practical verification exercises</h3><p className="wb-hint">Use a real GNS3 run, command output or authorized lab test before marking PASSED. If no test was executed, leave PENDING.</p></div><span>{pass}/{project.test_plan.length} passed</span></div>
   {project.test_plan.map((t,i)=><div className="training-test" key={t.id}><div><b>{String(i+1).padStart(2,'0')} / {t.title}</b><textarea value={t.notes||''} onChange={e=>onTest(t.id,t.status,e.target.value)} aria-label={'Observed results for '+t.title} placeholder="Test command, environment, observed output, pass/fail rationale…"/></div><select aria-label={'Result for '+t.title} value={t.status} onChange={e=>onTest(t.id,e.target.value as 'pending'|'passed'|'failed')}><option value="pending">PENDING</option><option value="passed">PASSED</option><option value="failed">FAILED</option></select></div>)}
  </section>
  <div className="training-actions"><p>Progress is derived from project records. The project remains unverified until all acceptance checks and required evidence are validated.</p><button type="button" className="wb-control primary" onClick={onSave}>Save roadmap progress <ArrowUpRight size={17}/></button></div>
 </div>;
}
