import {notFound} from 'next/navigation';
import {findProject,isPrivate} from '@/lib/server';
import Workbench from '@/components/studio-workbench';
export const dynamic='force-dynamic';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){const {slug}=await params;const p=await findProject(slug);return {title:p?.title||'Project Workbench'};}
export default async function ProjectPage({params}:Props){
 if(!isPrivate())notFound();
 const {slug}=await params;const p=await findProject(slug);if(!p)notFound();
 return <Workbench initial={p}/>;
}
