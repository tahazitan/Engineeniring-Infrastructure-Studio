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
