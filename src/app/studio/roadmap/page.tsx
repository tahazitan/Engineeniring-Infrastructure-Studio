import {notFound} from 'next/navigation';
import {isPrivate} from '@/lib/server';
import YearRoadmap from '@/components/year-roadmap';
export const dynamic='force-dynamic';
export const metadata={title:'12-Month Engineering Roadmap | Private Infrastructure Studio',robots:{index:false,follow:false}};
export default function RoadmapPage(){if(!isPrivate())notFound();return <YearRoadmap/>}
