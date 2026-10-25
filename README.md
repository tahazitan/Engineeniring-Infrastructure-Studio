# Taha IT Solutions

**Business-facing IT services website and private Infrastructure Engineering Studio.**

The public experience positions Taha Zitane's independent remote IT services for clients in Morocco, Francophone markets and international freelance projects. It follows the purple/navy visual template supplied by the owner, with the owner's actual portrait and locally hosted brand SVGs. It does not fabricate customer testimonials, certifications, business scale or verified deployments.

## Business pages

| Route | Purpose |
|---|---|
| `/` | Branded client-oriented homepage, service overview, process and primary CTAs |
| `/services` | Six detailed service offers, scope and typical deliverables |
| `/about` | Realistic professional experience, technical education and lead profile |
| `/projects` | Public technical practice areas without made-up client topologies |
| `/contact` | Local client brief builder plus Fiverr and LinkedIn contacts |

**Client services:** remote troubleshooting, LAN/VPN/network configuration, Windows Server/Active Directory, Linux/VPS/Docker, monitoring and infrastructure security reviews. Fiverr: [zitane_taha](https://www.fiverr.com/zitane_taha). [LinkedIn](https://www.linkedin.com/in/taha-zitane/fr).

The contact brief is composed in the visitor's browser; the website neither receives nor stores contact data from that form. Clients send it through their chosen external channel. An Upwork profile URL is not published because it has not been verified.

## Private Infrastructure Studio

The engineering workspace at `/studio` operates separately from the business site in `STUDIO_MODE=private`:

- **Roadmap & Training:** progress and learning exercises based on saved checklist and test-plan data, not fictional milestones
- **Wondershare EdrawMax:** privately stored original AI/EPS/JPG template, view/download in the Studio only; import exported PNG/JPG/SVG diagrams and optionally archive raster references as evidence
- **Multilingual client pages:** English at `/`, French at `/fr`, professional Modern Standard Arabic at `/ar`, with translated service/contact/about pages and localized sitemap alternates.

- React Flow device topology, with vendor SVG, VLAN, IP, zone and interface metadata
- Direct GNS3 2.2 REST connection to the local server at `127.0.0.1:3080`
- Native GNS3 project creation, project reopening, device creation (installed templates or built-ins), link creation and import to Studio
- Monaco configuration editor and downloadable configuration notes, without silently applying commands to devices
- PostgreSQL project persistence and verification records
- S3-compatible evidence storage with SHA-256 file checksums
- Optional isolated Linux VM Containerlab runner, only for supported lab profiles after separate runner setup

**Confirmed native GNS3 project:** `Taha IT Solutions - Client Network Starter Lab` contains one Ethernet switch and two VPCS endpoints joined by two links. Nodes are not started automatically. The remaining twelve project workspaces contain planning, checklists, tests and configurations; synthetic auto-generated diagrams were disabled until a real network is imported or designed.

GNS3 integration is a controlled local tool, not a public remote control API. POST operations are private-mode only, origin-checked, strictly parsed, and directed to loopback. Credentials stay in the local GNS3 configuration and are not exposed to clients.

## Quick start on Mac

```bash
cd ~/Engineeniring-Infrastructure-Studio
npm run start:local
```

Open <http://127.0.0.1:3000> and the <http://127.0.0.1:3000/studio> local workbench.

```bash
npm run check
npm test
npm run audit:local
npm audit --audit-level=high
```

Optional browser smoke test: use an isolated authorized Chrome/Brave CDP debugging profile on port 9339, then run `node scripts/browser-smoke.mjs`.

## Architecture

Next.js 15, React 19, TypeScript, Node.js, Express.js, React Flow, Monaco, PostgreSQL and RustFS S3-compatible object storage. GNS3 native projects live in the user's own GNS3 project directory; the React Flow editor holds an independently saved snapshot.

SEO uses per-page metadata (including localized FR/AR metadata), descriptive service content, schema.org Person / ProfessionalService data, robots rules and a localized sitemap. Set `NEXT_PUBLIC_SITE_URL` to the verified deployment origin for absolute URLs. The local private Studio is **not indexed**. A public deployment requires an independent supported hosting configuration and must not expose private APIs or source credentials.

## Documentation

- [Local Mac setup](docs/LOCAL_SETUP.md)
- [GNS3 integration](docs/GNS3_INTEGRATION.md)
- [Technical audit](docs/AUDIT_REPORT.md)
- [Brand system](docs/BRAND_SYSTEM.md)
- [Lab runner setup](docs/LAB_RUNNER_SETUP.md)
- [Platform architecture](docs/PLATFORM_ARCHITECTURE.md)

Copyright / professional presentation: Taha Zitane. Brand logos remain the property of their respective owners. The business presentation is an independent service brand, not a statement about legal incorporation.

### Private user design files

The supplied template sources are copied to `.studio-assets/template.ai`, `template.eps` and `template-reference.jpg` on the Mac. **This directory is gitignored and never uploaded to public web hosting or GitHub.** The private local API serves these only to the Studio, and the owner can continue editing the originals in compatible desktop software. Wondershare EdrawMax is installed, but a native EdrawMax programmatic API has not been verified. Its browser workflow uses standard exported image files.


## Personal 12-month engineering roadmap and advanced credentials

The **private** `/studio/roadmap` provides a 52-week learning program (3–5 hours/week) with 10 skill tracks: IT foundations, remote IT Support, enterprise networking/CCNA, Windows Server/AD, Linux, Docker/Git/automation, firewalls/VPN/monitoring, SOC/SIEM, ethical pentesting and controlled red-team simulation.

Every month contains weekly tasks, a tangible lab deliverable, explicit acceptance tests and Coursera references. Users can filter by specialization, enter observed lab notes, and change their status. The separate **Advanced Industry Credentials** section includes Cisco CCNP/CCIE paths, RHCSA/RHCE, Microsoft, AWS, Fortinet, Palo Alto, Kubernetes, OffSec, GIAC and selected other issuer credentials. Status and notes persist in the `engineering_roadmap_progress` PostgreSQL table. Progress is **self-reported**; it does not imply a credential was awarded, training completed or a lab verified. Advanced targets generally span multiple years.

The user has Coursera Premium; access to specific courses, specializations and certificates must still be verified within the user's Coursera account. Third-party vendor exam costs and eligibility are not included in Coursera Premium by default. The roadmap provides the course links and the issuing body's portal rather than fabricating eligibility or pricing.

The roadmap API is private: `GET/PATCH /api/studio/roadmap` with a strict typed allowed-ID/status list, Same-Origin update validation, PostgreSQL persistence, and no public exposure. Run `node --env-file=.env scripts/roadmap-audit.mjs` to test API status and a temporary progress roundtrip that cleans itself up.

## Responsive animated brand assets

Technology cards across public services, marketing hero, Studio project lists and training tracks use real locally hosted SVGs. An offline cached **Simple Icons v16.35.0** release supplies original shapes for AnyDesk, Kali Linux, WireGuard, Prometheus, GitLab, Elastic, RustDesk, RustFS, VMware and VirtualBox; the existing Cisco/Fortinet/Palo Alto/GNS3/Proxmox/etc marks are retained. Logo cards render at 43–80px+ depending on placement, and use CSS 3D movement/hover depth (no AI-generated logo images). Vendor names lacking an appropriate authentic local logo use clearly neutral, open-source Lucide pictograms and labels — never a counterfeit trademark. Reduced-motion preferences disable animations.

## Twelve-month practical project delivery roadmap

The **private** page at `/studio/projects-roadmap` contains **12 monthly infrastructure training projects with 48 independently tracked stages**. This is separate from the existing 52-week course/certification study plan. Projects cover IT Support and GLPI, Windows Server/Active Directory, Cisco VLAN switching, resilient routed WANs, Linux, firewall/IPsec, Zabbix, Wazuh, Proxmox backup/recovery, Docker/Ansible, authorized pentesting, and a controlled SOC/red/purple team capstone.

Every project contains prerequisites, an architecture description, technology stack (real vendor marks where available), four detailed Learn/Build/Test/Deliver exercises, official reference links, acceptance criteria, and concrete deliverables. Specialization filters expose projects per professional track, and links open existing private Studio project workspaces for GNS3, configuration, verification and evidence. The Stage status and user-written notes are saved in PostgreSQL under `project_step:p01-1` etc. No project is automatically marked complete and the plan never executes configurations.

Test: `node --experimental-strip-types --env-file=.env scripts/projects-roadmap-audit.mts`. The automated audit safely writes and deletes a temporary isolated progress record and skips it if user data already exists.
