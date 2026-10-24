'use client';
import {useMemo,useState,useEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Link from 'next/link';
import {ArrowUpRight,ArrowRight,Layers3,Network,ShieldCheck,Workflow,Activity,Database,TerminalSquare} from 'lucide-react';
import type {Project} from '@/lib/types';
import HeroScene from './hero-scene';
const icons=[Network,Layers3,ShieldCheck,Activity,Database,TerminalSquare];
const offerings=[{num:'01',title:'Network Architecture',desc:'Enterprise switching, routing, WAN connectivity, segmentation and performance diagnostics.',icon:Network},{num:'02',title:'Systems Engineering',desc:'Identity, Linux & Windows administration, virtualization and reliable infrastructure operations.',icon:Layers3},{num:'03',title:'Cybersecurity Engineering',desc:'Firewall policies, security monitoring, controlled analysis and resilient system design.',icon:ShieldCheck},{num:'04',title:'Monitoring & Automation',desc:'Telemetry, detection, configurations, validation workflows and operational observability.',icon:Activity}];
export default function Home({projects,studioEnabled}:{projects:Project[];studioEnabled:boolean}){
 const [filter,setFilter]=useState('All');
 useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 gsap.registerPlugin(ScrollTrigger);
 const elements=gsap.utils.toArray<HTMLElement>('.section-top, .offer, .project-card, .about-layout');
 const effects=elements.map((el)=>gsap.fromTo(el,{y:34,opacity:.28},{y:0,opacity:1,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
 return ()=>{effects.forEach(effect=>effect.kill());};
 },[filter]);
 const domains=['All',...new Set(projects.map(x=>x.domain))];
 const filtered=useMemo(()=>filter==='All'?projects:projects.filter(p=>p.domain===filter),[filter,projects]);
 return <main className="shell" id="top">
 <header className="nav"><Link href="/" className="brand"><span className="brand-symbol">T<span>·</span></span><span>TAHA <strong>INFRASTRUCTURE</strong><small>STUDIO / ENGINEERING</small></span></Link><nav><a href="#expertise">Expertise</a><a href="#work">Projects</a><a href="#about">About</a></nav><div className="nav-right"><a className="nav-contact" href="https://www.linkedin.com/in/taha-zitane/fr" target="_blank" rel="noopener noreferrer">Let's connect <ArrowUpRight size={15}/></a>{studioEnabled&&<Link className="nav-studio" href="/studio">Open studio <ArrowRight size={14}/></Link>}</div></header>
 <section className="hero"><div className="hero-noise"/><div className="hero-copy">
 <div className="eyebrow"><span className="beacon"/> INDEPENDENT INFRASTRUCTURE ENGINEERING STUDIO <span className="eyebrow-count">/ 2026</span></div>
 <h1>DESIGN.<br/><span className="serif">DEPLOY.</span><br/><span className="outlined">DEFEND.</span></h1>
 <p>Engineering networks, systems and security—from precise infrastructure architecture to actionable diagnostics and technical validation.</p>
 <div className="hero-actions"><a href="#work" className="primary-link">Explore engineering projects <ArrowUpRight size={19}/></a><a href="#expertise" className="text-link">What I engineer <ArrowRight size={17}/></a></div>
 <div className="hero-signature">TAHA ZITANE <span>—</span> INFRASTRUCTURE & NETWORK ENGINEERING</div>
 </div><HeroScene/><div className="hero-side">INTERACTIVE INFRASTRUCTURE STUDY — DRAG TO EXPLORE <span>✳</span></div></section>
 <div className="ticker"><span>NETWORK INFRASTRUCTURE</span><b>✳</b><span>SYSTEMS ENGINEERING</span><b>✳</b><span>SECURITY OPERATIONS</span><b>✳</b><span>MONITORING & AUTOMATION</span></div>
 <section id="expertise" className="section"><div className="section-top"><div><span className="section-tag">01 / CAPABILITIES</span><h2>Infrastructure,<br/><em>engineered with intent.</em></h2></div><p>Architectural thinking meets operational precision: technology selected, configured and verified for the system it serves.</p></div><div className="offer-grid">{offerings.map(item=><article key={item.num} className="offer"><div className="offer-top"><span>{item.num} / CORE EXPERTISE</span><item.icon size={25} strokeWidth={1.25}/></div><h3>{item.title}</h3><p>{item.desc}</p><span className="offer-arrow">↗</span></article>)}</div></section>
 <section id="work" className="section work-section"><div className="section-top"><div><span className="section-tag">02 / ENGINEERING PROJECTS</span><h2>Built around<br/><em>real-world systems.</em></h2></div><p>Infrastructure workspaces organized around architecture, implementation, configuration, diagnostics and verification.</p></div><div className="filter-row">{domains.map(d=><button key={d} className={filter===d?'filter active':'filter'} onClick={()=>setFilter(d)}>{d}</button>)}<span className="filter-count">{String(filtered.length).padStart(2,'0')} PROJECTS</span></div><div className="project-grid">{filtered.map((p,i)=>{const Icon=icons[i%icons.length];return <Link className="project-card" href={studioEnabled?'/studio/'+p.slug:'#about'} key={p.slug}><div className="project-card-top"><span>{p.domain.toUpperCase()} / {String(i+1).padStart(2,'0')}</span><ArrowUpRight size={17}/></div><div className="project-graphic"><div className="project-orbit"><span/><span/><span/></div><Icon size={42} strokeWidth={.85}/></div><div className="project-card-bottom"><h3>{p.title}</h3><p>{p.summary}</p><div className="tags">{p.stack.slice(0,3).map(s=><span key={s}>{s}</span>)}</div></div></Link>})}</div></section>
 <section id="about" className="section about-section"><span className="section-tag">03 / ENGINEERING PHILOSOPHY</span><div className="about-layout"><div className="large-quote">“A robust system is not just deployed. <em>It's understood, measured, and continuously improved.</em>”</div><div className="about-side"><span className="micro">TAHA ZITANE / MOROCCO</span><h3>Infrastructure that connects design to operations.</h3><p>Focused on enterprise networks, IT systems and cybersecurity. Bridging hands-on configuration, troubleshooting, visibility and the engineering discipline behind reliable platforms.</p><a className="primary-link" href="https://www.linkedin.com/in/taha-zitane/fr" target="_blank" rel="noopener noreferrer">Connect professionally <ArrowUpRight size={18}/></a></div></div></section>
 <footer className="footer"><div className="footer-mark">T<span>·</span></div><div><b>TAHA INFRASTRUCTURE STUDIO</b><p>Design. Deploy. Defend.</p></div><div className="footer-links"><a href="#top">Back to top ↑</a><a href="https://github.com/tahazitan" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/taha-zitane/fr" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div><span className="footer-right">© {new Date().getFullYear()} TAHA ZITANE</span></footer>
 </main>
}
