'use client';
import {useState} from 'react';
import {Copy,CheckCircle2,ExternalLink} from 'lucide-react';
import {copyFor,getServices,type Locale} from '@/lib/site-i18n';
export default function ContactBrief({lang='en'}:{lang?:Locale}){
 const t=copyFor(lang),services=getServices(lang);
 const [kind,setKind]=useState(services[0].id),[environment,setEnvironment]=useState(''),[details,setDetails]=useState(''),[timeline,setTimeline]=useState('0'),[copied,setCopied]=useState(false);
 const selected=services.find(s=>s.id===kind)?.title||services[0].title;
 const brief=[t.pageContact,t.serviceCategory+': '+selected,t.environment+': '+(environment.trim()||'—'),t.description+': '+(details.trim()||'—'),t.timing+': '+t.timingOptions[Number(timeline)]].join('\n');
 const copy=async()=>{try{await navigator.clipboard.writeText(brief);setCopied(true)}catch{setCopied(false)}};
 return <div className="agency-contact-form">
  <div className="agency-contact-field"><label htmlFor="contact-service">{t.serviceCategory}</label><select id="contact-service" value={kind} onChange={e=>{setKind(e.target.value);setCopied(false)}}>{services.map(s=><option value={s.id} key={s.id}>{s.title}</option>)}</select></div>
  <div className="agency-contact-field"><label htmlFor="contact-environment">{t.environment}</label><input id="contact-environment" maxLength={250} value={environment} onChange={e=>{setEnvironment(e.target.value);setCopied(false)}}/></div>
  <div className="agency-contact-field"><label htmlFor="contact-description">{t.description}</label><textarea id="contact-description" rows={6} maxLength={2500} value={details} onChange={e=>{setDetails(e.target.value);setCopied(false)}}/></div>
  <div className="agency-contact-field"><label htmlFor="contact-timing">{t.timing}</label><select id="contact-timing" value={timeline} onChange={e=>setTimeline(e.target.value)}>{t.timingOptions.map((item,i)=><option value={i} key={item}>{item}</option>)}</select></div>
  <button type="button" className="agency-btn-primary agency-copy-btn" onClick={copy}>{copied?<CheckCircle2 size={17}/>:<Copy size={17}/>} {copied?t.copied:t.copyBrief}</button><p className="agency-form-note">{t.formNote}</p>
  <div className="agency-form-channels"><a href="https://www.fiverr.com/zitane_taha" target="_blank" rel="noopener noreferrer">{t.goFiverr}<ExternalLink size={16}/></a><a href="https://www.linkedin.com/in/taha-zitane/fr" target="_blank" rel="noopener noreferrer">{t.goLinkedIn}<ExternalLink size={16}/></a></div>
 </div>;
}
