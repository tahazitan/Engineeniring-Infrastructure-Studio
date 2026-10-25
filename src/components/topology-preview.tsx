import type {Project} from '@/lib/types';
import {inferKind} from '@/lib/gns3';
import {getLogo} from './technology-logo';
const colors:Record<string,string>={router:'#087da6',switch:'#097e91',firewall:'#ce496a',server:'#7061b5',client:'#487b65',cloud:'#586d8d',device:'#64748b'};
const abbreviation:Record<string,string>={router:'RT',switch:'SW',firewall:'FW',server:'SV',client:'PC',cloud:'WAN',device:'IT'};
const W=1180,CW=222,CH=128;
export default function TopologyPreview({project,compact=false}:{project:Project;compact?:boolean}){
 const raw=project.topology.nodes.slice(0,compact?6:150);
 const nodes=raw.map((n,i)=>({...n,x:44+i%4*280,y:121+Math.floor(i/4)*205,kind:n.data.kind||inferKind(n.data.label,n.data.platform||''),logo:getLogo((n.data.platform||'')+' '+n.data.label)}));
 const lookup=new Map(nodes.map(n=>[n.id,n]));
 const links=project.topology.edges.filter(e=>lookup.has(e.source)&&lookup.has(e.target));
 const H=Math.max(420,121+Math.ceil(nodes.length/4)*205+40);
 const ident=project.slug+(compact?'sm':'full');
 const endpoint=(a:typeof nodes[number],b:typeof nodes[number])=>{
  const dx=b.x-a.x,dy=b.y-a.y;
  return Math.abs(dx)>Math.abs(dy)*1.2?{x:a.x+(dx>0?CW:0),y:a.y+CH*.5}:{x:a.x+CW/2,y:a.y+(dy>0?CH:0)};
 };
 return <svg className={'topology-preview '+(compact?'topology-compact':'topology-detailed')} viewBox={'0 0 '+W+' '+H} role="img" aria-label={'Engineering reference design for '+project.title+' containing '+nodes.length+' devices and '+links.length+' network connections'} preserveAspectRatio="xMidYMid meet">
  <defs>
   <pattern id={'grid-'+ident} width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" fill="none" stroke="#dee8ee" strokeWidth="1"/></pattern>
  </defs>
  <rect width={W} height={H} fill="#f2f7fa"/>
  <rect width={W} height={H} fill={'url(#grid-'+ident+')'}/>
  <rect x="18" y="15" width={W-36} height="72" rx="5" fill="#143a54"/>
  <text x="34" y="39" fontFamily="monospace" fill="#67dcf1" fontSize="12" letterSpacing="1">ENGINEERING DESIGN / NETWORK TOPOLOGY</text>
  <text x="34" y="66" fontFamily="Arial,sans-serif" fontWeight="700" fill="white" fontSize="21">{project.title.length>57?project.title.slice(0,55)+'…':project.title}</text>
  <text x={W-34} y="39" fontFamily="monospace" textAnchor="end" fill="#dbf2f9" fontSize="12">{nodes.length} NODES / {links.length} LINKS</text>
  <text x={W-34} y="65" fontFamily="monospace" textAnchor="end" fill="#91ead6" fontSize="11">REFERENCE · UNVERIFIED</text>
  {links.map((edge,i)=>{
   const a=lookup.get(edge.source)!,b=lookup.get(edge.target)!;
   const p=endpoint(a,b),q=endpoint(b,a);
   const horizontal=Math.abs(q.x-p.x)>Math.abs(q.y-p.y)*1.2;
   const path=horizontal?'M'+p.x+' '+p.y+' C'+(p.x+q.x)/2+' '+p.y+' '+(p.x+q.x)/2+' '+q.y+' '+q.x+' '+q.y:'M'+p.x+' '+p.y+' C'+p.x+' '+(p.y+q.y)/2+' '+q.x+' '+(p.y+q.y)/2+' '+q.x+' '+q.y;
   const role=edge.linkRole||'Ethernet';
   return <g key={edge.id||i}>
    <path d={path} stroke="#f3f8fb" strokeWidth="12" fill="none"/>
    <path d={path} className="topology-link" stroke={/IPsec|VPN|tunnel|BGP/i.test(role)?'#8b58c0':'#537e98'} strokeWidth="3" strokeDasharray={/IPsec|VPN|tunnel/i.test(role)?'9 7':undefined} fill="none"/>
    {!compact&&<g transform={'translate('+(p.x+q.x)/2+','+((p.y+q.y)/2-9)+')'}><rect width="134" height="21" x="-67" y="-13" fill="white" stroke="#d1e0e9" rx="3"/><text y="2" fill="#41647c" fontSize="10" textAnchor="middle" fontFamily="monospace">{role.length>19?role.slice(0,18)+'…':role}</text></g>}
   </g>;
  })}
  {nodes.map(n=>{
   const color=colors[n.kind]||colors.device;
   const v=n.data,tag=v.vlan?'VLAN '+v.vlan:n.kind.toUpperCase();
   return <g key={n.id} className="topology-device" transform={'translate('+n.x+','+n.y+')'}>
    <rect width={CW} height={CH} rx="7" fill="#fff" stroke="#a4bdcb" strokeWidth="2"/>
    <rect width="6" height={CH} rx="3" fill={color}/>
    <rect x="13" y="13" width="43" height="42" rx="4" fill="#eaf3f8" stroke="#d5e3eb"/>
    {n.logo?<image href={'/tech/'+n.logo+'.svg'} x="21" y="21" width="27" height="27" preserveAspectRatio="xMidYMid meet"/>:<g><circle cx="35" cy="34" r="16" fill={color}/><text x="35" y="38" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily="monospace">{abbreviation[n.kind]||'IT'}</text></g>}
    <text x="65" y="26" fill={color} fontSize="11" fontFamily="monospace">{n.kind.toUpperCase()} · {(v.platform||'INFRA').slice(0,14).toUpperCase()}</text>
    <text x="65" y="45" fill="#143449" fontSize="15" fontWeight="700" fontFamily="Arial,sans-serif">{v.label.length>19?v.label.slice(0,18)+'…':v.label}</text>
    <line x1="14" y1="62" x2={CW-14} y2="62" stroke="#e5eef2"/>
    <text x="16" y="83" fill="#456b83" fontSize="11.5" fontFamily="monospace">{v.ip||'External / layer-2'}</text>
    <text x="16" y="101" fill="#677f8f" fontSize="11" fontFamily="monospace">{(v.zone||'Infrastructure').slice(0,25)}</text>
    <rect x="15" y="109" width="82" height="15" rx="3" fill="#e8f2f6"/>
    <text x="20" y="120" fill="#27677d" fontSize="10" fontFamily="monospace">{tag}</text>
   </g>;
  })}
  <line x1="25" y1={H-36} x2={W-25} y2={H-36} stroke="#cfdee7"/>
  <text x="25" y={H-18} fontSize="12" fontFamily="monospace" fill="#617e91">RFC1918 DESIGN EXAMPLE · VERIFY ADDRESSING / ROUTES / POLICY BEFORE DEPLOYMENT</text>
  <text x={W-25} y={H-18} textAnchor="end" fontFamily="monospace" fontSize="11" fill="#4f8495">DESIGN / {project.slug.toUpperCase()}</text>
 </svg>;
}
