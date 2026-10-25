'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Network,PanelsTopLeft} from 'lucide-react';
import type {Project} from '@/lib/types';
import TopologyPreview from './topology-preview';
import TechnologyLogo from './technology-logo';

export default function NetworkShowcase({projects,studioEnabled}:{projects:Project[];studioEnabled:boolean}){
 const [slug,setSlug]=useState(projects[0]?.slug??'');
 const project=projects.find(p=>p.slug===slug)||projects[0];
 if(!project)return null;
 return <section className="network-showcase" aria-labelledby="network-showcase-title">
   <div className="network-showcase-heading"><span>01 / INTERACTIVE NETWORK ARCHITECTURE</span><h2 id="network-showcase-title">TOPOLOGY <em>EXPLORER</em></h2><p>Explore saved engineering blueprints. Select a project to inspect its network design, then open the full GNS3-enabled workbench.</p></div>
   <div className="network-showcase-app">
    <div className="network-showcase-canvas">
     <div className="network-showcase-toolbar"><span><Network size={16}/> NETWORK MAP / {project.domain.toUpperCase()}</span><span>BLUEPRINT MODE</span></div>
     <div className="network-showcase-topology" key={project.slug}><TopologyPreview project={project}/></div>
     <div className="network-showcase-canvas-footer"><span>CONCEPTUAL · NOT A LIVE DEPLOYMENT</span><span>{project.topology.nodes.length} DEVICES / {project.topology.edges.length} LINKS</span></div>
    </div>
    <aside className="network-showcase-panel">
     <div className="network-showcase-panel-head"><PanelsTopLeft size={18}/><span>PROJECT INSPECTOR</span></div>
     <label htmlFor="topology-project-select">SELECT ENGINEERING BLUEPRINT</label>
     <select id="topology-project-select" value={project.slug} onChange={e=>setSlug(e.target.value)}>{projects.map(p=><option key={p.slug} value={p.slug}>{p.title}</option>)}</select>
     <div className="network-showcase-meta">ARCHITECTURE / {project.status.toUpperCase().replace('_',' ')}</div>
     <h3>{project.title}</h3><p>{project.summary}</p>
     <div className="network-showcase-stack">{project.stack.slice(0,6).map(t=><TechnologyLogo name={t} key={t} compact/>)}</div>
     <Link href={studioEnabled?'/studio/'+project.slug:'#projects'} className="network-showcase-cta">{studioEnabled?'OPEN TOPOLOGY EDITOR':'VIEW PROJECT DETAILS'} <ArrowUpRight size={18}/></Link>
     <span className="network-showcase-note">GNS3 project import and local GNS3 API connection are available in the private workbench.</span>
    </aside>
   </div>
  </section>;
}
