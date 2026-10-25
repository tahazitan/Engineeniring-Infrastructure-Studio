'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,ArrowRight,Search,Network,Terminal,Shield,Activity,ExternalLink,Menu,ChevronRight} from 'lucide-react';
import type {Project} from '@/lib/types';
import TechnologyLogo,{featuredTechnologies} from './technology-logo';
import TopologyPreview from './topology-preview';
import HeroNetwork from './hero-network';
import NetworkShowcase from './network-showcase';

const disciplines=[
 {code:'01',name:'Network Infrastructure',summary:'Routing, switching, VLAN design, WAN connectivity, segmentation and diagnostics.',Icon:Network,stack:['Cisco','GNS3','Linux']},
 {code:'02',name:'Systems Administration',summary:'Linux and Windows services, virtualization, identity and day-to-day system operations.',Icon:Terminal,stack:['Linux','Proxmox','Docker']},
 {code:'03',name:'Security Engineering',summary:'Firewall policy, secure VPN architecture, traffic inspection and endpoint visibility.',Icon:Shield,stack:['Fortinet','Palo Alto','Wireshark']},
 {code:'04',name:'Monitoring & Automation',summary:'Infrastructure metrics, operational alerts, reproducible configuration and verification.',Icon:Activity,stack:['Grafana','Ansible','PostgreSQL']},
];
export default function Home({projects,studioEnabled}:{projects:Project[];studioEnabled:boolean}){
 const [domain,setDomain]=useState('All');
 const [search,setSearch]=useState('');
 const [showSearch,setShowSearch]=useState(false);
 const [mobileNav,setMobileNav]=useState(false);
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.documentElement.classList.add('template-motion-ready');
  const els=[...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  if(!('IntersectionObserver' in window))return;
  const ob=new IntersectionObserver(entries=>entries.forEach(e=>{
   if(e.isIntersecting){e.target.classList.add('is-visible');ob.unobserve(e.target)}
  }),{rootMargin:'0px 0px -35px 0px',threshold:.08});
  els.forEach(e=>ob.observe(e));
  return ()=>ob.disconnect();
 },[domain,search]);
 const domains=['All',...new Set(projects.map(p=>p.domain))];
 const result=projects.filter(p=>(domain==='All'||p.domain===domain)&&((p.title+' '+p.summary+' '+p.stack.join(' ')).toLowerCase().includes(search.toLowerCase())));
 return <main id="top" className="template-page">
  <section className="template-intro" aria-label="Taha Infrastructure Studio">
   <div className="template-heading">TAHA / ENGINEERING STUDIO</div>
   <div className="template-frame">
    <header className="template-nav">
     <Link className="template-brand" href="/">TAHA <span>INFRASTRUCTURE</span></Link>
     <nav className={mobileNav?'template-links open':'template-links'} aria-label="Primary navigation">
      <a href="#top" onClick={()=>setMobileNav(false)}>Home</a>
      <a href="#about" onClick={()=>setMobileNav(false)}>About</a>
      <a href="#projects" onClick={()=>setMobileNav(false)}>Projects</a>
      <a href="#services" onClick={()=>setMobileNav(false)}>Services</a>
     </nav>
     <div className="template-nav-end">
      {studioEnabled?<Link href="/studio" className="template-signin">Open Studio</Link>:<a className="template-signin" href="#projects">Projects</a>}
      <button className="template-search-button" type="button" aria-label="Search projects" onClick={()=>setShowSearch(v=>!v)}><Search size={22}/></button>
      <button className="template-mobile-menu" type="button" aria-label="Toggle navigation" aria-expanded={mobileNav} onClick={()=>setMobileNav(x=>!x)}><Menu size={23}/></button>
     </div>
    </header>
    {showSearch&&<form className="template-search-panel" onSubmit={e=>{e.preventDefault();setShowSearch(false);document.getElementById('projects')?.scrollIntoView({behavior:'smooth'});}}><Search size={19}/><input type="search" autoFocus placeholder="Search routing, firewalls, monitoring…" value={search} onChange={e=>setSearch(e.target.value)} aria-label="Search engineering projects"/><button type="submit">Search projects →</button></form>}
    <div className="template-hero">
     <div className="template-lines" aria-hidden="true"></div>
     <svg className="template-decoration" viewBox="0 0 1340 680" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 45 Q135 -44 285 88" fill="none" stroke="#8c49f9" strokeWidth="4" strokeDasharray="11 12" strokeLinecap="round"/>
      <path d="M243 100 L274 107 L258 80" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1040 118 L1135 118 L1245 32 L1340 32" fill="none" stroke="#4d748c" strokeWidth="4"/>
      <path d="M0 492 L58 551 L337 551" fill="none" stroke="#567c96" strokeWidth="4"/>
      <path d="M0 655 L81 572 L224 572" fill="none" stroke="#567c96" strokeWidth="4"/>
      <path d="M465 607 L594 607 L716 680" fill="none" stroke="#567c96" strokeWidth="4"/>
      <rect x="337" y="546" width="11" height="11" fill="#567c96"/><rect x="222" y="567" width="11" height="11" fill="#567c96"/>
      <circle cx="1030" cy="75" r="22" fill="#05c8ef"/>
      <path d="M1248 154 l15 10 l15 -10 M1248 172 l15 10 l15 -10 M1248 190 l15 10 l15 -10" fill="none" stroke="#fa3468" strokeWidth="7"/>
     </svg>
     <div className="template-purple-cross" aria-hidden="true">×</div>
     <div className="template-copy">
      <span className="template-eyebrow">NETWORK SYSTEMS / CYBERSECURITY</span>
      <h1>NETWORK <span>STUDIO</span></h1>
      <h2>DESIGN. DEPLOY. VERIFY.</h2>
      <p>Infrastructure engineering, network architecture and systems operations — all in one practical workspace. Build topologies, document configurations and validate technical work.</p>
      <div className="template-buttons">
       <Link href={studioEnabled?'/studio':'#projects'} className="template-button-primary">{studioEnabled?'Launch Studio':'Explore Workspaces'} <ArrowUpRight size={17}/></Link>
       <a href="#projects" className="template-button-outline">Projects <ArrowRight size={17}/></a>
      </div>
     </div>
     <div className="template-photo">
      <img src="/template/taha-portrait.webp" alt="Taha Zitane — Infrastructure and Network Engineering" loading="eager"/>
      <div className="template-photo-name"><strong>TAHA ZITANE</strong><span>INFRASTRUCTURE &amp; NETWORK ENGINEERING</span></div>
     </div>
     <HeroNetwork/>
     <div className="template-number" aria-hidden="true"><span>12</span><small>PROJECTS</small></div>
     <div className="template-square-pixels" aria-hidden="true"><i/><i/><i/><i/><i/></div>
     <div className="template-hero-footer">
      <a href="https://github.com/tahazitan" target="_blank" rel="noopener noreferrer">GH</a>
      <a href="https://www.linkedin.com/in/taha-zitane/fr" target="_blank" rel="noopener noreferrer">in</a>
      <span>@tahazitan</span>
      <span className="template-reference-tag">IT / NETWORK / SECURITY ENGINEERING</span>
     </div>
    </div>
   </div>
  </section>
  <div className="template-techline"><div className="template-tech-label">TECHNOLOGIES</div><div className="template-tech-assets">{featuredTechnologies.map(name=><TechnologyLogo key={name} name={name}/>)}</div></div>
  <NetworkShowcase projects={projects} studioEnabled={studioEnabled}/>
  <section id="services" className="template-section">
   <div className="template-section-lead"><p className="template-section-index">02 / CORE CAPABILITIES</p><h2>ENGINEERING <em>CAPABILITIES</em></h2><p>Focused technical areas, tools and practical methods.</p></div>
   <div className="template-service-table">{disciplines.map(x=><article className="template-service" data-reveal key={x.code}>
    <span className="template-service-num">{x.code}</span>
    <div className="template-service-icon"><x.Icon size={31} strokeWidth={1.5}/></div>
    <div className="template-service-text"><h3>{x.name}</h3><p>{x.summary}</p></div>
    <div className="template-service-stack">{x.stack.map(t=><TechnologyLogo key={t} name={t} compact/>)}</div>
   </article>)}</div>
  </section>
  <section id="projects" className="template-section template-projects">
   <div className="template-section-lead"><p className="template-section-index">03 / ENGINEERING PROJECTS</p><h2>PROJECT <em>WORKSPACES</em></h2><p>12 practical blueprints, editable topologies and documented engineering tests.</p></div>
   <div className="template-filters">
    <div className="template-filter-buttons">{domains.map(d=><button key={d} type="button" aria-pressed={domain===d} className={domain===d?'selected':''} onClick={()=>setDomain(d)}>{d}</button>)}</div>
    <label className="template-filter-search"><Search size={16}/><input aria-label="Find a project" type="search" placeholder="Find a project..." value={search} onChange={e=>setSearch(e.target.value)}/></label>
   </div>
   <div className="template-project-grid">{result.map((p,i)=><Link className="template-project" data-reveal key={p.slug} href={studioEnabled?'/studio/'+p.slug:'#about'}>
    <div className="template-project-preview"><TopologyPreview project={p}/></div>
    <div className="template-project-info"><div className="template-project-meta"><span>{p.domain.toUpperCase()} / {String(i+1).padStart(2,'0')}</span><span className="template-project-status">{p.status.replace('_',' ').toUpperCase()}</span></div><h3>{p.title}</h3><p>{p.summary}</p><div className="template-project-bottom"><div>{p.stack.slice(0,3).map(t=><TechnologyLogo key={t} name={t} compact/>)}</div><ArrowUpRight size={20}/></div></div>
   </Link>)}</div>
   {result.length===0&&<p className="template-empty">No projects match this search.</p>}
  </section>
  <section id="about" className="template-about"><div><p className="template-section-index">04 / THE ENGINEER</p><h2>TAHA <em>ZITANE.</em></h2><p>Systems and network infrastructure, technical support, monitoring and security operations. The studio organizes architectural ideas and practical tests without claiming unverified results.</p><div className="template-about-links"><a href="https://github.com/tahazitan" target="_blank" rel="noopener noreferrer">GitHub <ExternalLink size={16}/></a><a href="https://www.linkedin.com/in/taha-zitane/fr" target="_blank" rel="noopener noreferrer">LinkedIn <ExternalLink size={16}/></a></div></div><div className="template-about-aside"><span>ENGINEERING PRINCIPLE</span><blockquote>Good infrastructure is documented, observable and testable.</blockquote><ChevronRight size={28}/></div></section>
  <footer className="template-footer"><b>TAHA INFRASTRUCTURE STUDIO</b><span>DESIGN / DEPLOY / VERIFY</span><a href="#top">BACK TO TOP ↑</a></footer>
 </main>;
}
