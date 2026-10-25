import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap{
 if(process.env.STUDIO_MODE!=='public'||!process.env.NEXT_PUBLIC_SITE_URL)return [];
 const root=process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/,'');
 return ['/','/services','/projects','/about','/contact'].map(path=>({url:root+path,changeFrequency:'monthly' as const,priority:path==='/'?1:0.7}));
}
