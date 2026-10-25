import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{
 if(process.env.STUDIO_MODE!=='public')return {rules:{userAgent:'*',disallow:'/'}};
 return {rules:{userAgent:'*',allow:'/',disallow:['/studio','/api/']},...(process.env.NEXT_PUBLIC_SITE_URL?{sitemap:process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/,'')+'/sitemap.xml'}:{})};
}
