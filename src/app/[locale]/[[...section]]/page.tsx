import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import MarketingSite from '@/components/marketing-site';
import {isPrivate} from '@/lib/server';
import {copyFor,isLocale,locales,routeFor} from '@/lib/site-i18n';
type Params={locale:string;section?:string[]};
export function generateStaticParams(){
 return locales.filter(l=>l!=='en').flatMap(locale=>[undefined,'services','about','projects','contact'].map(section=>({locale,...(section?{section:[section]}:{})})));
}
function resolve({locale,section}:Params){
 if(!isLocale(locale)||locale==='en'||(section?.length||0)>1)notFound();
 const part=(section?.[0]||'') as 'services'|'about'|'projects'|'contact'|'';
 if(!['','services','about','projects','contact'].includes(part))notFound();
 return {locale,part};
}
export async function generateMetadata({params}:{params:Promise<Params>}):Promise<Metadata>{
 const {locale,part}=resolve(await params),t=copyFor(locale);
 const title=part==='services'?t.pageService:part==='about'?t.pageAbout:part==='projects'?t.pageProjects:part==='contact'?t.contactTitle:t.heroTitle+' '+t.heroAccent;
 const description=part==='services'?t.pageServiceLead:part==='about'?t.pageAboutLead:part==='projects'?t.pageProjectsLead:part==='contact'?t.pageContactLead:t.heroBody;
 const path=part?'/'+part:'/';
 const base=process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/,'');
 return {title,description,alternates:base?{canonical:base+routeFor(locale,path),languages:{en:base+routeFor('en',path),fr:base+routeFor('fr',path),ar:base+routeFor('ar',path),'x-default':base+routeFor('en',path)}}:undefined,openGraph:{title,description,locale:locale==='fr'?'fr_FR':locale==='ar'?'ar_MA':'en_US'}};
}
export default async function LocalizedPage({params}:{params:Promise<Params>}){
 const {locale,part}=resolve(await params);
 return <MarketingSite view={part||'home'} lang={locale} studioEnabled={isPrivate()}/>;
}
