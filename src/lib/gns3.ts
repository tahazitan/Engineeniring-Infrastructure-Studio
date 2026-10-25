import type {NodeRecord,EdgeRecord} from './types';

type AnyRecord=Record<string,unknown>;
const record=(v:unknown):AnyRecord=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as AnyRecord:{};
const array=(v:unknown)=>Array.isArray(v)?v:[];
const text=(v:unknown,fallback='')=>typeof v==='string'?v:fallback;
const number=(v:unknown,fallback:number)=>typeof v==='number'&&Number.isFinite(v)?Math.max(-20000,Math.min(20000,v)):fallback;
export type StudioTopology={nodes:NodeRecord[];edges:EdgeRecord[]};
export function inferKind(name:string,nodeType=''){
 const s=(name+' '+nodeType).toLowerCase();
 if(/forti|palo|asa|firewall|opnsense|pfsense|security/.test(s))return 'firewall';
 if(/router|rtr|frr|vyos|csr|iosv|mikrotik|dynamips/.test(s))return 'router';
 if(/switch|iosvl2|bridge|ovs/.test(s))return 'switch';
 if(/vpcs|client|desktop|workstation|remote user|laptop|endpoint|pc-/.test(s))return 'client';
 if(/cloud|internet|wan|nat/.test(s))return 'cloud';
 if(/server|linux|debian|ubuntu|windows|docker|qemu|virtualbox|vm/.test(s))return 'server';
 return 'device';
}
function portLabel(v:unknown):string {
 const node=record(v),label=record(node.label);
 if(typeof label.text==='string'&&label.text.trim())return label.text.slice(0,64);
 if(typeof node.adapter_number==='number'&&typeof node.port_number==='number')return node.adapter_number+'/'+node.port_number;
 return '';
}
export function gns3ToStudio(raw:unknown):StudioTopology{
 const root=record(raw),top=record(root.topology);
 const source=array(top.nodes).length?top:root;
 const rawNodes=array(source.nodes),rawLinks=array(source.links);
 if(rawNodes.length===0||rawNodes.length>150)throw Error('GNS3 topology must contain between 1 and 150 nodes.');
 const ids=new Set<string>();
 const nodes:NodeRecord[]=rawNodes.map((item,i)=>{
  const node=record(item),id=text(node.node_id,text(node.id,'gns3-'+i)).slice(0,80);
  if(!id||ids.has(id))throw Error('GNS3 topology contains duplicate or empty node IDs.');
  ids.add(id);
  const name=text(node.name,text(node.label,'Device '+(i+1))).slice(0,150),nodeType=text(node.node_type,'');
  return {id,position:{x:number(node.x,(i%5)*240),y:number(node.y,Math.floor(i/5)*175)},data:{label:name,kind:inferKind(name,nodeType),platform:nodeType.slice(0,64)}};
 });
 if(rawLinks.length>300)throw Error('GNS3 topology exceeds the 300-link limit.');
 const edges:EdgeRecord[]=rawLinks.flatMap((item,i)=>{
  const link=record(item),endpoints=array(link.nodes);
  if(endpoints.length<2)return [];
  const a=record(endpoints[0]),b=record(endpoints[1]),source=text(a.node_id),target=text(b.node_id);
  if(!ids.has(source)||!ids.has(target))return [];
  return [{id:text(link.link_id,'link-'+i).slice(0,80),source,target,animated:false,sourcePort:portLabel(a),targetPort:portLabel(b)}];
 });
 return {nodes,edges};
}
export function formatGns3Ports(edge:EdgeRecord){return [edge.sourcePort,edge.targetPort].filter(Boolean).join(' ↔ ');}
