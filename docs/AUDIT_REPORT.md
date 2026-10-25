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
