import {notFound} from 'next/navigation';
import ProjectsRoadmap from '@/components/projects-roadmap';
import {isPrivate} from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata={title:'12-Month Project Build Roadmap | Engineering Studio',robots:{index:false,follow:false}};
export default function Page(){if(!isPrivate())notFound();return <ProjectsRoadmap/>}
