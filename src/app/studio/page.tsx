import Link from 'next/link';
import {notFound} from 'next/navigation';
import {isPrivate,listProjects} from '@/lib/server';
import {projects} from '@/lib/catalog';
import RuntimeStatus from '@/components/runtime-status';
import StudioDashboard from '@/components/studio-dashboard';
import {ArrowLeft,ArrowUpRight,ArrowRight,BookOpen} from 'lucide-react';
export const dynamic='force-dynamic';
export const metadata={title:'Engineering Studio'};
export default async function StudioPage(){
 if(!isPrivate())notFound();
 let all=projects;
 try{all=await listProjects()}catch{}
 return <main className="studio-shell">
 <header className="studio-nav"><Link href="/" className="studio-logo"><b>T·</b><span>TAHA INFRASTRUCTURE<br/><small>ENGINEERING STUDIO</small></span></Link><span className="studio-mode"><i/> LOCAL ENGINEERING ENVIRONMENT</span><Link href="/" className="studio-exit"><ArrowLeft size={15}/> IT Services</Link></header>
 <section className="studio-intro"><div className="eyebrow">PRIVATE ENGINEERING WORKSPACE / PROJECT REGISTER</div><h1>ENGINEERING <em>STUDIO.</em></h1><p>Architecture, configuration, diagnostics, verification and evidence—all connected in one technical environment.</p></section>
 <RuntimeStatus/>
 <section className="studio-year-callout"><div><span>PERSONAL DEVELOPMENT / 52-WEEK PROGRAM</span><h2>YOUR ENGINEERING ROADMAP</h2><p>IT Support · CCNA Networking · Windows Server · Linux · SOC · Ethical Hacking · Red Team</p></div><Link href="/studio/roadmap"><BookOpen size={19}/> OPEN 12-MONTH TRAINING PROGRAM <ArrowUpRight size={16}/></Link></section>
 <StudioDashboard projects={all}/>
 <footer className="studio-small-footer"><span>TAHA INFRASTRUCTURE STUDIO — DESIGN. CONFIGURE. VERIFY.</span><Link href="/">CLIENT SERVICES <ArrowRight size={13}/></Link></footer>
 </main>
}
