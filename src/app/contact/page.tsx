import type {Metadata} from 'next';
import MarketingSite from '@/components/marketing-site';
import {isPrivate} from '@/lib/server';
export const metadata:Metadata={title:'Contact | Request Remote IT Support or Infrastructure Services',description:'Discuss remote IT support, Windows Server, networking, VPN, Linux, VPS and monitoring assignments through Fiverr or LinkedIn.'};
export default function Page(){return <MarketingSite view='contact' studioEnabled={isPrivate()}/>;}
