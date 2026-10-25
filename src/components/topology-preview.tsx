import type {Project} from '@/lib/types';
import {inferKind} from '@/lib/gns3';

export default function TopologyPreview({project}:{project:Project}){
 const nodes=project.topology.nodes.slice(0,6).map((node,i)=>({
  id:node.id,label:node.data.label,
  kind:inferKind(node.data.label,node.data.platform),
  x:40+(i%2)*207,y:44+Math.floor(i/2)*60
 }));
 const lookup=new Map(nodes.map(n=>[n.id,n]));
 return <svg className="topology-preview" viewBox="0 0 380 230" role="img" aria-label={'Network topology blueprint for '+project.title} preserveAspectRatio="xMidYMid meet">
  <rect width="380" height="230" fill="#f2f6fa"/>
  <defs><pattern id={'dots-'+project.slug} width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#cdd9e3"/></pattern></defs>
  <rect width="380" height="230" fill={'url(#dots-'+project.slug+')'}/>
  <g fontFamily="monospace" fontSize="8" fill="#647c8f"><text x="13" y="16">NETWORK SCHEMATIC</text><text x="365" y="16" textAnchor="end">{nodes.length} DEVICES</text></g>
  {project.topology.edges.map((edge,i)=>{const a=lookup.get(edge.source),b=lookup.get(edge.target);if(!a||!b)return null;return <path key={edge.id||i} d={'M '+(a.x+50)+' '+(a.y+24)+' L '+(b.x+50)+' '+(b.y+24)} fill="none" stroke="#6788a0" strokeWidth="1.7" className="topology-link"/>;})}
  {nodes.map(n=><g key={n.id}>
   <rect className="topology-device" x={n.x} y={n.y} width="110" height="47" rx="3" fill="#fff" stroke="#90aec1" strokeWidth="1.4"/>
   <rect x={n.x} y={n.y} width="4" height="47" fill={n.kind==='firewall'?'#b94167':'#2783a6'}/>
   <text x={n.x+12} y={n.y+17} fontSize="7.3" fontFamily="monospace" fill="#52728b">{n.kind.toUpperCase()}</text>
   <text x={n.x+12} y={n.y+32} fontSize="10.5" fontWeight="600" fontFamily="Arial,sans-serif" fill="#132f47">{n.label.length>17?n.label.slice(0,15)+'…':n.label}</text>
  </g>)}
  <text x="13" y="218" fontSize="8" fontFamily="monospace" fill="#647b8f">PROJECT BLUEPRINT · NOT A LIVE DEPLOYMENT</text>
 </svg>;
}
