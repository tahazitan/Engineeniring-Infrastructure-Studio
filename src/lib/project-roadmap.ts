import type {TrackId} from './engineering-roadmap';

/** Planned training projects; none are deployments or credentials until user verifies them. */
export type ProjectPhase={
 id:string; title:string; learn:string; build:string; verify:string; evidence:string;
};
export type ProjectMaterial={label:string;url:string;type:'Docs'|'Course'|'Lab'};
export type ProjectMonth={
 month:number; name:string; domain:TrackId[]; goal:string; requirements:string[];
 stack:string[];studioSlug?:string; architecture:string; steps:ProjectPhase[];
 acceptance:string[]; deliverables:string[]; materials:ProjectMaterial[];
};
const step=(month:number,n:number,title:string,learn:string,build:string,verify:string,evidence:string):ProjectPhase=>({
 id:'p'+String(month).padStart(2,'0')+'-'+n,title,learn,build,verify,evidence
});
export const projectRoadmap:ProjectMonth[]=[
 {
 month:1,name:'IT Support Service Desk & Diagnostics',domain:['foundation','support'],
 goal:'Set up a realistic remote help-desk environment and repeatable incident lifecycle.',
 requirements:['One isolated Windows VM and one Linux VM','A local ticketing workflow or GLPI sandbox','Authorization rules for remote-access scenarios'],
 stack:['Windows Server','Linux','GLPI','AnyDesk','Wireshark'],architecture:'Helpdesk workstation → ticket register → Windows/Linux test machines, all in a private LAN.',
 studioSlug:'linux-platform',
 steps:[
 step(1,1,'Plan the support environment','Ticket severity, SLA concepts, ITSM, endpoint hardware/software and data privacy.','Create VM inventory, incident categories and three sample ticket templates.','Verify every incident has owner, priority, impact and reproducible symptoms.','Asset inventory and support workflow diagram.'),
 step(1,2,'Build the service desk','GLPI basics, client/server protocols, remote-assistance approval and triage.','Run GLPI in an isolated test environment or use a structured local ticket tracker.','Create and close a test ticket with a complete diagnostic trail.','Screenshots/export of sanitized ticket lifecycle.'),
 step(1,3,'Practice system incidents','Event Viewer, journalctl, ping, DNS troubleshooting, CPU/RAM/disk checks.','Simulate slow PC, printer queue and name-resolution issues on test machines.','Reproduce each issue and validate the corrective action without credential exposure.','Three before/after incident notes with commands used.'),
 step(1,4,'Complete the support runbook','Handover, root cause, escalation and repeatability.','Write a customer-facing support procedure and internal troubleshooting checklist.','Have a second test account follow the steps; verify no missing dependency.','Versioned GLPI/support SOP and three case studies.')
 ],
 acceptance:['At least three issues reproduced and resolved in a lab','Each ticket records symptoms, diagnosis and remediation','Reversible changes and authorized remote-access scope documented'],
 deliverables:['Incident report pack','Service-desk SOP','IT asset register'],
 materials:[{label:'Microsoft Windows troubleshooting documentation',url:'https://learn.microsoft.com/en-us/windows/client-management/',type:'Docs'},{label:'GLPI official documentation',url:'https://glpi-project.org/documentation/',type:'Docs'},{label:'Coursera — Technical Diagnostics and Troubleshooting',url:'https://www.coursera.org/learn/technical-diagnostics-and-troubleshooting-techniques',type:'Course'}]
 },
 {
 month:2,name:'Windows Server Domain Services',domain:['windows','support'],
 goal:'Deploy a domain with working DNS, DHCP, file shares and scoped Group Policy.',
 requirements:['Windows Server evaluation license or lawful access','One client VM, snapshots and an isolated subnet','Domain/IP naming plan and admin accounts'],
 stack:['Windows Server','Active Directory','DNS','DHCP','PowerShell'],architecture:'Domain Controller (AD DS/DNS/DHCP) ↔ domain-joined client ↔ file share.',
 studioSlug:'identity-ad',
 steps:[
 step(2,1,'Plan identity and DNS','Domain structure, OUs, directory permissions, forward/reverse DNS and Windows licensing.','Design lab domain, OU hierarchy, users/groups, subnet and recovery points.','Review DNS and identity boundaries; confirm snapshots exist.','Identity/OU and addressing design.'),
 step(2,2,'Install AD DS + DNS','AD installation, DNS zones, client resolver paths and DHCP scopes.','Install test DC, promote to AD DS and configure DNS/DHCP on authorized VMs.','Run nslookup, ipconfig /all and client domain join; resolve test host records.','Installation record and command-output captures.'),
 step(2,3,'Harden access and policy','GPO scope, password policy, file permissions and least privilege.','Create group-specific SMB shares and test GPO settings for two user roles.','Use gpresult, account login and file permission tests; assert unauthorized access denied.','GPO results and allow/deny matrix.'),
 step(2,4,'Recover and document','Backups, restore planning, Windows event logs and incident troubleshooting.','Document backup and recovery runbook in snapshots; test one safe rollback.','Rejoin test workstation after restoration and verify DNS/identity consistency.','Domain runbook and recovery evidence.')
 ],
 acceptance:['Client joins domain and resolves DNS','Correct GPO and share permissions for two user roles','Documented restoration returns client services'],
 deliverables:['AD topology and OU plan','GPO/file access matrix','Windows Server handover and restore runbook'],
 materials:[{label:'Microsoft Learn — Windows Server',url:'https://learn.microsoft.com/en-us/windows-server/',type:'Docs'},{label:'Microsoft Learn — Active Directory Domain Services',url:'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/',type:'Docs'},{label:'Coursera — Windows Server Management and Security',url:'https://www.coursera.org/learn/windows-server-management-security',type:'Course'}]
 },
 {
 month:3,name:'Cisco Enterprise VLAN & LAN Segmentation',domain:['networking'],
 goal:'Build a four-zone segmented enterprise LAN with routing and verified isolation.',
 requirements:['GNS3 server with suitable lawful Cisco/switch or Linux alternatives','Network addressing plan','Packet capture capability'],
 stack:['Cisco','GNS3','Wireshark','Linux'],architecture:'Core L3 gateway → managed switching → User, Server, Management and Guest VLANs.',
 studioSlug:'vlans-intervlan',
 steps:[
 step(3,1,'Addressing and access design','Subnetting, broadcast domains, 802.1Q and access/trunk distinction.','Build VLAN/IP table, interface map and allowed/denied traffic matrix.','Review nonoverlapping subnets and gateway assignment.','Subnet plan and diagram exported from real GNS3.'),
 step(3,2,'Configure switching','VLAN tagging, native VLAN risk and switchport mode checks.','Create four VLANs with trunks and access ports in GNS3.','Inspect show vlan/show interfaces trunk or equivalent and capture tagged traffic.','Sanitized switch configs and pcap evidence.'),
 step(3,3,'Route between zones','Inter-VLAN routing, DHCP relay and DNS resolver connectivity.','Create routed interfaces/SVIs and test authorized cross-zone flows.','Ping, traceroute and lease tests show expected gateways; guests are isolated.','Routing tables and connectivity matrix.'),
 step(3,4,'Security and failure testing','ACLs, blocked paths and safe network change management.','Apply deny rules and simulate an interface failure with a rollback plan.','Positive and negative connectivity tests pass before and after rollback.','Test-case log and final topology.')
 ],
 acceptance:['Every VLAN has valid gateway and test host','Trunk carries intended VLANs only','Guest isolation and approved access demonstrated'],
 deliverables:['GNS3 topology export','VLAN/interface/IP matrix','Inter-VLAN tests and switch configuration'],
 materials:[{label:'GNS3 documentation',url:'https://docs.gns3.com/',type:'Docs'},{label:'Cisco training & certification',url:'https://www.cisco.com/site/us/en/learn/training-certifications/',type:'Docs'},{label:'Coursera — CCNA networking basics',url:'https://www.coursera.org/learn/ccna-networking-basics-switching-addressing-routing-lo093063',type:'Course'}]
 },
 {
 month:4,name:'Multi-Site Dynamic Routing & Resilience',domain:['networking','infrastructure'],
 goal:'Connect HQ with two branches, observe OSPF convergence and rehearse WAN failure.',
 requirements:['Prior VLAN routing lab or equivalent','Three routers or FRRouting containers','Private simulated WAN links'],
 stack:['Cisco','GNS3','Linux','Wireshark'],architecture:'HQ router ↔ simulated WAN ↔ Branch A / Branch B with separate private LANs.',
 studioSlug:'routing-resilience',
 steps:[
 step(4,1,'Design the WAN','OSPF neighbor/area basics, routing metrics, route summarization, redundancy.','Map HQ and two branches, LAN/WAN prefixes and preferred paths.','No overlapping prefixes; link/interface plan reviews cleanly.','Network design + routing acceptance plan.'),
 step(4,2,'Implement routing','Static and dynamic routes, hello/dead timers and interface authentication options.','Configure OSPF peers or FRRouting equivalents in GNS3.','Check neighbor adjacency and learned routes at all sites.','show ip ospf neighbor / ip route outputs.'),
 step(4,3,'Measure failover','Route selection, packet loss, convergence and monitoring.','Break one WAN link in isolated simulation, then restore it.','Measure recovery/reconvergence and verify branch-to-HQ reachability.','Timestamped failure and recovery table.'),
 step(4,4,'Operational handover','Change controls, backups, troubleshooting and rollback.','Create routing troubleshooting runbook and versioned configs.','Apply a known reversible misconfiguration; recover documented baseline.','WAN diagnostics case study and final report.')
 ],
 acceptance:['All expected prefixes learned','HQ-to-branches traffic survives a planned link failure where redundancy exists','Measured convergence and rollback recorded'],
 deliverables:['Multi-site routing lab','OSPF and failover evidence','Troubleshooting playbook'],
 materials:[{label:'FRRouting documentation',url:'https://docs.frrouting.org/',type:'Docs'},{label:'GNS3 guide',url:'https://docs.gns3.com/',type:'Docs'},{label:'Cisco certification roadmap',url:'https://www.cisco.com/site/us/en/learn/training-certifications/',type:'Docs'}]
 },
 {
 month:5,name:'Linux Systems Administration Platform',domain:['linux'],
 goal:'Operate a dependable Linux service host with access control, logging and recoverability.',
 requirements:['Debian or Ubuntu VM','Isolated SSH administrative access','Snapshots and version-controlled config folder'],
 stack:['Linux','Debian','Ubuntu','Git'],architecture:'Admin host → SSH → Debian/Ubuntu application VM → backup repository.',
 studioSlug:'linux-platform',
 steps:[
 step(5,1,'Prepare the VM','Unix permissions, filesystems, apt, networking and systemd.','Install Linux, plan users/groups, network interface and service inventory.','Check storage, network, package status, sudo scope and snapshots.','OS baseline and inventory sheet.'),
 step(5,2,'Set up remote administration','SSH keys, sudo, systemd, journald and firewall fundamentals.','Create least-privileged admin account, SSH key access and test service.','Verify authorized SSH works, password paths constrained, logs capture changes.','Sanitized sshd settings and access test output.'),
 step(5,3,'Operate the service','Monitoring CPU/disk/network, scheduled jobs and patch procedure.','Deploy a simple internal service, journal collection and shell health check.','Restart service and simulate a stopped service; record detection and repair.','Health-check script + troubleshooting notes.'),
 step(5,4,'Back up and restore','Configuration backup, safe updates and rollback tests.','Create config backups and restore in disposable VM snapshot.','Check post-restore service reachability and file checksum consistency.','Linux operations SOP and recovery proof.')
 ],
 acceptance:['Remote administration follows least privilege','Services restart and recover','Test backup restored successfully'],
 deliverables:['Linux admin runbook','Hardening checklist','Service/restore logs'],
 materials:[{label:'Ubuntu server guides',url:'https://ubuntu.com/server/docs',type:'Docs'},{label:'Debian Administrator handbook',url:'https://debian-handbook.info/',type:'Docs'},{label:'Coursera — Linux commands & shell scripting',url:'https://www.coursera.org/learn/hands-on-introduction-to-linux-commands-and-shell-scripting',type:'Course'}]
 },
 {
 month:6,name:'Firewall, NAT and IPsec VPN Integration',domain:['networking','infrastructure'],
 goal:'Protect HQ-to-branch connectivity through explicit security zones and VPN policies.',
 requirements:['Owned isolated firewall test appliances or compatible open-source virtual firewalls','WAN/LAN addressing and routing from prior projects','Documented permitted flows'],
 stack:['Fortinet','Palo Alto','GNS3','Wireshark'],architecture:'HQ protected LAN → firewall ↔ encrypted tunnel ↔ branch firewall → branch LAN.',
 studioSlug:'vpn-secure-wan',
 steps:[
 step(6,1,'Scope security zones','Policy order, NAT, IPsec IKE/ESP, site-to-site traffic selectors.','Define WAN, Users, Servers, Guest and Management security zones.','Validate routes, NAT exclusions and allow/deny table against services.','Zone policy matrix and IPsec design.'),
 step(6,2,'Build the firewalls','Interface zoning, policy objects, controlled lab image licensing.','Configure lawful FortiGate/Palo Alto trial where available or strongSwan + nftables alternative.','Capture interface status and confirm approved LAN traffic paths.','Config excerpts excluding keys and passwords.'),
 step(6,3,'Establish the tunnel','IKE negotiation phases, routing across tunnel and firewall logging.','Configure site-to-site VPN with lab-only credentials.','Check IKE/CHILD SA, bidirectional protected connectivity and encrypted packet observation.','VPN state logs + annotated packet capture.'),
 step(6,4,'Failure and security tests','Implicit deny, blocked services, MTU and troubleshooting.','Try disallowed guest-to-server traffic; simulate tunnel outage and recovery.','Approved paths work; blocked paths fail; tunnel reconnects predictably.','Positive/negative policy tests and recovery guide.')
 ],
 acceptance:['Approved VPN traffic passes with encrypted tunnel states','Disallowed zone traffic blocked','Outage and recovery recorded without exposing secrets'],
 deliverables:['Security policy matrix','Firewall/VPN design and config notes','Tunnel and access tests'],
 materials:[{label:'Fortinet Training Institute',url:'https://training.fortinet.com/',type:'Docs'},{label:'Palo Alto Networks documentation',url:'https://docs.paloaltonetworks.com/',type:'Docs'},{label:'strongSwan documentation',url:'https://docs.strongswan.org/',type:'Docs'}]
 },
 {
 month:7,name:'Zabbix & Infrastructure Monitoring',domain:['infrastructure','soc'],
 goal:'Make server and network incidents visible with metrics, dashboards and alerts.',
 requirements:['Linux monitoring VM','At least two owned monitored nodes','Isolated network and log storage'],
 stack:['Zabbix','Linux','Wireshark','Grafana'],architecture:'Network agents/SNMP hosts → Zabbix Server → dashboard + alerting channel.',
 studioSlug:'observability',
 steps:[
 step(7,1,'Define observability scope','Polling, agents, SNMP, baselines, severity and noise control.','Make monitored service inventory and threshold/alert matrix.','Ensure each metric maps to a useful operator action.','Metric list and expected threshold tests.'),
 step(7,2,'Deploy monitoring','Zabbix server/agent, network endpoints and secure SNMP.','Run Zabbix in an isolated VM; register Linux server and simulated network endpoint.','Confirm timestamped incoming metrics and host availability.','Agent enrollment and dashboard captures.'),
 step(7,3,'Create actionable alerts','CPU, disk, service availability, trigger expressions, acknowledgement.','Implement three alerts and operator remediation hints.','Trigger disk/CPU/service conditions safely and confirm alert correlation.','Three test event logs with dashboard state.'),
 step(7,4,'Recover and tune','Alert noise, incident escalation and service restore checks.','Reset test faults and tune recurring thresholds.','Confirm event recovery and produce response timeline.','Zabbix runbook and alert register.')
 ],
 acceptance:['At least two hosts report metrics','Three controlled alerts fire correctly','Recovery events close or normalize'],
 deliverables:['Monitoring dashboards','Trigger matrix','Alert/recovery investigation report'],
 materials:[{label:'Zabbix manuals',url:'https://www.zabbix.com/documentation/current/en/manual',type:'Docs'},{label:'SNMP monitoring concepts',url:'https://www.zabbix.com/documentation/current/en/manual/config/items/itemtypes/snmp',type:'Docs'}]
 },
 {
 month:8,name:'Wazuh SIEM & Detection Engineering',domain:['soc','linux','windows'],
 goal:'Collect Windows/Linux events into an isolated SIEM and investigate reproducible alerts.',
 requirements:['Wazuh server sizing appropriate to Mac/lab VM','Windows/Linux test endpoint','Consent and lab-only test identities'],
 stack:['Wazuh','Windows Server','Linux','Wireshark'],architecture:'Windows + Linux test endpoints → Wazuh agents → manager/indexer → analyst console.',
 studioSlug:'security-monitoring',
 steps:[
 step(8,1,'Map log sources','Windows Event Logs, Sysmon basics, Linux auth logs and event severity.','Choose log sources and detection goals; define privacy and retention settings.','Check event fields needed for each detection are available.','SIEM event-source and detection matrix.'),
 step(8,2,'Install Wazuh','Agent enrollment, manager, rules and dashboards.','Install Wazuh manager and enroll owned Windows/Linux lab agents.','Validate two distinct event types reach the indexer with source attribution.','Agent registration and event samples.'),
 step(8,3,'Write and tune a detection','Controlled failed logins, process changes, false positives and triage.','Generate safe failed-login burst on own test account and build/tune a detection.','Alert fires when expected; demonstrate one false-positive case.','Detection rule, tests and alert screenshots.'),
 step(8,4,'Respond and document','Triage severity, case timeline, containment and lessons learned.','Create incident case report and detection response runbook.','Repeat event sequence and verify same response evidence.','SOC triage report and reproducible casebook.')
 ],
 acceptance:['Linux and Windows event collection confirmed','One lab detection reliably triggers','Case timeline with evidence and false-positive analysis'],
 deliverables:['Wazuh SIEM topology','Detection scenario and rule','Incident report and test evidence'],
 materials:[{label:'Wazuh official documentation',url:'https://documentation.wazuh.com/current/',type:'Docs'},{label:'MITRE ATT&CK Enterprise',url:'https://attack.mitre.org/matrices/enterprise/',type:'Docs'},{label:'Coursera — Security Operations Center',url:'https://www.coursera.org/learn/security-operations-center-soc',type:'Course'}]
 },
 {
 month:9,name:'Proxmox Virtualization & Disaster Recovery',domain:['linux','infrastructure'],
 goal:'Plan an efficient virtualized lab and demonstrate backup/restore under resource limits.',
 requirements:['Virtualization-capable host or nested VM where supported','Sufficient RAM/SSD capacity','Lab-only workloads and backup storage'],
 stack:['Proxmox','Linux','Windows Server','Docker'],architecture:'Proxmox host → isolated VM bridges/VLANs → Windows/Linux workloads → backup target.',
 studioSlug:'virtualization',
 steps:[
 step(9,1,'Size and plan compute','CPU/RAM oversubscription, storage, bridges, virtual NICs and snapshots.','Write resource budget for Mac or alternative Proxmox host and choose safe VM sizes.','Ensure realistic RAM/disk overhead and isolate guest networks.','Hypervisor design and sizing spreadsheet.'),
 step(9,2,'Build virtual workloads','Proxmox VM storage, virtual bridges and VM lifecycle.','Deploy lawful Proxmox environment or use compatible hypervisor for concept lab.','Verify two guests boot, connect across intended bridges and report resources.','VM screenshots and network bridge map.'),
 step(9,3,'Implement backup strategy','Snapshot vs backup, RPO/RTO, guest consistency and retention.','Create backup schedule and store a test recovery point outside source VM.','Verify backup archive integrity and prepare restore test.','Backup configuration and checksum report.'),
 step(9,4,'Restore and assess','Recovery isolation, service validation and capacity limits.','Restore a disposable VM into test network, validate its services.','Measure restore time and record any consistency issues.','Restore runbook, time measurements and corrective actions.')
 ],
 acceptance:['Two isolated workloads documented','Successful backup integrity validation','Restored service functional with measured RTO'],
 deliverables:['Virtualization sizing plan','Bridge/VM topology','Backup and restore report'],
 materials:[{label:'Proxmox VE documentation',url:'https://pve.proxmox.com/pve-docs/',type:'Docs'},{label:'Proxmox backup documentation',url:'https://pbs.proxmox.com/docs/',type:'Docs'}]
 },
 {
 month:10,name:'Git, Docker & Infrastructure Automation',domain:['automation','linux'],
 goal:'Make a small infrastructure deployment reproducible and version-controlled.',
 requirements:['GitHub repository without secrets','Two disposable Linux service nodes','Docker runtime and Ansible execution environment'],
 stack:['Git','GitLab','Docker','Ansible'],architecture:'Git repo → Ansible control host → Linux service nodes + Docker application.',
 studioSlug:'infra-automation',
 steps:[
 step(10,1,'Create the source workflow','Version control, branches, README, issue tracking and secret hygiene.','Initialize repo, protected ignore patterns, topology inventory and task board.','Confirm .env and credentials are not committed; establish baseline tag.','Version-controlled project skeleton and issue plan.'),
 step(10,2,'Containerize a service','Dockerfile, image layers, volumes, Compose and networks.','Create a minimal internal service with persistent Docker volume.','Start, stop and recreate while retaining state.','Compose config and lifecycle test output.'),
 step(10,3,'Automate configuration','Inventory, SSH keys, Ansible idempotence and rollback.','Write playbook for package/service baseline across two test nodes.','Run twice; second playbook run should report no unintended changes.','Ansible stdout and idempotence results.'),
 step(10,4,'Build operational checks','Health checks, backup scheduling, pipeline hygiene and recovery.','Add lint/test script and documented recovery command.','Force one controlled service failure; monitor and recover via runbook.','Automation project README and test report.')
 ],
 acceptance:['Reproducible service startup','Idempotent automation runs','No sensitive tokens in repository'],
 deliverables:['Git repository and issue board','Docker + Ansible configuration','Automated deployment tests'],
 materials:[{label:'Ansible documentation',url:'https://docs.ansible.com/',type:'Docs'},{label:'Docker documentation',url:'https://docs.docker.com/',type:'Docs'},{label:'Coursera — Git and GitHub',url:'https://www.coursera.org/learn/getting-started-with-git-and-github',type:'Course'}]
 },
 {
 month:11,name:'Authorized Penetration Testing Lab',domain:['pentest','networking'],
 goal:'Conduct a bounded assessment against intentionally vulnerable owned test systems.',
 requirements:['Explicit lab scope and authorization','Isolated Kali/Linux test machine and intentionally vulnerable targets','Snapshot/rollback plan and evidence retention'],
 stack:['Kali Linux','Wireshark','Linux','GNS3'],architecture:'Kali assessment VM → isolated vulnerable test LAN → intentionally vulnerable services.',
 studioSlug:'security-hardening',
 steps:[
 step(11,1,'Write rules of engagement','Penetration test scope, severity, safe scanning, legal boundaries and reporting.','Define target IPs, testing hours, acceptable checks and excluded actions.','Verify test subnet isolation and snapshots; review written permissions.','Rules-of-engagement document.'),
 step(11,2,'Inventory attack surface','TCP services, versions, secure discovery and asset baselines.','Enumerate services on owned targets with low-impact tools.','Compare discovered services to known authorized inventory; no public IP scanning.','Sanitized enumeration output.'),
 step(11,3,'Validate known misconfigurations','OWASP concepts, risk evidence, authentication controls and patches.','Reproduce a deliberately configured lab issue and apply a targeted fix.','Before/after tests demonstrate misconfiguration is no longer present.','Finding template with likelihood, impact and remediation.'),
 step(11,4,'Write technical report','Executive summary, reproducibility, severity and validation process.','Produce a concise assessment report with attack-surface table and prioritized fixes.','Review report includes scope, evidence, retest and constraints.','Authorized pentest deliverable plus retest matrix.')
 ],
 acceptance:['Tests restricted to owned isolated targets','At least one lab finding documented and remediated','Report includes reproducible safe steps and retest'],
 deliverables:['Scope agreement','Assessment report','Remediation and retest evidence'],
 materials:[{label:'OWASP Web Security Testing Guide',url:'https://owasp.org/www-project-web-security-testing-guide/',type:'Docs'},{label:'Kali Linux documentation',url:'https://www.kali.org/docs/',type:'Docs'},{label:'Coursera — Ethical Hacking with Kali Linux',url:'https://www.coursera.org/learn/ethical-hacking-with-kali-linux',type:'Course'}]
 },
 {
 month:12,name:'Purple Team / Red Team & SOC Capstone',domain:['soc','redteam','pentest','networking','windows','linux'],
 goal:'Integrate GNS3, endpoints, identity, detection and a controlled adversary-emulation scenario.',
 requirements:['Previously verified lab components','Explicit authorization and isolation','GNS3 and SIEM access, tested backup and rollback paths'],
 stack:['GNS3','Wazuh','Windows Server','Kali Linux','Wireshark'],architecture:'HQ + 2 branches + remote user → Windows/Linux services + monitoring → authorized test workstation.',
 studioSlug:'enterprise-multisite',
 steps:[
 step(12,1,'Architect the end-to-end lab','Enterprise segmentation, VPN, identity, telemetry and ATT&CK mapping.','Plan HQ, branches, user VPN, Windows/Linux workloads, SIEM sensors and allowed paths.','Review scope and confirm every component has a measurable acceptance criterion.','Unified enterprise design, security matrix and test plan.'),
 step(12,2,'Integrate infrastructure','GNS3, VPN, DNS/identity services, backups and event collection.','Integrate deployed test components incrementally, snapshot each major stage.','Verify routing, DNS, authentication and agent telemetry with recorded outputs.','Deployment log, configuration references and test results.'),
 step(12,3,'Conduct safe adversary simulation','Threat-model hypotheses, detection engineering and controlled emulation.','Simulate limited lab-only authentication failures or benign ATT&CK-like activity.','Document observed SIEM events, intended signals, alert latency and failures.','Red/blue observation matrix with sanitized event samples.'),
 step(12,4,'Perform recovery and showcase','Lessons learned, operational handoff, security validation and recovery.','Revert lab to safe baseline and organize approved screenshots, configs and readme.','Rerun core connectivity and monitoring acceptance tests after rollback.','Capstone engineering report, GNS3 topology and evidence register.')
 ],
 acceptance:['HQ and branch acceptance paths pass','SOC alert and safe controlled event correlate','Recovery drill preserves documented functionality','No claim of production deployment without real proof'],
 deliverables:['Enterprise capstone project','Test and purple-team report','Incident/recovery runbooks and GitHub portfolio evidence'],
 materials:[{label:'MITRE ATT&CK Enterprise',url:'https://attack.mitre.org/',type:'Docs'},{label:'Wazuh documentation',url:'https://documentation.wazuh.com/current/',type:'Docs'},{label:'GNS3 documentation',url:'https://docs.gns3.com/',type:'Docs'}]
 }
];
export const projectPhases=projectRoadmap.flatMap(m=>m.steps);
export const projectPhaseId=(month:number,n:number)=>'p'+String(month).padStart(2,'0')+'-'+n;
