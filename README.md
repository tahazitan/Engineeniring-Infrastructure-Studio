<div align="center">

# TAHA INFRASTRUCTURE STUDIO
### DESIGN. DEPLOY. VERIFY.

**Network Infrastructure · Systems Engineering · Cybersecurity**

*A template-led engineering studio by Taha Zitane.*

[Engineering Studio](#engineering-studio) · [Projects](#project-universe) · [Architecture](#platform-architecture) · [Get Started](#local-development)

</div>

---

## Engineering in Motion

**Taha Infrastructure Studio** is a unified digital environment for infrastructure architecture, network operations, systems administration, and cybersecurity engineering.

Its design brings together **the user-supplied cyber landing-page visual template**, **live technical workspaces**, **reproducible infrastructure projects**, and **structured engineering documentation**—connecting technical vision with hands-on execution.

The platform is designed to evolve into a signature engineering portfolio, where rich visual storytelling meets practical network and systems expertise.

## Areas of Expertise

| Domain | Engineering focus |
|:--|:--|
| **Enterprise Networking** | Switching, routing, VLANs, OSPF/BGP, VPN connectivity, network segmentation and troubleshooting |
| **Systems & Platforms** | Windows Server, Active Directory, Linux, DNS, DHCP, virtualization and infrastructure automation |
| **Cybersecurity** | Next-generation firewalls, segmentation policies, security hardening, detection engineering and incident analysis |
| **Monitoring & Observability** | Zabbix, Wazuh, metrics, alerting, telemetry, logs and service visibility |
| **Infrastructure Operations** | Repeatable deployments, technical diagnostics, acceptance tests, recovery workflows and engineering reports |

## Engineering Studio

An integrated workspace built around the infrastructure lifecycle:

**ARCHITECT → CONFIGURE → DEPLOY → DIAGNOSE → VERIFY → DOCUMENT**

- **Architecture & Topology Studio:** vendor-aware React Flow nodes, professional network diagrams and authenticated GNS3 import.
- **Configuration Workbench:** configuration assets and structured project specifications.
- **Lab Operations:** Docker, Containerlab and dedicated engineering-lab workflows.
- **Verification Center:** documented test plans, diagnostic results and acceptance criteria.
- **Evidence Library:** screenshots, outputs, technical notes and implementation records.
- **Portfolio Experience:** animated HTML/CSS layout based on the original user-supplied template, a local personal portrait, context-aware technology logos and a project-switching topology explorer.

## Project Universe

A growing engineering collection organized by networking, infrastructure, security and operations:

- Enterprise Multi-Site Network Architecture
- Dynamic Routing & WAN Connectivity
- VLAN Segmentation & Network Security
- Site-to-Site VPN & Firewall Engineering
- Windows Server & Identity Infrastructure
- Linux Systems Administration
- Virtualization & Infrastructure Services
- Monitoring & Telemetry Engineering
- SIEM & Security Operations
- Backup, Recovery & Operational Resilience
- Infrastructure Automation
- Integrated Enterprise Engineering

Every project is organized around **architecture, technical specifications, configurations, verification criteria and supporting documentation**.

## Platform Architecture

| Layer | Technology |
|:--|:--|
| **Experience** | Next.js · React · TypeScript |
| **Visual template / Motion** | Poppins · Press Start 2P · CSS transitions · native SVG network animations |
| **Network Diagrams** | React Flow |
| **Configuration Editing** | Monaco Editor |
| **API & Runtime** | Node.js · Express.js · Next.js
| **Application Data** | PostgreSQL |
| **Engineering Artifacts** | RustFS S3-compatible object storage |
| **Infrastructure Labs** | Docker · Containerlab · Linux |
| **Development Workflow** | Git · GitHub · documented deployment processes |

### Design Direction

The visual language is adapted from the **user-supplied cyber landing page template**: purple outer frame, navy hero, pixel typography, cropped personal portrait, cyan details and topology-driven engineering components.

The engineering environment and the portfolio share a consistent brand identity: one platform for building and presenting technical work.

## Local Development

[Complete macOS setup guide](docs/LOCAL_SETUP.md) · [Brand system](docs/BRAND_SYSTEM.md) · [Containerlab enterprise network](labs/enterprise-network)

The application is designed to run from a local development environment on macOS, with networking labs executed through Linux where required. On the configured Mac, run `npm run start:local` to start Docker services and the local GNS3 server (if installed), then launch the Express + Next.js web application.

```bash
git clone https://github.com/tahazitan/Engineeniring-Infrastructure-Studio.git
cd Engineeniring-Infrastructure-Studio
cp .env.example .env
# Configure your local credentials and database URL in .env
docker compose up -d
npm install
npm test
npm run check
npm run dev
# After starting the local server: npm run audit:local
```

Visit `http://127.0.0.1:3000`.

**Environment:** configure local connection details in `.env`. Project source, configuration templates and deployment instructions live in version control; personal credentials are maintained in your own local environment.

## Integrated Lab Operations

The **Enterprise Multi-Site** workbench includes an operational Containerlab runner for isolated Linux labs. From the **LAB OPERATIONS** tab, you can deploy the FRRouting topology, inspect node status, verify OSPF routes and reachability, and destroy the lab. Each operation is journaled in PostgreSQL and its completed result archived in S3-compatible storage with a SHA-256 digest.

[Set up the Linux VM runner & SSH tunnel](docs/LAB_RUNNER_SETUP.md). Once local Docker services, the Linux agent and SSH tunnel are active, run `npm run doctor` on macOS to check connectivity. `npm test` also exercises the Lab Runner unit tests in CI.

The 12 project workspaces provide a common architecture/configuration/verification/evidence workflow; live Containerlab execution is currently implemented for the Enterprise Multi-Site profile.

## Engineering Documentation

- [Local macOS setup](docs/LOCAL_SETUP.md)
- [GNS3 architecture import integration](docs/GNS3_INTEGRATION.md)
- [Integration and security audit](docs/AUDIT_REPORT.md)
- [Platform architecture](docs/PLATFORM_ARCHITECTURE.md)
- [Live Containerlab Runner and SSH tunnel](docs/LAB_RUNNER_SETUP.md)
- [Deployment architecture](docs/DEPLOYMENT.md)
- [Brand identity](docs/BRAND_SYSTEM.md)
- [FRRouting / OSPF lab](labs/enterprise-network)

## Integrated design and runtime

The site uses a custom coded visual system informed by the supplied cyber-style landing page reference: violet framing, midnight blue, geometric circuit detail, cyan accents and Press Start 2P headings. Official technology SVGs are served locally from `public/tech/`, with a resized portrait asset already present on the owner’s MacBook and CSS/SVG animations for network links. The original unrelated stock-photo crop and Three.js scene were removed; no AI-generated artwork was added.

For the full local stack, the Next.js application runs behind a loopback-only **Express.js** Node server; PostgreSQL holds project state, and **RustFS** provides S3-compatible object storage. GNS3 project topologies can be imported via the authenticated local GNS3 v2 API or `.gns3` file. The runtime status cards in `/studio` report actual integration health.

Run `npm run audit:local` to exercise HTTP routes, project persistence, cross-origin write protection, GNS3 metadata persistence, Evidence Vault upload/download and automatic test cleanup. The Linux VM lab runner remains a separate optional execution component and does not start simply by opening a diagram.

## Author

**Taha Zitane**  
*Infrastructure & Network Engineering · Cybersecurity Orientation*

[LinkedIn](https://www.linkedin.com/in/taha-zitane/fr) · [GitHub](https://github.com/tahazitan)

---

<div align="center">

### BUILT TO ENGINEER. BUILT FROM YOUR TEMPLATE.
**TAHA INFRASTRUCTURE STUDIO**

</div>

### Reference network diagrams and vendor assets

The 12 project blueprints now include **8–9 example devices** each, including infrastructure zones, RFC1918 sample addressing, VLAN IDs, technology/platform names and connection interfaces. The topology explorer uses authentic SVG logos when locally available (Cisco, Fortinet, Palo Alto, Linux, Proxmox, PostgreSQL and others), with neutral equipment-role symbols otherwise; it does not invent vendor branding. A node inspector allows engineers to edit device metadata and save it to PostgreSQL. Legacy untouched four-node starter diagrams are upgraded at read time without rewriting stored projects or overwriting customized user diagrams.

These are **reference designs**, not evidence of completed production deployments. Real lab state still depends on GNS3 or the isolated Linux lab runner, with verification recorded separately. The personal portrait is displayed in the template hero and fully in the About section using the user-supplied image.
