import {inferKind} from '@/lib/gns3';
import type {Project} from '@/lib/types';

export default function TopologyPreview({project}:{project:Project}){
 const source=project.topology.nodes.slice(0,6);
 const pts=source.map((n,i)=>({id:n.id,label:n.data.label,kind:inferKind(n.data.label,n.data.platform),x:65+(i%3)*125,y:38+Math.floor(i/3)*100}));
 const byId=new Map(pts.map(n=>[n.id,n]));
 return <svg className="topology-preview" viewBox="0 0 380 185" preserveAspectRatio="xMidYMid meet" role="img" aria-label={'Blueprint topology of '+project.title}>
  <defs><pattern id={'grid-'+project.slug} width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".75" fill="#436483" opacity=".4"/></pattern></defs>
  <rect width="380" height="185" fill={'url(#grid-'+project.slug+')'}/>
  {project.topology.edges.map(edge=>{const a=byId.get(edge.source),b=byId.get(edge.target);if(!a||!b)return null;return <g key={edge.id}><path d={'M '+a.x+' '+a.y+' L '+b.x+' '+b.y} fill="none" stroke="#19c9f0" strokeWidth="1.6" strokeDasharray="6 4" opacity=".75"/><circle cx={(a.x+b.x)/2} cy={(a.y+b.y)/2} r="2" fill="#32d2f6"/></g>;})}
  {pts.map(n=><g key={n.id} transform={'translate('+(n.x-46)+','+(n.y-24)+')'}>
   <rect x="0" y="0" width="92" height="50" rx="5" fill="#0c283e" stroke={n.kind==='firewall'?'#ff6d8a':'#5abedd'} strokeWidth="1.1"/>
   <rect x="7" y="8" width="6" height="6" rx="1" fill={n.kind==='firewall'?'#ff6d8a':'#06d4ee'}/>
   <text x="18" y="13" fill="#94c7db" fontSize="8" fontFamily="monospace">{n.kind.toUpperCase()}</text>
   <text x="7" y="31" fill="#f1f9fd" fontSize="9" fontWeight="600" fontFamily="system-ui">{n.label.length>16?n.label.slice(0,14)+'…':n.label}</text>
   <path d="M 7 40 H 85" stroke="#41687d" strokeWidth=".7"/>
   <circle cx="10" cy="44" r="2" fill="#00ddfb"/><circle cx="18" cy="44" r="2" fill="#9550ff"/>
  </g>)}
 </svg>;
}
