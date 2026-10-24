import Home from '@/components/home';
import {projects} from '@/lib/catalog';
import {listProjects,isPrivate} from '@/lib/server';
export const dynamic='force-dynamic';
export default async function Page(){
 const studioEnabled=isPrivate();
 let content=projects;
 if(studioEnabled){try{content=await listProjects()}catch{}}
 else{try{content=(await listProjects()).filter(p=>p.public_visible&&p.status==='verified')}catch{content=[]}}
 return <Home projects={content} studioEnabled={studioEnabled}/>;
}
