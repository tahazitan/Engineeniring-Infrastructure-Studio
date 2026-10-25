import type {Metadata} from 'next';
import MarketingSite from '@/components/marketing-site';
import {isPrivate} from '@/lib/server';
export const metadata:Metadata={title:'Engineering Projects | Networking, Systems & Security',description:'Explore infrastructure reference architectures: networks, VPN, Windows Server, Linux, monitoring and automation, with transparent project status.'};
export default function Page(){return <MarketingSite view='projects' studioEnabled={isPrivate()}/>;}
