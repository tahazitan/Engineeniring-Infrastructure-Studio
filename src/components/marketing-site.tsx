import Link from 'next/link';
import {ArrowRight,ArrowUpRight,CheckCircle2,Globe2,Network,MonitorCog,Shield,BookOpen} from 'lucide-react';
import {MarketingHeader,MarketingFooter,SectionHeading} from './marketing-layout';
import TechnologyLogo from './technology-logo';
import {getServices,getExperience,getEducation,copyFor,routeFor,type Locale} from '@/lib/site-i18n';
import {projects} from '@/lib/catalog';
import ContactBrief from './contact-brief';
import SiteDocumentLanguage from './site-document-language';
type View='home'|'services'|'about'|'projects'|'contact';
const tech=['Windows Server','Microsoft','Wazuh','AWS','Zabbix','Cisco','Fortinet','Palo Alto','GNS3','Proxmox','Linux','Docker','Wireshark','AnyDesk','Kali Linux','WireGuard','Grafana','GitLab','PostgreSQL'];
const areas=[
 {tool:'Cisco',label:'Network routing & switching',keys:['VLAN','Routing','WAN','IPsec']},
 {tool:'Linux',label:'Linux & Windows administration',keys:['Linux','Windows Server','Active Directory','Docker']},
 {tool:'Fortinet',label:'Infrastructure security',keys:['Firewall','VPN','Network segmentation','Logs']},
 {tool:'Proxmox',label:'Virtualization & monitoring',keys:['Proxmox','Zabbix','Wireshark','Backup']},
];
export default function MarketingSite({view='home',studioEnabled=false,lang='en'}:{view?:View;studioEnabled?:boolean;lang?:Locale}){
 const t=copyFor(lang),services=getServices(lang),experience=getExperience(lang),education=getEducation(lang);
 const href=(path:string)=>routeFor(lang,path);
 const ar=lang==='ar';
 const localeDate=(s:string)=>s==='2025 — Present'?(lang==='fr'?'2025 — Aujourd’hui':ar?'2025 — الآن':s):s==='One year'?(lang==='fr'?'Une année':ar?'سنة واحدة':s):s;
 return <><SiteDocumentLanguage lang={lang}/><div className={'agency-site agency-localized agency-'+lang} dir={ar?'rtl':'ltr'} lang={lang}>
 <div className="agency-page-frame">
  <div className="agency-top-label"><span className="agency-template-brand">TAHA IT SOLUTIONS</span><span>{t.mast}</span></div>
  <MarketingHeader studioEnabled={studioEnabled} lang={lang}/>
  {view==='home'&&<>
   <section className="agency-hero" aria-labelledby="agency-hero-title">
    <div className="agency-hero-lines" aria-hidden="true"/>
    <div className="agency-template-mark" aria-hidden="true"><span>×</span><span>⌄</span></div>
    <div className="agency-hero-copy">
     <span className="agency-overline"><span className="agency-dot"/> {t.topline}</span>
     <h1 id="agency-hero-title" className="agency-hero-reveal">{t.heroTitle} <em>{t.heroAccent}</em></h1>
     <h2>{t.heroLead}</h2><p>{t.heroBody}</p>
     <div className="agency-hero-buttons"><Link className="agency-btn-primary" href={href('/contact')}>{t.heroCta} <ArrowUpRight size={17}/></Link><Link className="agency-btn-secondary" href={href('/services')}>{t.servicesCta} <ArrowRight size={17}/></Link></div>
     <div className="agency-hero-trust">{t.trust.map(x=><span key={x}><CheckCircle2 size={16}/>{x}</span>)}</div>
    </div>
    <div className="agency-photo-panel agency-portrait-motion"><img src="/template/taha-portrait.webp" alt="Taha Zitane — independent IT infrastructure specialist" fetchPriority="high"/><div className="agency-photo-caption"><strong>TAHA ZITANE</strong><span>IT INFRASTRUCTURE / SUPPORT / NETWORK SECURITY</span></div></div>
    <div className="agency-hero-circuit" aria-hidden="true"/>
   </section>
   <div className="agency-platforms"><span>{t.technology}</span><div className="agency-logo-track">{tech.map(name=><TechnologyLogo key={name} name={name} compact/>)}</div></div>
   <section className="agency-section" id="services">
    <SectionHeading eyebrow={t.servicesEyebrow} title={t.servicesTitle} highlight={t.servicesAccent} description={t.servicesDesc}/>
    <div className="agency-offer-list">{services.map((service,i)=><article className="agency-offer-row" key={service.id}>
     <div className="agency-offer-num">{String(i+1).padStart(2,'0')}</div>
     <div className="agency-offer-main"><h3>{service.title}</h3><p>{service.short}</p></div>
     <div className="agency-offer-tech">{service.tools.slice(0,3).map(name=><TechnologyLogo key={name} name={name} compact/>)}</div>
     <Link href={href('/services')+'#'+service.id} className="agency-offer-action" aria-label={t.serviceDetail+': '+service.title}><ArrowUpRight size={22}/></Link>
    </article>)}</div>
    <Link href={href('/contact')} className="agency-inline-cta">{t.servicesQuestion} {t.servicesAsk} <ArrowUpRight size={18}/></Link>
   </section>
   <section className="agency-process">
    <SectionHeading eyebrow={t.processEyebrow} title={t.processTitle} highlight={t.processAccent} description={t.processDesc}/>
    <div className="agency-steps">{t.steps.map(([title,description],i)=><div key={title}><b>{String(i+1).padStart(2,'0')}</b><h3>{title}</h3><p>{description}</p></div>)}</div>
   </section>
   <section className="agency-section">
    <SectionHeading eyebrow={t.studioEyebrow} title={t.studioTitle} highlight={t.studioAccent} description={t.studioDesc}/>
    <div className="agency-feature-panel"><div><span className="agency-kicker">GNS3 / REACT FLOW / POSTGRESQL</span><h3>{t.studioLink}</h3><p>{t.studioBody}</p><div className="agency-feature-links">{studioEnabled&&<Link href="/studio" className="agency-btn-primary">{t.studioLink}<ArrowUpRight size={16}/></Link>}<Link href={href('/projects')} className="agency-btn-secondary">{t.projectLink}<ArrowRight size={16}/></Link></div></div><div className="agency-feature-list">{t.studioFeatures.map((line,i)=>{const Icon=[Network,MonitorCog,Shield,BookOpen][i];return <span key={line}><Icon size={18}/>{line}</span>})}</div></div>
   </section>
   <section className="agency-section agency-about-teaser"><div><SectionHeading eyebrow={t.aboutEyebrow} title={t.aboutTitle} highlight={t.aboutAccent} description={t.aboutDesc}/><p>{t.aboutBody}</p><Link href={href('/about')} className="agency-btn-secondary">{t.aboutLink}<ArrowRight size={16}/></Link></div><div className="agency-about-image"><img src="/template/taha-portrait.webp" alt="Taha Zitane" loading="lazy"/></div></section>
   <section className="agency-contact-banner"><div><span>{t.finalEyebrow}</span><h2>{t.finalTitle}</h2><p>{t.finalBody}</p></div><Link href={href('/contact')} className="agency-btn-primary">{t.finalButton}<ArrowUpRight size={18}/></Link></section>
  </>}
  {view==='services'&&<><PageIntro eyebrow={t.servicesEyebrow} title={t.pageService} description={t.pageServiceLead} lang={lang}/><section className="agency-section agency-services-page">{services.map((s,i)=><article className="agency-service-detail" key={s.id} id={s.id}><div className="agency-service-detail-title"><span>{String(i+1).padStart(2,'0')}</span><div><h2>{s.title}</h2><p>{s.short}</p><div className="agency-offer-tech">{s.tools.map(name=><TechnologyLogo key={name} name={name} compact/>)}</div></div></div><div className="agency-service-detail-copy"><p>{s.details}</p><h3>{t.deliverables}</h3><ul>{s.deliverables.map(item=><li key={item}><CheckCircle2 size={16}/>{item}</li>)}</ul><Link href={href('/contact')} className="agency-btn-secondary">{t.discuss}<ArrowUpRight size={16}/></Link></div></article>)}<p className="agency-service-disclaimer">{t.scope}</p></section></>}
  {view==='about'&&<><PageIntro eyebrow={t.aboutEyebrow} title={t.pageAbout} description={t.pageAboutLead} lang={lang}/><section className="agency-section agency-bio"><div className="agency-bio-photo"><img src="/template/taha-portrait.webp" alt="Portrait of Taha Zitane" loading="eager"/></div><div><span className="agency-kicker">TAHA ZITANE / طه زيطان</span><h2>{t.bioTitle}</h2><p>{t.bioBody}</p><Link href={href('/contact')} className="agency-btn-primary">{t.workCta}<ArrowUpRight size={16}/></Link></div></section><section className="agency-section"><SectionHeading eyebrow="02 / EXPERIENCE" title={t.experience} description={t.experienceLead}/><div className="agency-timeline">{experience.map(e=><article key={e.period+e.role}><time>{localeDate(e.period)}</time><div><h3>{e.role}</h3><strong>{e.company}</strong><p>{e.summary}</p><div className="agency-service-tags">{e.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div></article>)}</div></section><section className="agency-section agency-education"><SectionHeading eyebrow="03 / EDUCATION" title={t.studies} description={t.studiesLead}/><div className="agency-education-grid">{education.map(e=><article key={e.year+e.title}><time>{localeDate(e.year)}</time><h3>{e.title}</h3><strong>{e.school}</strong><p>{e.note}</p></article>)}</div></section></>}
  {view==='projects'&&<><PageIntro eyebrow={t.studioEyebrow} title={t.pageProjects} description={t.pageProjectsLead} lang={lang}/><section className="agency-section"><SectionHeading eyebrow="01 / IT INFRASTRUCTURE" title={t.technicalFocus} description={t.projectNotice}/><div className="agency-practice-list">{areas.map((area,i)=><article key={area.tool} className="agency-practice-row"><span>{String(i+1).padStart(2,'0')}</span><TechnologyLogo name={area.tool}/><div><h2>{area.label}</h2><p>{area.keys.join(' / ')}</p></div></article>)}</div><div className="agency-practice-footer"><a className="agency-btn-primary" href="https://taha-zitane-engineering.zitanet44.workers.dev/projects/" target="_blank" rel="noopener noreferrer">{lang==='fr'?'Consulter les études de cas techniques':ar?'استعراض المشاريع التقنية الموثقة':'Explore documented engineering projects'}<ArrowUpRight size={16}/></a>{studioEnabled&&<Link className="agency-btn-secondary" href="/studio">{t.openStudio}<ArrowUpRight size={16}/></Link>}</div></section></>}
  {view==='contact'&&<><PageIntro eyebrow={t.pageContact} title={t.contactTitle} description={t.pageContactLead} lang={lang}/><section className="agency-section agency-contact-page"><div className="agency-contact-main"><h2>{t.contactTitle}</h2><p>{t.contactBody}</p><ContactBrief lang={lang}/></div><aside className="agency-contact-channels"><h3>{t.contactChannels}</h3>{[['Fiverr','https://www.fiverr.com/zitane_taha'],['LinkedIn','https://www.linkedin.com/in/taha-zitane/fr'],['GitHub','https://github.com/tahazitan']].map(([label,url])=><a key={label} href={url} target="_blank" rel="noopener noreferrer"><strong>{label}</strong><span>{label==='GitHub'?'Open source / code':'Professional contact'}</span><ArrowUpRight size={19}/></a>)}<div className="agency-contact-context"><Globe2 size={20}/><p>{t.clientLocation}</p></div></aside></section></>}
  <MarketingFooter lang={lang}/>
 </div></div></>;
}
function PageIntro({eyebrow,title,description,lang}:{eyebrow:string;title:string;description:string;lang:Locale}){
 const t=copyFor(lang);
 return <section className="agency-page-intro"><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p><div className="agency-intro-actions"><Link href={routeFor(lang,'/contact')}>{t.nav[4]}<ArrowUpRight size={15}/></Link><Link href={routeFor(lang,'/')}>{t.nav[0]}<ArrowRight size={15}/></Link></div></section>;
}
