import Link from "next/link";
import {ArrowUpRight,BriefcaseBusiness,Network,Server,Activity,ClipboardCheck,ExternalLink} from "lucide-react";

const priorityLabs=[
 {slug:"identity-ad",number:"01",icon:Server,role:"Remote Systems Administrator / IT Support",title:"Active Directory + DNS/DHCP incident recovery",scenario:"Join a domain client, simulate a controlled DNS failure, diagnose resolution and Group Policy, restore services and record the evidence.",tests:["Domain join and nslookup baseline","Observed failure and diagnostic commands","Restored name resolution and gpresult report"],evidence:"Sanitized event logs, command outputs, change notes"},
 {slug:"linux-platform",number:"02",icon:Network,role:"Technical Support Engineer / Linux Operations",title:"Linux service and remote-access troubleshooting",scenario:"Set up a lab Linux service with SSH key access, introduce a controlled service failure, recover systemd service health and document the incident.",tests:["SSH authentication and least privilege","systemctl status and journalctl evidence","Service recovery, port reachability, handover"],evidence:"Sanitized logs, recovery steps and service checks"},
 {slug:"observability",number:"03",icon:Activity,role:"Infrastructure / Cloud Support",title:"Zabbix alert triage and verification",scenario:"Monitor an isolated host, trigger a controlled availability alert, investigate the cause and demonstrate a confirmed return to normal.",tests:["Metrics and host status recorded","A reproducible alert with timestamp","Recovery evidence and short incident report"],evidence:"Monitoring screenshots and a redacted incident timeline"}
] as const;

export default function RemoteCareerLabs(){
 return <section className="remote-lab-focus" aria-labelledby="remote-lab-focus-heading">
  <header className="remote-lab-head"><div><span><BriefcaseBusiness size={16} aria-hidden="true"/> INTERNATIONAL REMOTE CAREER / PRIORITY WORK</span><h2 id="remote-lab-focus-heading">Build skills that a technical interviewer can verify.</h2><p>Three job-aligned practice tracks, mapped to existing private Studio workspaces. Each lab begins as a plan and gains credibility through real configurations, observed tests and sanitized evidence.</p></div><Link href="/studio/projects-roadmap">Full practical roadmap <ArrowUpRight size={16}/></Link></header>
  <div className="remote-lab-grid">{priorityLabs.map(lab=>{const Icon=lab.icon;return <article className="remote-lab-card" key={lab.slug}>
   <div className="remote-lab-card-top"><span>{lab.number} / PRIORITY LAB</span><Icon size={21} aria-hidden="true"/></div>
   <div className="remote-lab-role">{lab.role}</div><h3>{lab.title}</h3><p>{lab.scenario}</p>
   <h4><ClipboardCheck size={16}/> ACCEPTANCE TESTS</h4><ul>{lab.tests.map(test=><li key={test}>{test}</li>)}</ul>
   <div className="remote-lab-evidence"><strong>PORTFOLIO EVIDENCE</strong><span>{lab.evidence}</span></div>
   <Link href={"/studio/"+lab.slug}>Open private workspace <ArrowUpRight size={16}/></Link>
  </article>})}</div>
  <footer className="remote-lab-foot"><span>Evidence progression: PLANNED → CONFIGURED → TESTED → DOCUMENTED. Status changes reflect saved progress; each result requires an actual lab run.</span><a href="https://github.com/tahazitan/enterprise-network-lab" target="_blank" rel="noopener noreferrer">Public evidence repository <ExternalLink size={15}/></a></footer>
 </section>
}
