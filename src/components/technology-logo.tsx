import {Network} from 'lucide-react';
const known:[RegExp,string][]=[
 [/palo\s*alto/i,'paloalto'],[/forti/i,'fortinet'],[/gns\s*3/i,'gns3'],
 [/wireshark/i,'wireshark'],[/proxmox/i,'proxmox'],[/cisco/i,'cisco'],
 [/postgres/i,'postgresql'],[/kubernetes|k8s/i,'kubernetes'],
 [/node(?:\.|\s*)js/i,'nodejs'],[/express/i,'express'],[/next(?:\.|\s*)js/i,'nextjs'],
 [/cloudflare/i,'cloudflare'],[/debian/i,'debian'],[/ubuntu/i,'ubuntu'],
 [/grafana/i,'grafana'],[/ansible/i,'ansible'],[/github/i,'github'],[/git/i,'git'],
 [/docker|containerlab/i,'docker'],[/linux|kvm|frrouting/i,'linux'],
];
export const featuredTechnologies=['Cisco','GNS3','Docker','Linux','Fortinet','Palo Alto','Wireshark','Proxmox','PostgreSQL','Grafana'];
export function getLogo(name:string){return known.find(([matcher])=>matcher.test(name))?.[1]||null;}
export default function TechnologyLogo({name,compact=false}:{name:string;compact?:boolean}){
 const logo=getLogo(name);
 return <span className={'technology-logo'+(compact?' compact':'')} title={name}>
  {logo?<img src={'/tech/'+logo+'.svg'} alt="" width={compact?19:29} height={compact?19:29} loading="lazy"/>:<Network size={compact?16:22} aria-hidden="true"/>}
  <span>{name}</span>
 </span>;
}
