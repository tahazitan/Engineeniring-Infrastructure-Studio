# Local Development — macOS

## Requirements
- macOS with **Node.js 22**, npm and Git
- Docker Desktop for macOS (PostgreSQL and MinIO data services)
- A modern desktop browser with WebGL enabled
- For real Containerlab network environments: an isolated Linux machine or Linux virtual machine with Docker Engine

## Setup
```bash
git clone https://github.com/tahazitan/Engineeniring-Infrastructure-Studio.git
cd Engineeniring-Infrastructure-Studio
cp .env.example .env
```

Edit `.env` locally. Choose unique strong development passwords and keep `DATABASE_URL` consistent with `POSTGRES_PASSWORD`.
This single `.env` file is read by both **Docker Compose** and **Next.js**. It is excluded from Git.

```bash
docker compose up -d
npm install
npm test
npm run check
npm run dev
```

Open **http://127.0.0.1:3000**. Navigate to **/studio** for the engineering workspace.
The MinIO administrative console is accessible locally at **http://127.0.0.1:9001**.
The PostgreSQL service listens on **127.0.0.1:5434**.

### Daily development
```bash
docker compose up -d
npm run dev
```

Stop the web server with Ctrl+C and use `docker compose down` to stop data services.
Named Docker volumes preserve your work across container restarts.

### Verify persistence
1. Open an engineering project, modify its topology or config, and press **Save project**.
2. Reload the page and confirm the saved state is preserved.
3. Upload a test command log in Evidence Vault. Confirm the filename and SHA-256 digest appear.
4. Export the project JSON as an additional local archive.

### Execute Linux network labs from the Studio

The complete [SSH tunnel + Linux Runner integration guide](LAB_RUNNER_SETUP.md) covers one-command operations, lab result history and automatic evidence archiving.

### Real networking labs
The provided Containerlab/FRRouting lab lives at [labs/enterprise-network](../labs/enterprise-network). Use an **isolated Linux environment** for the network container lifecycle. On an Intel Mac, a light Linux VM is appropriate for the base lab; avoid running many heavyweight security and Windows lab VMs simultaneously.

```bash
# Run inside Linux, from the cloned repository root:
cd labs/enterprise-network
sudo containerlab deploy -t topology.clab.yml
bash scripts/verify.sh
sudo containerlab destroy -t topology.clab.yml --cleanup
```

Read the included implementation guide before running a failure demonstration. Diagnose mismatched OSPF sessions using the troubleshooting guide. Verify test results in the Linux lab before recording them in the Studio.

## Modes
- `STUDIO_MODE=private`: local workbench and internal projects.
- `STUDIO_MODE=public`: portfolio pages with projects explicitly marked public and verified.

The platform does not publish itself by changing this setting; hosting requires a separate deployment process.

## Troubleshooting
- **Database offline**: run `docker compose ps`, check `DATABASE_URL` and `docker compose logs postgres`.
- **Evidence service unavailable**: check `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `docker compose logs minio`, and keep the MinIO endpoint local.
- **No WebGL**: ensure hardware acceleration is enabled in the browser.
- **Network lab fails**: run Containerlab in Linux and consult `labs/enterprise-network/docs/troubleshooting.md`.

## Repository hygiene
Commit source code, lab templates, project specs and reusable tests. Keep `.env`, real credentials, customer data and private evidence in locally controlled storage.
