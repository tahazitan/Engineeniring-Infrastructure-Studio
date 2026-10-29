# International Remote Career: Practical Lab Evidence Plan

**Owner:** Taha Zitane  
**Primary career target:** worldwide remote employment or international contracting accessible from Morocco  
**Target roles:** IT Support Engineer, Technical Support Engineer, Junior Systems Administrator, Infrastructure / Cloud Support Associate  
**Training environment:** private Engineering Studio + authorized local virtual networks only

## Principle

The portfolio must distinguish **paid/professional experience** from **independent lab practice**. A planned project, a diagram, a generated configuration, a completed checklist and a verified lab run are different things. Only published, sanitized, reproducible observations become recruiter-facing project evidence.

The first three labs below are linked to their existing private Studio workspaces. They are priorities, **not automatically completed tasks**. Avoid publicizing the private Studio's database, infrastructure credentials, remote access, GNS3 API, or personal host information.

## Lab 01 — Windows Server AD, DNS and Group Policy incident recovery

**Role match:** Remote IT Support / Systems Administrator  
**Private workspace:** `/studio/identity-ad`  
**Minimum environment:** isolated Windows Server VM with AD DS and DNS, Windows client VM, lab-only domain and addressing.

1. Record a passing baseline: `ipconfig /all`, `nslookup`, `nltest /dsgetdc:<lab-domain>`, domain join and `gpresult /r`.
2. Snapshot VM state. Introduce a reversible misconfigured client DNS resolver.
3. Capture symptoms, error messages, timestamps and the failing command outputs.
4. Inspect resolver configuration and DNS/AD dependencies. Repair the controlled failure.
5. Repeat the exact baseline commands; verify domain resolution and appropriate policy application.
6. Produce `docs/lab01-ad-dns-incident.md` and sanitized evidence image/log references.

**Acceptance:** baseline pass, reproducible observed failure, documented root cause, restoration with repeat-pass verification, recovery notes.  
**Security:** use lab-only identities and domains. Never publish organization details or credentials.

## Lab 02 — Linux remote access and service recovery

**Role match:** Technical Support Engineer / Linux Operations  
**Private workspace:** `/studio/linux-platform`  
**Minimum environment:** isolated Debian/Ubuntu VM, admin workstation, a test service.

1. Establish SSH key authentication and document least-privilege access.
2. Capture a healthy service baseline: `systemctl status`, `ss -ltnp` and loopback/client request.
3. Introduce a reversible service or configuration fault in the VM.
4. Diagnose through `journalctl -u <service>`, `systemctl`, network and firewall checks.
5. Restore service and verify externally from the authorized lab client.
6. Record cause, actions, observable checks, and a short handover note.

**Acceptance:** working SSH, reproducible fault, root cause from observed logs, service and connectivity restored, sanitized evidence.

## Lab 03 — Monitoring, alert triage and recovery

**Role match:** Infrastructure / Cloud Support  
**Private workspace:** `/studio/observability`  
**Minimum environment:** Zabbix instance with monitored lab Linux host via agent or SNMP.

1. Establish host visibility and baseline health metrics.
2. Create an alert condition for a controlled service/host event.
3. Trigger the condition intentionally in the isolated lab and record timestamps.
4. Identify the observed root cause using system logs, network and Zabbix data.
5. Restore the service and verify the alert clears.
6. Document incident timeline, thresholds, evidence and operational action.

**Acceptance:** actual collected metrics, actual triggered alert, chronological log evidence, demonstrable recovery and alert closure.

## Evidence template for every public project

| Field | Required material |
| --- | --- |
| Identity | Project title, lab type, personal role, dates |
| Business-style scenario | User impact, system dependency, expected outcome |
| Architecture | Real test setup (sanitized versions/IPs), diagram sourced from build |
| Implementation | Commands, configuration excerpts, dependencies |
| Troubleshooting | Symptom, hypothesis, diagnostic data, root cause |
| Validation | Before/after output, positive and negative tests |
| Outcome | Observed result and remaining constraints |
| Reproducibility | Setup/runbook, rollback/cleanup instructions |

### Publishing gate

Publish to the public [portfolio repository](https://github.com/tahazitan/taha-zitane-portfolio) only when:
- A lab has been personally executed.
- Evidence traces match the claimed result.
- Screenshots and logs are sanitized.
- All external resources are genuine and linked.
- Results are labeled **Independent Lab / Practical Exercise**, not employment or client delivery.

### Suggested weekly rhythm (3–5 hours)

- **Week 1:** AD DS/DNS baseline + client setup.
- **Week 2:** DNS failure injection, troubleshooting, repeatable validation.
- **Week 3:** Linux access + service diagnosis and recovery.
- **Week 4:** Zabbix host checks, alert and recovery; package public evidence.

Then continue with networking (VLANs and routing), VPN, Windows support scenarios and basic automation according to the role requirements and the existing project roadmap.

## Interview connection

For each lab, rehearse a 90-second explanation: problem → environment → actions → evidence → result. Prepare 2–3 follow-up technical questions. Pair this with applications to international remote positions that explicitly accept contractors or employees based in Morocco.

**Status of this document:** instructional plan only; implementation and test evidence have not been established by writing this document.
