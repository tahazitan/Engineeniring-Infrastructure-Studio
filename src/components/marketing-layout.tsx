'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {ArrowUpRight,Menu,X} from 'lucide-react';
import {type Locale,copyFor,localeName,locales,routeFor} from '@/lib/site-i18n';
export function MarketingHeader({studioEnabled=false,lang='en'}:{studioEnabled?:boolean;lang?:Locale}){
 const [open,setOpen]=useState(false);
 const pathname=usePathname();
 const current=pathname.replace(/^\/(fr|ar)(?=\/|$)/,'')||'/';
 const t=copyFor(lang);
 const links=[['/',t.nav[0]],['/services',t.nav[1]],['/projects',t.nav[2]],['/about',t.nav[3]],['/contact',t.nav[4]]];
 return <header className="marketing-header" dir={lang==='ar'?'rtl':'ltr'}>
  <Link href={routeFor(lang,'/')} className="marketing-logo" aria-label="Taha IT Solutions home"><span className="marketing-logo-t">T<span>.</span></span><span><strong>TAHA IT</strong><small>SOLUTIONS</small></span></Link>
  <nav className={open?'marketing-nav active':'marketing-nav'} aria-label="Primary navigation">
   {links.map(([href,label])=><Link key={href} href={routeFor(lang,href)} aria-current={current===href?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>)}
   {studioEnabled&&<Link className="marketing-mobile-studio-link" href="/studio" onClick={()=>setOpen(false)}>{t.nav[5]}</Link>}
  </nav>
  <div className="marketing-header-actions">
   <div className="agency-lang" aria-label="Website language">{locales.map(l=><Link key={l} href={routeFor(l,current)} aria-current={l===lang?'page':undefined} lang={l} title={localeName[l]} onClick={()=>setOpen(false)}>{l.toUpperCase()}</Link>)}</div>
   <Link href={studioEnabled?'/studio':routeFor(lang,'/contact')} className="marketing-studio-link">{studioEnabled?t.nav[5]:t.nav[4]} <ArrowUpRight size={16}/></Link>
   <button type="button" className="marketing-mobile-button" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={23}/>:<Menu size={23}/>}</button>
  </div>
 </header>;
}
export function MarketingFooter({lang='en'}:{lang?:Locale}){
 const t=copyFor(lang);
 return <footer className="marketing-footer" dir={lang==='ar'?'rtl':'ltr'}>
  <div><Link href={routeFor(lang,'/')} className="marketing-footer-brand">TAHA IT <span>SOLUTIONS</span></Link><p>{t.footerAbout}</p></div>
  <div><b>{t.footerLinks}</b><Link href={routeFor(lang,'/services')}>{t.nav[1]}</Link><Link href={routeFor(lang,'/projects')}>{t.nav[2]}</Link><Link href={routeFor(lang,'/about')}>{t.nav[3]}</Link></div>
  <div><b>{t.footerContact}</b><Link href={routeFor(lang,'/contact')}>{t.nav[4]}</Link><a href="https://www.fiverr.com/zitane_taha" target="_blank" rel="noopener noreferrer">Fiverr</a><a href="https://www.linkedin.com/in/taha-zitane/fr" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
  <div className="marketing-footer-bottom">© {new Date().getFullYear()} Taha Zitane · Taha IT Solutions <span>NETWORKS / SYSTEMS / SUPPORT</span></div>
 </footer>;
}
export function SectionHeading({eyebrow,title,highlight,description}:{eyebrow:string;title:string;highlight?:string;description?:string}){
 return <div className="marketing-section-head"><span>{eyebrow}</span><h2>{title} {highlight&&<em>{highlight}</em>}</h2>{description&&<p>{description}</p>}</div>;
}
