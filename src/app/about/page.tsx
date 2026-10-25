import type {Metadata} from 'next';
import MarketingSite from '@/components/marketing-site';
import {isPrivate} from '@/lib/server';
export const metadata:Metadata={title:'About | Taha Zitane — IT Infrastructure Specialist',description:'Learn about Taha Zitane’s professional experience, technical education and independent IT services for businesses and remote clients.'};
export default function Page(){return <MarketingSite view='about' studioEnabled={isPrivate()}/>;}
