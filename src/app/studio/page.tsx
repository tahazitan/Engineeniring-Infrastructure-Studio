import Link from 'next/link';
import {notFound} from 'next/navigation';
import {isPrivate,listProjects} from '@/lib/server';
import {projects} from '@/lib/catalog';
import RuntimeStatus from '@/components/runtime-status';
import {ArrowLeft,ArrowUpRight,ArrowRight} from 'lucide-react';
export const dynamic='force-dynamic';
export const metadata={title:'Engineering Studio'};
export default async function StudioPage(){
 if(!isPrivate())notFound();
 let all=projects;
 try{all=await listProjects()}catch{}
 return <main className="studio-shell">
 <header className="studio-nav"><Link href="/" className="studio-logo"><b>T·</b><span>TAHA INFRASTRUCTURE<br/><small>ENGINEERING STUDIO</small></span></Link><span className="studio-mode"><i/> LOCAL ENGINEERING ENVIRONMENT</span><Link href="/" className="studio-exit"><ArrowLeft size={15}/> Portfolio</Link></header>
 <section className="studio-intro"><div className="eyebrow">PRIVATE ENGINEERING WORKSPACE / PROJECT REGISTER</div><h1>ENGINEERING <em>STUDIO.</em></h1><p>Architecture, configuration, diagnostics, verification and evidence—all connected in one technical environment.</p></section>
 <RuntimeStatus/>
 <div className="studio-index-title"><span>ENGINEERING PROJECTS</span><span>{String(all.length).padStart(2,'0')} WORKSPACES</span></div>
 <div className="studio-index">{all.map((p,i)=><Link href={'/studio/'+p.slug} className="studio-index-item" key={p.slug}><span className="studio-index-number">{String(i+1).padStart(2,'0')}</span><span className="studio-index-main"><b>{p.title}</b><small>{p.domain} / {p.stack.slice(0,3).join(' · ')}</small></span><span className={'status-chip status-'+p.status}>{p.status.replace('_',' ').toUpperCase()}</span><ArrowUpRight size={19}/></Link>)}</div>
 <footer className="studio-small-footer"><span>TAHA INFRASTRUCTURE STUDIO — DESIGN. DEPLOY. DEFEND.</span><Link href="/">PUBLIC EXPERIENCE <ArrowRight size={13}/></Link></footer>
 </main>
}
