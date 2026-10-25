import type {NodeRecord,EdgeRecord,Project} from './types';

/** Engineering design examples: IPs are RFC 1918 documentation allocations, not deployed device inventories. */
type DeviceSpec=[string,string,string,string,string,string,string?,string?];
type LinkSpec=[number,number,string,string,string?];
type Layout={devices:DeviceSpec[];connections:LinkSpec[];description:string};
const layouts:Record<string,Layout>={
 'enterprise-multisite':{
 description:'Headquarters + two branches, segmented LAN, routed WAN, Linux services and monitoring.',
 devices:[
 ['WAN','Internet / ISP','cloud','Network provider','','Untrusted'],
 ['HQ-FW','HQ FortiGate','firewall','Fortinet','10.10.0.1/30','HQ Perimeter'],
 ['HQ-CORE','Cisco Core L3','switch','Cisco','10.10.99.1/24','HQ Management','99'],
 ['HQ-SRV','Windows AD / DNS','server','Microsoft','10.10.20.10/24','HQ Servers','20'],
 ['MON','Zabbix / Wazuh','server','Linux','10.10.20.20/24','HQ Servers','20'],
 ['BR-A','Branch A Router','router','Cisco','10.20.0.1/30','Branch A'],
 ['BR-A-LAN','Branch A LAN','switch','Cisco','10.20.10.1/24','Branch A Users','10'],
 ['BR-B','Branch B Router','router','FRRouting','10.30.0.1/30','Branch B'],
 ['BR-B-LAN','Branch B LAN','switch','Cisco','10.30.10.1/24','Branch B Users','10']
 ],connections:[[0,1,'ISP','wan1','Internet'],[1,2,'port1','Gi1/0/1','802.1Q trunk'],[2,3,'Gi1/0/10','eth0','VLAN 20'],[2,4,'Gi1/0/11','ens18','VLAN 20'],[1,5,'vpn-a','Gi0/0','IPsec / routed WAN'],[5,6,'Gi0/1','Gi1/0/1','Branch A LAN'],[1,7,'vpn-b','eth0','IPsec / routed WAN'],[7,8,'eth1','Gi1/0/1','Branch B LAN']]},
 'vlans-intervlan':{
 description:'Campus collapsed core, two department VLANs, guest isolation and routed services.',
 devices:[
 ['EDGE','Cisco Edge Router','router','Cisco','172.16.0.1/30','WAN'],
 ['CORE','Cisco L3 Core','switch','Cisco','10.40.99.1/24','Core','99'],
 ['ACC','Cisco Access Switch','switch','Cisco','10.40.99.11/24','Access','99'],
 ['HR','HR Workstation','client','Windows','10.40.10.21/24','HR','10'],
 ['ENG','Engineering Client','client','Windows','10.40.20.22/24','Engineering','20'],
 ['GUEST','Guest Client','client','Linux','10.40.30.33/24','Guest','30'],
 ['SVC','Internal DNS / DHCP','server','Linux','10.40.50.10/24','Services','50'],
 ['ACL','L3 ACL Boundary','firewall','Cisco','10.40.99.254/24','Segmentation','99']
 ],connections:[[0,1,'Gi0/0','Gi1/0/24','L3 uplink'],[1,2,'Gi1/0/1','Gi1/0/48','802.1Q 10/20/30/50'],[2,3,'Gi1/0/2','eth0','access VLAN 10'],[2,4,'Gi1/0/3','eth0','access VLAN 20'],[2,5,'Gi1/0/4','eth0','access VLAN 30'],[1,6,'Gi1/0/10','ens18','VLAN 50'],[1,7,'Gi1/0/23','Gi1/0/1','Inter-VLAN ACL']]},
 'routing-resilience':{
 description:'Dual WAN transport with OSPF/BGP routing domains and convergent failover.',
 devices:[
 ['SITE-A','Edge Router A','router','FRRouting','10.60.0.1/30','AS 65010'],
 ['ISP-A','ISP Transit A','router','FRRouting','10.60.0.2/30','AS 64501'],
 ['ISP-B','ISP Transit B','router','FRRouting','10.60.0.6/30','AS 64502'],
 ['SITE-B','Edge Router B','router','FRRouting','10.60.0.10/30','AS 65020'],
 ['LAN-A','HQ Internal OSPF','switch','Cisco','10.60.10.1/24','LAN A'],
 ['LAN-B','Branch Internal OSPF','switch','Cisco','10.60.20.1/24','LAN B'],
 ['TEST-A','HQ Test Host','client','Linux','10.60.10.10/24','LAN A'],
 ['TEST-B','Branch Test Host','client','Linux','10.60.20.10/24','LAN B']
 ],connections:[[0,1,'eth0','eth0','eBGP primary'],[0,2,'eth1','eth0','eBGP backup'],[1,3,'eth1','eth0','BGP transit'],[2,3,'eth1','eth1','BGP failover'],[0,4,'eth2','Gi0/1','OSPF area 0'],[3,5,'eth2','Gi0/1','OSPF area 0'],[4,6,'Gi0/2','eth0','LAN A'],[5,7,'Gi0/2','eth0','LAN B']]},
 'vpn-secure-wan':{
 description:'Route-based IPsec across an untrusted underlay with dedicated protected zones.',
 devices:[
 ['FW-HQ','FortiGate HQ','firewall','Fortinet','10.70.0.1/30','HQ'],
 ['WAN','Internet / Underlay','cloud','ISP','','Untrusted'],
 ['FW-BR','Palo Alto Branch','firewall','Palo Alto','10.70.0.5/30','Branch'],
 ['HQ-LAN','Protected HQ LAN','switch','Cisco','10.70.10.1/24','HQ Trusted','10'],
 ['HQ-APP','Internal Application','server','Linux','10.70.10.20/24','HQ Trusted','10'],
 ['BR-LAN','Protected Branch LAN','switch','Cisco','10.70.20.1/24','Branch Trusted','20'],
 ['BR-USER','Branch Workstation','client','Windows','10.70.20.30/24','Branch Trusted','20'],
 ['LOG','VPN / Firewall Logs','server','Linux','10.70.30.10/24','Monitoring','30']
 ],connections:[[0,1,'wan1','ISP-A','IKEv2 + ESP'],[1,2,'ISP-B','ethernet1/1','Untrusted'],[0,2,'IPsec0','tunnel.1','Tunnel overlay'],[0,3,'port2','Gi1/0/1','LAN HQ'],[3,4,'Gi1/0/2','eth0','Protected service'],[2,5,'ethernet1/2','Gi1/0/1','LAN Branch'],[5,6,'Gi1/0/2','eth0','Client'],[0,7,'port3','eth0','Syslog']]},
 'identity-ad':{
 description:'Domain services with redundant DNS, domain clients, GPO and a secured file share.',
 devices:[
 ['DC01','DC01 · AD DS / DNS','server','Windows Server','10.80.10.10/24','Server VLAN','10'],
 ['DC02','DC02 · AD DS / DNS','server','Windows Server','10.80.10.11/24','Server VLAN','10'],
 ['SW','Cisco Core Switch','switch','Cisco','10.80.99.1/24','Management','99'],
 ['FILES','SMB File Server','server','Windows Server','10.80.10.20/24','Server VLAN','10'],
 ['WIN01','Domain Client 01','client','Windows','10.80.20.21/24','Users','20'],
 ['WIN02','Domain Client 02','client','Windows','10.80.20.22/24','Users','20'],
 ['ADMIN','Admin Jump Host','client','Windows','10.80.99.15/24','Management','99'],
 ['GW','Inter-VLAN Gateway','firewall','Fortinet','10.80.99.254/24','Security Boundary','99']
 ],connections:[[0,2,'eth0','Gi1/0/1','AD/DNS'],[1,2,'eth0','Gi1/0/2','AD replication'],[3,2,'eth0','Gi1/0/3','SMB'],[4,2,'eth0','Gi1/0/10','VLAN 20'],[5,2,'eth0','Gi1/0/11','VLAN 20'],[6,2,'eth0','Gi1/0/12','VLAN 99'],[7,2,'port1','Gi1/0/24','L3 boundary']]},
 'linux-platform':{
 description:'Linux bastion, front-end, application tier and backup with protected SSH administration.',
 devices:[
 ['BASTION','SSH Bastion','server','Debian','10.90.99.10/24','Management','99'],
 ['FW','Perimeter Firewall','firewall','Fortinet','10.90.0.1/30','Perimeter'],
 ['WEB','Nginx Frontend','server','Ubuntu','10.90.10.10/24','DMZ','10'],
 ['APP','Linux Application','server','Debian','10.90.20.10/24','Applications','20'],
 ['DB','PostgreSQL DB','server','PostgreSQL','10.90.30.10/24','Data','30'],
 ['BACKUP','Backup Repository','server','Linux','10.90.40.10/24','Backup','40'],
 ['MON','Service Monitoring','server','Grafana','10.90.99.20/24','Management','99'],
 ['OPS','Operations Client','client','Linux','10.90.99.25/24','Management','99']
 ],connections:[[1,2,'dmz','eth0','HTTPS only'],[2,3,'eth1','ens18','Reverse proxy'],[3,4,'eth1','ens18','DB 5432'],[4,5,'eth1','ens18','Encrypted backup'],[0,3,'eth1','ens19','SSH restricted'],[0,4,'eth2','ens19','SSH restricted'],[7,0,'eth0','eth0','Admin SSH'],[6,3,'eth0','ens20','Metrics']]},
 'virtualization':{
 description:'Proxmox virtualization cluster concept with bridges, tagged networks and off-host backups.',
 devices:[
 ['PVE1','Proxmox Node A','server','Proxmox','10.100.99.11/24','Management','99'],
 ['PVE2','Proxmox Node B','server','Proxmox','10.100.99.12/24','Management','99'],
 ['SW','Cisco Trunk Switch','switch','Cisco','10.100.99.1/24','Management','99'],
 ['VM-AD','Windows Domain VM','server','Windows Server','10.100.20.10/24','Server VLAN','20'],
 ['VM-LNX','Linux Application VM','server','Ubuntu','10.100.20.20/24','Server VLAN','20'],
 ['NAS','Backup Target NAS','server','Linux','10.100.40.10/24','Backup','40'],
 ['ADMIN','Operations Console','client','Linux','10.100.99.25/24','Management','99'],
 ['FW','VM Egress Firewall','firewall','Fortinet','10.100.0.1/30','Perimeter']
 ],connections:[[0,2,'vmbr0','Gi1/0/1','802.1Q trunk'],[1,2,'vmbr0','Gi1/0/2','802.1Q trunk'],[0,3,'vmbr1','eth0','VM on VLAN 20'],[1,4,'vmbr1','eth0','VM on VLAN 20'],[0,5,'vmbr2','eth0','Backup over VLAN 40'],[1,5,'vmbr2','eth1','Backup replica'],[6,2,'eth0','Gi1/0/10','Admin VLAN 99'],[7,2,'port1','Gi1/0/24','Uplink']]},
 'observability':{
 description:'Polling, log collection, dashboarding and alert delivery across monitored endpoints.',
 devices:[
 ['R1','Cisco Edge Router','router','Cisco','10.110.0.1/24','Network'],
 ['FW','FortiGate Firewall','firewall','Fortinet','10.110.0.254/24','Security'],
 ['SW','Core Switch','switch','Cisco','10.110.0.2/24','Network'],
 ['ZBX','Zabbix Server','server','Zabbix','10.110.20.10/24','Monitoring','20'],
 ['GRAF','Grafana Dashboard','server','Grafana','10.110.20.11/24','Monitoring','20'],
 ['SYSLOG','Central Syslog','server','Linux','10.110.20.12/24','Monitoring','20'],
 ['APP','Monitored Linux VM','server','Ubuntu','10.110.10.10/24','Production','10'],
 ['NOC','NOC Operator','client','Linux','10.110.30.10/24','Operations','30']
 ],connections:[[0,2,'Gi0/0','Gi1/0/1','SNMPv3'],[1,2,'port1','Gi1/0/2','Syslog/TLS'],[2,3,'Gi1/0/10','eth0','SNMP/agent'],[3,4,'http','http','Zabbix API'],[2,5,'Gi1/0/11','eth0','Syslog'],[2,6,'Gi1/0/12','eth0','Agent 10050'],[7,4,'eth0','http','Dashboard HTTPS']]},
 'security-monitoring':{
 description:'Wazuh SIEM event collection for Windows Sysmon and Linux audit sources.',
 devices:[
 ['WIN','Windows + Sysmon','client','Windows','10.120.10.20/24','Workstations','10'],
 ['LNX','Linux Audit Endpoint','server','Ubuntu','10.120.20.20/24','Servers','20'],
 ['FW','FortiGate Firewall','firewall','Fortinet','10.120.0.254/24','Perimeter'],
 ['SW','Log Network Core','switch','Cisco','10.120.99.1/24','Log Transport','99'],
 ['WAZ','Wazuh Manager','server','Wazuh','10.120.30.10/24','SIEM','30'],
 ['IDX','Wazuh Indexer','server','Wazuh','10.120.30.11/24','SIEM','30'],
 ['DASH','Wazuh Dashboard','server','Wazuh','10.120.30.12/24','SOC','30'],
 ['SOC','SOC Analyst Station','client','Linux','10.120.40.10/24','SOC Users','40']
 ],connections:[[0,3,'eth0','Gi1/0/1','Agent 1514'],[1,3,'eth0','Gi1/0/2','Agent 1514'],[2,3,'port2','Gi1/0/3','Syslog'],[3,4,'Gi1/0/10','eth0','Event collection'],[4,5,'indexer','9200','Indexed events'],[5,6,'9200','443','Dashboard'],[7,6,'eth0','443','Analyst HTTPS']]},
 'security-hardening':{
 description:'Zone-based next-generation firewall policy separating WAN, DMZ, user and management.',
 devices:[
 ['INET','External Test Network','cloud','WAN','','Untrusted'],
 ['PAN','Palo Alto NGFW','firewall','Palo Alto','10.130.0.1/30','Perimeter'],
 ['FORTI','FortiGate Inside','firewall','Fortinet','10.130.99.254/24','Internal'],
 ['DMZ','DMZ Web Service','server','Linux','10.130.10.10/24','DMZ','10'],
 ['SW','Core Access Switch','switch','Cisco','10.130.99.1/24','Management','99'],
 ['USERS','Internal Client VLAN','client','Windows','10.130.20.20/24','Users','20'],
 ['ADMIN','Privileged Jumpbox','client','Linux','10.130.99.20/24','Management','99'],
 ['LOG','Firewall Log Collector','server','Wazuh','10.130.30.10/24','Security Logs','30']
 ],connections:[[0,1,'WAN','ethernet1/1','Untrust'],[1,3,'ethernet1/2','eth0','DMZ policy 443'],[1,2,'ethernet1/3','wan1','Inside transit'],[2,4,'port1','Gi1/0/1','Trunk'],[4,5,'Gi1/0/2','eth0','VLAN 20'],[4,6,'Gi1/0/3','eth0','VLAN 99'],[2,7,'port2','eth0','Syslog']]},
 'infra-automation':{
 description:'Ansible control host with Git-backed inventory and cross-platform managed endpoints.',
 devices:[
 ['GIT','Git Configuration Repo','server','Git','10.140.99.15/24','Automation','99'],
 ['CTRL','Ansible Control Node','server','Ansible','10.140.99.10/24','Automation','99'],
 ['SW','Management Switch','switch','Cisco','10.140.99.1/24','Management','99'],
 ['LINUX1','Managed Ubuntu 01','server','Ubuntu','10.140.20.11/24','Linux Tier','20'],
 ['LINUX2','Managed Debian 02','server','Debian','10.140.20.12/24','Linux Tier','20'],
 ['NET','Cisco Network Device','router','Cisco','10.140.10.1/24','Network','10'],
 ['WIN','Windows Server','server','Windows Server','10.140.30.10/24','Windows','30'],
 ['AUDIT','Configuration Audit Logs','server','Linux','10.140.99.20/24','Automation','99']
 ],connections:[[0,1,'git/https','443','Git pull'],[1,2,'eth0','Gi1/0/1','Management'],[2,3,'Gi1/0/10','eth0','SSH 22'],[2,4,'Gi1/0/11','eth0','SSH 22'],[2,5,'Gi1/0/12','Gi0/0','Network CLI'],[2,6,'Gi1/0/13','eth0','WinRM 5986'],[1,7,'log','eth0','Execution reports']]},
 'recovery-resilience':{
 description:'Production workload, scheduled backup, isolated object storage and tested restore target.',
 devices:[
 ['APP','Primary Linux Service','server','Linux','10.150.10.10/24','Production','10'],
 ['DB','PostgreSQL Primary','server','PostgreSQL','10.150.10.20/24','Production','10'],
 ['BACK','Restic Backup Job','server','Linux','10.150.30.10/24','Backup','30'],
 ['S3','S3 Backup Storage','server','Docker','10.150.30.20/24','Backup','30'],
 ['REST','Recovery Host','server','Ubuntu','10.150.40.10/24','Isolated Restore','40'],
 ['FW','Backup Isolation GW','firewall','Fortinet','10.150.99.254/24','Security Boundary','99'],
 ['SW','Core Switch','switch','Cisco','10.150.99.1/24','Management','99'],
 ['OBS','Recovery Validation','client','Linux','10.150.40.20/24','Recovery Test','40']
 ],connections:[[0,6,'eth0','Gi1/0/1','App VLAN 10'],[1,6,'eth0','Gi1/0/2','DB VLAN 10'],[2,6,'eth0','Gi1/0/10','Backup VLAN 30'],[6,5,'Gi1/0/24','port1','Firewall transit'],[2,3,'backup','9000','S3 encrypted'],[3,4,'9000','eth0','Restore data'],[4,7,'eth1','eth0','Recovery check']]}
};
export const referenceTopology=(slug:string):Project['topology']|undefined=>{
 const design=layouts[slug];if(!design)return undefined;
 const nodes:NodeRecord[]=design.devices.map(([key,label,kind,platform,ip,zone,vlan,role],i)=>({
  id:key,position:{x:(i%4)*280,y:Math.floor(i/4)*225},
  data:{label,kind,platform,ip,zone,...(vlan?{vlan}:{}),role:role||design.description}
 }));
 const edges:EdgeRecord[]=design.connections.map(([source,target,sourcePort,targetPort,linkRole],i)=>({
  id:'link-'+i,source:design.devices[source][0],target:design.devices[target][0],sourcePort,targetPort,linkRole:linkRole||'Ethernet'
 }));
 return {nodes,edges};
};
export const referenceDescription=(slug:string)=>layouts[slug]?.description||'Infrastructure reference design';
export const isUntouchedLegacyTopology=(slug:string,topology:Project['topology']):boolean=>{
 const design=layouts[slug];
 if(!design||topology.nodes.length!==4||topology.edges.length!==3)return false;
 return topology.nodes.every((n,i)=>n.id==='n'+i&&!n.data.platform&&!n.data.ip&&!n.data.zone&&n.position.x===(i%2)*310&&n.position.y===Math.floor(i/2)*170)
 && topology.edges.every((e,i)=>e.id==='e'+i&&e.source==='n'+i&&e.target==='n'+(i+1)&&!e.sourcePort&&!e.targetPort);
};
export const showReferenceDesign=(p:Project):Project=>{
 if(p.status!=='planned'||!isUntouchedLegacyTopology(p.slug,p.topology))return p;
 const topology=referenceTopology(p.slug);
 return topology?{...p,topology}:p;
};
