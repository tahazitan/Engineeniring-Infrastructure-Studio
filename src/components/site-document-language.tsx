'use client';
import {useEffect} from 'react';
import type {Locale} from '@/lib/site-i18n';
export default function SiteDocumentLanguage({lang}:{lang:Locale}){
 useEffect(()=>{
  const oldLanguage=document.documentElement.lang,oldDir=document.documentElement.dir;
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  return ()=>{document.documentElement.lang=oldLanguage;document.documentElement.dir=oldDir};
 },[lang]);
 return null;
}
