# Containerlab Runner Integration — macOS + Linux VM

**Taha Infrastructure Studio / LAB OPERATIONS**

The integrated engine executes a real reproducible Enterprise Multi-Site lab using Containerlab, Docker and FRRouting, then writes its operation history to PostgreSQL and execution artifacts to MinIO.

## Architecture

```text
MacBook • macOS                              Ubuntu Linux VM (isolated)
┌──────────────────────────────┐           ┌─────────────────────────────────────┐
│ Next.js :3000                │           │ Node.js Runner :4401 (localhost)   │
│ Studio / Lab Operations      │           │  ├─ deploy                          │
│       ↓                      │   SSH     │  ├─ inspect/status                  │
│ Next.js Labs API ────────────┼─ tunnel ─>│  ├─ verify (OSPF + ping)            │
│       ↓                      │           │  └─ destroy                         │
│ PostgreSQL :5434             │           │         ↓                           │
│ MinIO :9000                  │           │ Containerlab → Docker → FRRouting   │
└──────────────────────────────┘           └─────────────────────────────────────┘
```

All lab actions operate exclusively on the checked-in `labs/enterprise-network` topology. No custom shell commands are accepted from the UI.

## Step 1: MacBook setup

Install Docker Desktop, Git, Node.js 22 and npm.

```bash
git clone https://github.com/tahazitan/Engineeniring-Infrastructure-Studio.git
cd Engineeniring-Infrastructure-Studio
cp .env.example .env
```

Choose strong local PostgreSQL and MinIO passwords in `.env`, and set `DATABASE_URL` to match `POSTGRES_PASSWORD`. Generate a unique runner token:

```bash
openssl rand -hex 32
```

Place that exact value in `LAB_RUNNER_TOKEN` inside **Mac `.env`**, and provide the same value to the Linux VM runner below.

Start local data services:

```bash
docker compose up -d
npm install
npm test
npm run check
```

**For an existing PostgreSQL Docker volume, apply the one-time runner history migration:**

```bash
docker compose exec -T postgres psql -U studio -d studio < infra/postgres/migrations/002_lab_runs.sql
```

The migration is idempotent, and new empty PostgreSQL volumes receive the new table automatically from `infra/postgres/schema.sql`.

## Step 2: Linux VM prerequisites

Prepare an isolated Ubuntu Linux VM (start with **4 GB RAM / 2 vCPUs**, adjust after measuring CPU and RAM usage) with networking permitted for Docker/container images. Install Docker Engine, Containerlab, Node.js 22 and Git using official packages.

Clone the **same repository** within the Linux VM:

```bash
git clone https://github.com/tahazitan/Engineeniring-Infrastructure-Studio.git
cd Engineeniring-Infrastructure-Studio
node --test lab-runner/agent.test.mjs
```

Verify containerlab is installed and the VM can run the checked-in networking lab. A supported, isolated lab VM must be configured so the runner can invoke `sudo -n containerlab` **without interactive password prompts**, and the runner user can access Docker. On a dedicated VM, running the agent as root is one alternative, but configure the VM accordingly: the runner is a privileged component and must **not** listen on a public interface.

```bash
# Within the Linux repository root, with your token already set in the shell:
export LAB_RUNNER_TOKEN='<exact-same-random-token-as-mac>'
export LAB_REPO_ROOT="$PWD"
node lab-runner/agent.mjs
```

The agent listens **only on 127.0.0.1:4401 in the Linux VM**. It accepts only four explicitly mapped actions, creates bounded logs and enforces timeouts.

If Containerlab needs privileges, provision narrowly scoped `sudo -n` access for the lab VM's run account and the required Containerlab binary, or operate from a dedicated local administrative account. Keep the agent accessible only through the tunnel.

## Step 3: Open a tunnel from macOS

In a separate **Mac** terminal:

```bash
ssh -N -L 127.0.0.1:4401:127.0.0.1:4401 <linux-user>@<vm-address>
```

Replace `<linux-user>` and `<vm-address>` with your VM SSH username and reachable address. Keep this terminal open while the VM agent is running. No ports need to be opened for the runner on the VM firewall.

## Step 4: Launch Studio

In the original Mac terminal (repository root):

```bash
npm run dev
```

Open **http://127.0.0.1:3000/studio/enterprise-multisite**, then select **LAB OPERATIONS**.

You can operate the lab using:

1. **DEPLOY** — creates the checked-in Containerlab infrastructure.
2. **STATUS** — inspects Containerlab nodes.
3. **VERIFY** — executes `scripts/verify.sh`, testing OSPF neighbors, learned routes and client pings.
4. **DESTROY** — tears down the isolated lab containers.

The operation history and exit codes are recorded in `lab_runs` (PostgreSQL). When an operation completes, a JSON execution report is archived in MinIO Evidence Vault with a SHA-256 checksum and made available for download in the UI.

Test results are **observations of actual Linux VM execution**, not data generated from the browser. Engineering acceptance and the project verification state remain available in the separate TEST & VALIDATE tab.

## Operations & diagnostics

**Runner offline:** check that `ssh -L` is still connected, the agent listens locally within Linux, and Mac/VM tokens match. On Mac:

```bash
curl -H "Authorization: Bearer $(grep '^LAB_RUNNER_TOKEN=' .env | cut -d= -f2-)" http://127.0.0.1:4401/v1/health
```

**Runner returns sudo or Docker errors:** inspect Linux privileges and verify that the installation can run the allowed Containerlab commands. No untrusted arbitrary shell execution is provided.

**No evidence in MinIO:** confirm that `docker compose ps` lists PostgreSQL and MinIO, and use the Evidence Vault tab. A run's result is persisted in PostgreSQL even when object-storage registration has to be retried.

**Job stuck as running after an agent restart:** the process memory of the agent was reset; restart the agent, then review and reconcile that job before submitting a new operation.

**Existing Docker volume:** remember to apply `002_lab_runs.sql`; first-run schema scripts do not rerun automatically on existing PostgreSQL volumes.

## Scope

This runner profile operates the **Enterprise Multi-Site FRRouting / OSPF lab**. The interface and API can be extended with additional named lab profiles, each requiring a separate allowlisted action mapping. The platform's other 11 project workspaces remain available for architecture, configuration, diagnostics and evidence, independently of this runner.

Source lives in GitHub. Secrets and evidence objects stay local. No website or lab is automatically deployed to a public cloud.
