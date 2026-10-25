# Infrastructure Studio — Technical Audit Report

## Scope

Repository: `tahazitan/Engineeniring-Infrastructure-Studio` (main)
Environment: local Intel macOS with Node.js 22, Next.js 15, Express.js, Docker Desktop, PostgreSQL, S3-compatible RustFS and GNS3 Server 2.2.61.

This report distinguishes verified application capabilities from optional lab infrastructure that has not been deployed.

## Findings and remediations

| Finding | Risk / impact | Resolution |
|---|---|---|
| Referenced MinIO Docker image unavailable | Evidence uploads not usable | Use a digest-pinned RustFS S3-compatible container, backed by the existing named volume; switch JavaScript client to the maintained AWS S3 SDK |
| Save and evidence endpoints rejected local-origin requests with Express | Essential POST/PUT operations failed | Permit explicit localhost/127.0.0.1 equivalence only in private mode, with the same HTTP protocol and port |
| Outdated transitive packages | npm flagged DOMPurify, PostCSS, Zod and MinIO dependencies | Upgrade Zod; patch DOMPurify and PostCSS; remove vulnerable legacy MinIO SDK dependencies |
| Requested Express framework not used | Next.js standalone development runner only | Add the loopback-only Express custom server and health endpoint, preserving all Next.js routes |
| GNS3 connectivity absent from UI | Could not import existing GNS3 projects | Add authenticated read-only local GNS3 v2 integration and support offline `.gns3` import |
| GNS3 metadata not persisted | Device roles and interface labels lost after Save | Extend Zod schema and topology serialization; verify with API round-trip |
| Unclear service availability | Users cannot distinguish live services from blueprints | Add live PostgreSQL, object storage and GNS3 status cards with Refresh |
| Disconnected visual identity / missing platform logos | Weak project navigation and engineering presentation | Rebuild responsive design with user-provided visual direction; use the supplied template design, a user-controlled portrait, local technology SVGs, animated conceptual topologies |
| No reproducible full-stack local test | Regression risk | Add `npm run audit:local` with temporary project/evidence fixtures and cleanup |

## Verified checks

- `npm run check` — TypeScript validation passed.
- `npm test` — static structure and three runner unit tests passed.
- `npm run build` — production bundle verified on local Mac.
- `npm audit --audit-level=high` — zero reported vulnerabilities after remediation.
- `npm run audit:local` — Express, DB, storage, GNS3, topology metadata, CSRF origin guard, project save/read, evidence upload/download/checksum and local assets passed; temporary data was cleaned.
- Browser screenshot capture of the landing page and engineering workbench completed.

## Expected limitations

- **Real Containerlab lab execution remains unavailable until an isolated Linux VM/host and SSH-tunneled restricted runner are configured.** GNS3 Server is a different execution engine.
- GNS3 REST connectivity is verified, but no GNS3 project was listed during the audit. Import via `.gns3` works without a running project.
- Imported GNS3 diagrams are snapshots. Editing and saving in Studio does not push changes back into GNS3.
- The application intentionally binds to `127.0.0.1`; it is a private development system, not a publicly authenticated hosting service.
- Tests verify API operations and screenshots, but not all possible interactive user journeys in every browser.

## Re-run

```bash
cd ~/Engineeniring-Infrastructure-Studio
docker compose up -d
npm run dev
# In another terminal
npm run doctor
npm run check
npm test
npm run audit:local
npm audit --audit-level=high
```

Keep `.env`, real configurations, any client data and private evidence out of the repository. Never publish Docker volumes or expose GNS3's local authenticated API directly.

## Template-first iteration (October 2026)

Replaced the earlier Three.js and GSAP presentation with a semantic React/CSS recreation of the original user-supplied purple cyber landing page. Added the locally supplied portrait (`TAHAGITHUB.png` resized to WebP), a conceptual animated network overlay and an interactive topology selector populated from existing project models. Removed the obsolete hero-scene component and its Three.js dependencies. No AI image generation was used. Animated topology paths are illustrative and do not represent live packets.

## Real-world engineering topology revision

Replaced four-node stock placeholders across twelve project profiles with richer **reference network architectures** containing 8–9 vendor/platform-aware nodes, private sample IP subnets, security zones, VLAN IDs and meaningful interface/link labels. The implementation adds SVG vendor marks for supported local sources, with neutral role iconography when a verified logo is unavailable. The architecture workbench exposes editable node properties and preserves metadata in JSON exports and PostgreSQL round-trips. Untouched old diagrams are enhanced in memory on reads; any custom topology and saved project work remain authoritative. All sample networks are unverified designs, not live deployment claims.

Use `node scripts/browser-smoke.mjs` for an interactive Chromium CDP test on the user’s authorized Mac; this checks all 12 pages and explorer switching. Note that lazy-loaded images that have not been scrolled into view should not be reported as missing.


## Business-services restructuring — local audit, October 2026

The marketing experience was rebuilt as **Taha IT Solutions** with five client-oriented routes: Home, Services, Projects, About and Contact, while retaining the original purple/navy template direction. Obsolete decorative portfolio topology components and their CSS were deleted. The personal hero portrait was replaced with the newly uploaded green-polo photo whose SHA-256 was matched with the existing original on the Mac; the WebP copy is 960×1280.

### Client-facing UX & ethical marketing

- Six concrete service offerings include scope, typical deliverables and relevant tools.
- The About page contains user-reported experience and studies, explicitly identifying the unfinished EMSI year.
- Projects remain design examples rather than fictional completed client contracts.
- The contact brief is assembled client-side and copied to clipboard. It does not pretend to submit data to a server; real contact channels are Fiverr and LinkedIn.
- No fabricated pricing, testimonies, business registration, awards or customer counts.

### SEO / privacy controls

- Unique page titles/descriptions, semantic headings, local image alt text, Page metadata and Person/ProfessionalService JSON-LD are present.
- Private Studio requests are not indexed. The robots/sitemap respect public/private mode and rely on a verified deployment origin for public absolute URLs.
- Mobile/desktop navigation and client-request path are tested in a real browser; fallback fonts and reduced-motion behavior remain available.

### Local direct GNS3 execution evidence

The GNS3 REST API provides native create/open-project, add builtin/template-device, link-interface and update-node operations. These operations require private mode, same-origin validation and strict input schemas.

An actual native lab called `Taha IT Solutions - Client Network Starter Lab` was created through the Studio API, with one Ethernet Switch and two VPCS nodes connected by two links. Earlier emulator discovery failed until the local GNS3 server was relaunched with the bundled emulator tools on PATH. This was then tested successfully. No virtual appliance was started automatically and no configuration command executed on a device.

### Reproducible checks

- `npm run check`: TypeScript, successful
- `npm test`: project/test structure and lab-runner tests, successful
- `npm run audit:local`: Express, project persistence, evidence uploads, SHA-256, GNS3 native projects/templates, origin rejection and malformed action rejection, successful
- `node scripts/browser-smoke.mjs`: all marketing and engineering routes, local GNS3 Builder and interactive contact UI (with authenticated local CDP browser), verified
- `npm audit --audit-level=high`: no reported vulnerabilities
- A full production Next.js build is checked before merging.

**Known limits:** public hosted deployment was not changed here. The optional Linux VM Containerlab runner remains separate from GNS3. Vendor-specific GNS3 console configuration application is not automatic; configuration notes can be downloaded for manual controlled application. A public production URL and a verified Upwork profile URL were not supplied, so none were invented.


## Template + localization + Studio working-tools revision

**Supersedes earlier synthetic-topology notes above.** Removed the artificial 8–9-node reference generator, the generated topology preview component and the public demo .gns3 file. Unmodified old four-node starter sketches are hidden only at read time; custom stored network diagrams remain untouched. The public Projects page no longer publishes topology diagrams. The GNS3-native starter lab (three actual native nodes, two links) remains preserved.

Implemented real EN/FR/AR language routes, local language switching, Arabic RTL interface, local vendor brand SVG motion (respects reduced motion), client service rows and translated contact forms. A dynamic studio dashboard summarizes saved checklist status; training/roadmap uses actual project objectives, checklist and acceptance tests, requiring explicit Save.

The installed Wondershare EdrawMax can export PNG/JPG/SVG files to the Studio's **Design References** tab; original user-provided Illustrator/EPS/JPG template is stored under gitignored local .studio-assets and served only via a loopback/private-mode, whitelisted API. Exported raster designs can be archived with the existing SHA-256 evidence process. **No undocumented EdrawMax API integration is claimed.**

Public marketing deployment and search-engine indexing were not performed; NEXT_PUBLIC_SITE_URL must be configured for verified production URLs. No client testimonials, legal company size, rates or live deployment claims were invented.


## Professional brand and engineering learning extension

- Reworked marketing education and experience language in EN, FR and MSA Arabic to present professional expertise rather than an interview-defense narrative. The first engineering-study year remains labelled accurately; no engineering degree is invented.
- Added animated large vendor marks and neutral technical icon fallbacks with desktop/mobile CSS and reduced-motion support. SVGs are sourced from the existing asset library and the locally cached Simple Icons v16.35.0 npm package.
- Added the personal **12-month / 52-week roadmap** at `/studio/roadmap` with ten technical study tracks and Coursera course references, month/week filters, lab deliverables, checkpoints and self-entered notes.
- Added independently categorized industry-credential goals including CCNA, CCNP Enterprise/Security, CCIE, RHCSA/RHCE, Fortinet and Palo Alto security tracks, Microsoft Azure, AWS, CKA/CKS, OSCP/OSEP, GIAC and CISSP. Official issuer links explain variable exam fees, experiences and eligibility; completion is never assumed.
- Persisted self-reported learning and certification progress using `engineering_roadmap_progress` in PostgreSQL, with a strict private origin-checked API. The temporary automated save/read/delete test verifies persistence without leaving the user's data changed.
- No live web crawl or latest certification-exam version verification was possible during this local implementation. Always confirm current issuer requirements before registration.

## Independent project delivery roadmap — October 2026

The private `/studio/projects-roadmap` contains twelve planned monthly project tracks (48 learn/build/test/deliver stages), separated from `/studio/roadmap` (52-week study and industry certification goals). It covers IT Support + GLPI, Windows Server/AD, Cisco switching, multi-site OSPF, Linux administration, firewall/IPsec, Zabbix, Wazuh SIEM, Proxmox/recovery, Git/Docker/Ansible, isolated authorized pentesting and a purple-team capstone.

Each project has prerequisites, equipment/architecture, technology labels, at least two official documentation or learning links, acceptance criteria, deliverables and a corresponding Studio workspace link. Stage progress is stored under `project_step:<id>` in the existing PostgreSQL roadmap-progress table and is strictly checked against 48 known IDs. The isolated test writes one temporary progress record, reads it and deletes it; it does not change existing user progress. GNS3 topology/runtime state and client evidence are not modified by roadmap updates. This is a project **plan**, not proof of completed labs.

The marketing hero is implemented from the supplied purple/navy template direction, using the existing user-supplied real portrait and CSS-only brand/portrait entrance effects. The home label now reads *Service Platform Ecosystem* (localized), without a generic Technologies heading. The user-provided screenshot artwork is not represented as newly generated image content.

Verification commands: `npm run check`, `npm test`, `npm run audit:local`, `node --experimental-strip-types --env-file=.env scripts/projects-roadmap-audit.mts`, and `node scripts/browser-smoke.mjs` with the authorized Chromium CDP debugging profile. An isolated production build was performed using `STUDIO_NEXT_DIST_DIR=.next-project-roadmap-check`; that cache directory is gitignored.
