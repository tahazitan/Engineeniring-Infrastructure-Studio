'use client';
import {useMemo,useState,useEffect} from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ArrowUpRight,ArrowRight,Network,ShieldCheck,Layers3,Activity,Terminal,GitBranch} from 'lucide-react';
import type {Project} from '@/lib/types';
import HeroScene from './hero-scene';
import TopologyPreview from './topology-preview';
import TechnologyLogo,{featuredTechnologies} from './technology-logo';

const capabilities=[
 {id:'01',title:'Enterprise Networking',details:'Switching, routing, segmentation, WAN connectivity and diagnostics.',stack:['Cisco','GNS3','Linux'],Icon:Network},
 {id:'02',title:'Systems & Platforms',details:'Linux, Windows Server, directory services, virtualization and support.',stack:['Linux','Proxmox','Docker'],Icon:Layers3},
 {id:'03',title:'Cybersecurity Operations',details:'Firewalls, traffic analysis, secure access and defensive engineering.',stack:['Fortinet','Palo Alto','Wireshark'],Icon:ShieldCheck},
 {id:'04',title:'Monitoring & Automation',details:'Observability, network health, automation, verification and evidence.',stack:['Grafana','Ansible','PostgreSQL'],Icon:Activity},
];
export default function Home({projects,studioEnabled}:{projects:Project[];studioEnabled:boolean}){
 const [filter,setFilter]=useState('All');
 const domains=['All',...new Set(projects.map(x=>x.domain))];
 const filtered=useMemo(()=>filter==='All'?projects:projects.filter(x=>x.domain===filter),[filter,projects]);
 useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 gsap.registerPlugin(ScrollTrigger);
 const fx=gsap.utils.toArray<HTMLElement>('.capability-card,.project-card,.section-top').map(el=>gsap.fromTo(el,{y:24,opacity:.4},{y:0,opacity:1,duration:.65,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
 return ()=>{fx.forEach(x=>x.kill());};},[filter]);
 return <main id="top" className="shell cyber-site">
  <div className="site-frame">
   <header className="nav"><Link href="/" className="brand"><span className="brand-symbol">T<span>·</span></span><span>TAHA <strong>INFRASTRUCTURE</strong><small>ENGINEERING STUDIO</small></span></Link>
    <nav aria-label="Main navigation"><a href="#top">Home</a><a href="#expertise">Expertise</a><a href="#work">Projects</a><a href="#about">About</a></nav>
    <div className="nav-right"><a className="nav-contact" href="https://github.com/tahazitan" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={15}/></a>{studioEnabled&&<Link className="nav-studio" href="/studio">Launch Studio <ArrowUpRight size={15}/></Link>}</div>
   </header>
   <section className="hero" aria-labelledby="hero-title">
    <div className="hero-cross" aria-hidden="true">×</div><div className="hero-dot" aria-hidden="true"/>
    <div className="hero-copy">
     <div className="eyebrow"><span className="beacon"/> NETWORKS / SYSTEMS / SECURITY <span className="eyebrow-count">— EST. 2026</span></div>
     <div className="hero-kicker">DESIGN. DEPLOY. DEFEND.</div>
     <h1 id="hero-title">INFRASTRUCTURE<br/><span className="serif">STUDIO<span className="hero-underscore">_</span></span></h1>
     <p className="hero-subtitle">Engineering networks, systems and secure infrastructure.</p>
     <p className="hero-description">An interactive platform for architecture, configuration, troubleshooting and technical verification—built for a real engineering workflow.</p>
     <div className="hero-actions"><Link href={studioEnabled?'/studio':'#work'} className="primary-link">{studioEnabled?'Open engineering workspace':'Explore projects'} <ArrowUpRight size={17}/></Link><a href="#work" className="secondary-link">View topologies <ArrowRight size={16}/></a></div>
     <div className="hero-stat-strip"><div><strong>{String(projects.length).padStart(2,'0')}</strong><span>PROJECT BLUEPRINTS</span></div><div><strong>GNS3</strong><span>TOPOLOGY INTEGRATION</span></div><div><strong>3D</strong><span>INTERACTIVE VISUALIZATION</span></div></div>
    </div>
    <HeroScene/>
    <div className="hero-circuit hero-circuit-one" aria-hidden="true"/><div className="hero-circuit hero-circuit-two" aria-hidden="true"/>
    <div className="hero-vertical-label">SYS. / NET. / SEC. <span>0026</span></div>
   </section>
   <div className="tech-marquee"><span className="tech-caption"><span className="beacon"/> TECHNOLOGY STACK</span><div className="tech-track">{featuredTechnologies.map(name=><TechnologyLogo key={name} name={name}/>)}</div></div>
  </div>
  <section className="section expertise-section" id="expertise"><div className="section-top"><div><span className="section-tag">01 / ENGINEERING DISCIPLINES</span><h2>Systems behind<br/><em>the interface.</em></h2></div><p>Architecture, operations and cybersecurity with the tools and protocols engineers use every day.</p></div>
   <div className="capability-grid">{capabilities.map(({id,title,details,stack,Icon})=><article key={id} className="capability-card"><div className="capability-top"><span>{id} / PRACTICE</span><Icon size={29} strokeWidth={1.3}/></div><h3>{title}</h3><p>{details}</p><div className="capability-logos">{stack.map(name=><TechnologyLogo key={name} name={name} compact/>)}</div></article>)}</div>
  </section>
  <section className="section work-section" id="work"><div className="section-top"><div><span className="section-tag">02 / ENGINEERING PROJECT REGISTER</span><h2>Network diagrams.<br/><em>Executable thinking.</em></h2></div><p>Explore real project specifications, configuration workspaces, technical checklists and visual topology blueprints. Execution and verification are tracked separately.</p></div>
   <div className="filter-row" role="group" aria-label="Filter engineering projects">{domains.map(d=><button type="button" aria-pressed={filter===d} key={d} className={'filter'+(filter===d?' active':'')} onClick={()=>setFilter(d)}>{d}</button>)}<span className="filter-count">{filtered.length} WORKSPACES</span></div>
   <div className="project-grid">{filtered.map((p,i)=><Link key={p.slug} className="project-card" href={studioEnabled?'/studio/'+p.slug:'#about'}>
    <div className="project-card-top"><span>{p.domain.toUpperCase()} / {String(i+1).padStart(2,'0')}</span><span className={'project-state '+p.status}>{p.status.replace('_',' ').toUpperCase()}</span></div>
    <div className="project-graphic"><TopologyPreview project={p}/></div>
    <div className="project-card-bottom"><h3>{p.title}</h3><p>{p.summary}</p><div className="tags">{p.stack.slice(0,4).map(name=><TechnologyLogo key={name} name={name} compact/>)}</div><div className="project-open">VIEW ENGINEERING WORKSPACE <ArrowUpRight size={15}/></div></div>
   </Link>)}</div>
  </section>
  <section className="section about-section" id="about"><span className="section-tag">03 / ENGINEERING PHILOSOPHY</span><div className="about-layout"><div className="large-quote">Good infrastructure is not just deployed. <em>It is understood, tested and maintained.</em></div><div className="about-side"><span className="micro"><GitBranch size={14}/> TAHA ZITANE / MOROCCO</span><h3>From topology to operations.</h3><p>A systems and network engineering workspace for designing, documenting and testing infrastructure. Project status and evidence reflect actual verification—not assumptions.</p><a className="primary-link" href="https://www.linkedin.com/in/taha-zitane/fr" target="_blank" rel="noopener noreferrer">Professional profile <ArrowUpRight size={17}/></a></div></div></section>
  <footer className="footer"><div className="footer-mark">T<span>·</span></div><div><b>TAHA INFRASTRUCTURE STUDIO</b><p>NETWORKS · SYSTEMS · CYBERSECURITY</p></div><div className="footer-links"><Link href={studioEnabled?'/studio':'/'}>{studioEnabled?'Engineering studio':'Projects'} ↗</Link><a href="https://github.com/tahazitan" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="#top">Back to top ↑</a></div><span className="footer-right">© {new Date().getFullYear()} TAHA ZITANE</span></footer>
 </main>;
}
