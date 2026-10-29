import Link from 'next/link';
import {notFound} from 'next/navigation';
import {isPrivate,listProjects} from '@/lib/server';
import {projects} from '@/lib/catalog';
import RuntimeStatus from '@/components/runtime-status';
import StudioDashboard from '@/components/studio-dashboard';
import RemoteCareerLabs from '@/components/remote-career-labs';
import {ArrowLeft,ArrowUpRight,ArrowRight,BookOpen} from 'lucide-react';
export const dynamic='force-dynamic';
export const metadata={title:'Engineering Studio'};
export default async function StudioPage(){
 if(!isPrivate())notFound();
 let all=projects;
 try{all=await listProjects()}catch{}
 return <main className="studio-shell">
 <header className="studio-nav"><Link href="/" className="studio-logo"><b>T·</b><span>TAHA INFRASTRUCTURE<br/><small>ENGINEERING STUDIO</small></span></Link><span className="studio-mode"><i/> LOCAL ENGINEERING ENVIRONMENT</span><Link href="/" className="studio-exit"><ArrowLeft size={15}/> IT Services</Link></header>
 <section className="studio-intro"><div className="eyebrow">PRIVATE ENGINEERING WORKSPACE / PROJECT REGISTER</div><h1>REMOTE CAREER <em>ENGINEERING STUDIO.</em></h1><p>Focused preparation for international IT Support, Systems Administrator and Infrastructure Support roles, through real diagnostics, tested configurations and practical evidence.</p></section>
 <RuntimeStatus/>
 <RemoteCareerLabs/>
 <section className="studio-year-callout"><div><span>PERSONAL DEVELOPMENT / 52-WEEK PROGRAM</span><h2>YOUR ENGINEERING ROADMAP</h2><p>IT Support · Windows Server / Active Directory · Linux · Networking · Monitoring · Cloud Foundations</p></div><Link href="/studio/roadmap"><BookOpen size={19}/> EXPLORE LEARNING & CERTIFICATIONS <ArrowUpRight size={16}/></Link></section>
 <section className="studio-year-callout studio-project-callout"><div><span>PROJECT DELIVERY / 12 MONTHS / 48 BUILD & TEST STEPS</span><h2>BUILD YOUR INFRASTRUCTURE PROJECTS.</h2><p>Support, Active Directory, Cisco, Linux, VPN, Zabbix, Wazuh, Virtualization, Automation and Security labs — learn, implement, test and record evidence.</p></div><Link href="/studio/projects-roadmap"><BookOpen size={19}/> OPEN PROJECT BUILD ROADMAP <ArrowUpRight size={16}/></Link></section>
 <StudioDashboard projects={all}/>
 <footer className="studio-small-footer"><span>TAHA INFRASTRUCTURE STUDIO — DESIGN. CONFIGURE. VERIFY.</span><Link href="/">CAREER PORTFOLIO & SERVICES <ArrowRight size={13}/></Link></footer>
 </main>
}
