import type {Metadata} from 'next';
import MarketingSite from '@/components/marketing-site';
import {isPrivate} from '@/lib/server';
export const metadata:Metadata={title:'IT Services | Remote Support, Networks & Systems',description:'Remote IT support, Cisco and VPN configuration, Windows Server, Linux VPS, monitoring and technical security reviews for business clients.'};
export default function Page(){return <MarketingSite view='services' studioEnabled={isPrivate()}/>;}
