import type {MetadataRoute} from 'next';
import {routeFor,locales} from '@/lib/site-i18n';
export default function sitemap():MetadataRoute.Sitemap{
 if(process.env.STUDIO_MODE!=='public'||!process.env.NEXT_PUBLIC_SITE_URL)return [];
 const root=process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/,'');
 return locales.flatMap(locale=>['/','/services','/projects','/about','/contact'].map(path=>({url:root+routeFor(locale,path),changeFrequency:'monthly' as const,priority:path==='/'?1:0.7,alternates:{languages:{en:root+routeFor('en',path),fr:root+routeFor('fr',path),ar:root+routeFor('ar',path)}}})));
}
