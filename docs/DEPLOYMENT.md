# Deployment Architecture

The current development workflow runs locally on macOS. Source and infrastructure definitions are maintained in GitHub. The container image definition prepares the **public portfolio** for a later container-hosting deployment.

## Public container image
```bash
docker build -t taha-infrastructure-studio:public .
```

The public container uses `STUDIO_MODE=public`; project data is fetched server-side from PostgreSQL and restricted to records explicitly visible and verified.

To run it with hosted data services, configure the runtime `DATABASE_URL` to point to the database reachable **from inside the container**. Avoid connecting a remote public container to the macOS Docker database bound to localhost.

## Future cloud topology
- HTTPS reverse proxy and public web container.
- Managed PostgreSQL with encrypted connections, backups and restricted network access.
- Private MinIO-compatible object storage for authorized internal records.
- Public case study content publication after engineer review.
- Secrets injected through hosting-provider secret management.
- Distinct staging and production build pipelines.

## Branching and builds
GitHub Actions checks source structure, TypeScript and the Next.js build on pushes and pull requests to `main`. This CI validates source builds; **network-lab acceptance tests remain separate** and are executed in the Linux lab.

## Release readiness
Before opening the portfolio to the public, verify case study permissions, redact source configurations where appropriate, back up database state, and confirm the public experience only exposes released projects.

Deployment to a live URL is intentionally a separate operational step.
