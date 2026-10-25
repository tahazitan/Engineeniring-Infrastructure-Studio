'use client';
import Link from 'next/link';
import {useState} from 'react';
import {ArrowUpRight,Menu,Search,X} from 'lucide-react';

export function MarketingHeader({studioEnabled=false}:{studioEnabled?:boolean}){
 const [open,setOpen]=useState(false);
 return <header className="marketing-header">
  <Link href="/" className="marketing-logo" aria-label="Taha IT Solutions home"><span className="marketing-logo-t">T<span>.</span></span><span><strong>TAHA IT</strong><small>SOLUTIONS</small></span></Link>
  <nav className={open?'marketing-nav active':'marketing-nav'} aria-label="Main navigation">
   {[['/','Home'],['/services','Services'],['/projects','Projects'],['/about','About'],['/contact','Contact']].map(([href,name])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{name}</Link>)}
   {studioEnabled&&<Link className="marketing-mobile-studio-link" href="/studio" onClick={()=>setOpen(false)}>Engineering Studio</Link>}
  </nav>
  <div className="marketing-header-actions">
   <Link href={studioEnabled?'/studio':'/projects'} className="marketing-studio-link">{studioEnabled?'Engineering Studio':'Our Work'} <ArrowUpRight size={16}/></Link>
   <button type="button" className="marketing-mobile-button" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={23}/>:<Menu size={23}/>}</button>
  </div>
 </header>;
}
export function MarketingFooter(){
 return <footer className="marketing-footer">
  <div><Link href="/" className="marketing-footer-brand">TAHA IT <span>SOLUTIONS</span></Link><p>Remote IT support, network and system infrastructure, and security-oriented technical services. Based in Morocco, working remotely with direct clients and freelance marketplace projects.</p></div>
  <div><b>Explore</b><Link href="/services">IT Services</Link><Link href="/projects">Engineering Projects</Link><Link href="/about">Experience & Education</Link></div>
  <div><b>Start a conversation</b><Link href="/contact">Request a service</Link><a href="https://www.fiverr.com/zitane_taha" target="_blank" rel="noopener noreferrer">Fiverr</a><a href="https://www.linkedin.com/in/taha-zitane/fr" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
  <div className="marketing-footer-bottom">© {new Date().getFullYear()} Taha Zitane · Independent IT Services <span>NETWORKS / SYSTEMS / SECURITY / SUPPORT</span></div>
 </footer>;
}
export function SectionHeading({eyebrow,title,highlight,description}:{eyebrow:string;title:string;highlight?:string;description?:string}){
 return <div className="marketing-section-head"><span>{eyebrow}</span><h2>{title} {highlight&&<em>{highlight}</em>}</h2>{description&&<p>{description}</p>}</div>;
}
