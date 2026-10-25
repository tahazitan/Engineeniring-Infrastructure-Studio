import {Activity,Cloud,CloudCog,Cpu,Database,HardDrive,LifeBuoy,LockKeyhole,Monitor,Network,Router,Server,Shield,ShieldCheck,Terminal,Users,Wifi,type LucideIcon} from 'lucide-react';
/**
 * Authentic icon files in /public/tech only; no invented brand artwork.
 * Every missing vendor mark gets a named neutral Lucide pictogram, never a fake vendor logo.
 */
const known:[RegExp,string][]=[
 [/palo\s*alto/i,'paloalto'],[/forti(?:net|gate)?/i,'fortinet'],[/gns\s*3/i,'gns3'],
 [/zabbix/i,'zabbix'],[/wazuh/i,'wazuh'],[/microsoft/i,'microsoft'],[/windows(?:\s+server)?/i,'windows'],
 [/wireshark/i,'wireshark'],[/proxmox/i,'proxmox'],[/cisco/i,'cisco'],
 [/postgres(?:ql)?/i,'postgresql'],[/kubernetes|k8s/i,'kubernetes'],
 [/node(?:\.|\s*)js/i,'nodejs'],[/express(?:\.js)?/i,'express'],[/next(?:\.|\s*)js/i,'nextjs'],
 [/cloudflare/i,'cloudflare'],[/debian/i,'debian'],[/ubuntu/i,'ubuntu'],
 [/grafana/i,'grafana'],[/ansible/i,'ansible'],[/github/i,'github'],[/gitlab/i,'gitlab'],
 [/\bgit\b/i,'git'],[/rustdesk/i,'rustdesk'],[/anydesk/i,'anydesk'],
 [/kali(?:\s*linux)?/i,'kali'],[/wireguard/i,'wireguard'],[/prometheus/i,'prometheus'],
 [/elastic(?:search|stack)?/i,'elastic'],[/virtualbox/i,'virtualbox'],[/vmware/i,'vmware'],[/rustfs/i,'rustfs'],
 [/docker/i,'docker'],[/\blinux\b/i,'linux']
];
export const featuredTechnologies=['Cisco','Fortinet','Palo Alto','GNS3','Proxmox','Docker','Linux','Wireshark','AnyDesk','Kali Linux','WireGuard','Grafana','PostgreSQL','GitLab'];
export function getLogo(name:string){return known.find(([pattern])=>pattern.test(name))?.[1]||null;}
function iconFor(name:string):LucideIcon {
 if(/windows|server|ad\s*ds/i.test(name))return Server;
 if(/active\s*directory|identity|user|gpo/i.test(name))return Users;
 if(/wazuh|soc|siem|ids|security|snort/i.test(name))return ShieldCheck;
 if(/zabbix|monitor|observability|snmp|syslog/i.test(name))return Activity;
 if(/powershell|shell|bash|command|cli/i.test(name))return Terminal;
 if(/oracle|database|sql/i.test(name))return Database;
 if(/vpn|ipsec|nat|firewall/i.test(name))return Shield;
 if(/router|routing|ospf|bgp|frrouting/i.test(name))return Router;
 if(/cloud|aws|azure/i.test(name))return Cloud;
 if(/vps|virtualization|hypervisor/i.test(name))return HardDrive;
 if(/support|helpdesk|ticket/i.test(name))return LifeBuoy;
 if(/docker|container/i.test(name))return Cpu;
 if(/ethernet|network|tcp|vlan|dns|dhcp/i.test(name))return Network;
 return Monitor;
}
export default function TechnologyLogo({name,compact=false}:{name:string;compact?:boolean}){
 const logo=getLogo(name),Fallback=iconFor(name);
 return <span className={'technology-logo'+(compact?' compact':'')+(logo?' has-vendor':' neutral-tech')} title={name} aria-label={logo?name+' technology logo':name+' technology'}>
  {logo?<img src={'/tech/'+logo+'.svg'} alt="" width={compact?44:68} height={compact?44:68} loading="lazy" decoding="async"/>:<span className="tech-fallback-mark" aria-hidden="true"><Fallback size={compact?35:57} strokeWidth={1.65}/></span>}
  <span className="tech-label">{name}</span>
 </span>;
}
