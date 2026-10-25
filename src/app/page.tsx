import MarketingSite from '@/components/marketing-site';
import {isPrivate} from '@/lib/server';
export default function Page(){return <MarketingSite view="home" studioEnabled={isPrivate()}/>;}
