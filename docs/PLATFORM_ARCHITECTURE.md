# Taha Infrastructure Studio — Technical Architecture

## Platform responsibilities

```mermaid
flowchart LR
    U[Engineer / Browser] --> N[Next.js React Interface]
    N --> T[Reference-Template CSS / SVG Motion]
    N --> D[React Flow Topology]
    N --> M[Monaco Configuration Editor]
    N --> A[Express / Next.js API]
    A --> P[(PostgreSQL: Projects & Tests)]
    A --> O[(RustFS S3: Evidence Artifacts)]
    A --> R[Local SSH Tunnel → Linux VM Lab Runner]\n    R --> L[Containerlab + FRRouting]
    L --> V[verify.sh & command outputs]
    V --> U
```

The studio maintains project lifecycle, architecture, configurations and test plans. Network laboratories run separately in an **isolated Linux environment**. Engineers bring command output and artifacts into the evidence register through the private studio.

## Local service boundaries

| Component | Interface | Function |
| --- | --- | --- |
| Express + Next.js | 127.0.0.1:3000 | Template-based frontend and project APIs |
| PostgreSQL | 127.0.0.1:5434 | Project and evidence metadata |
| S3-compatible RustFS API | 127.0.0.1:9000 | Evidence objects |
| RustFS Console | 127.0.0.1:9001 | Local storage administration |
| Linux networking lab | Isolated virtual network | Containerlab, FRRouting and traffic verification |

## Project lifecycle
1. Architect a topology and record assumptions.
2. Record and version the relevant configuration.
3. Execute lab tests with an explicit expected outcome.
4. Record observations and attach evidence artifacts.
5. Complete the engineering checklist, confirm results and mark the project verified.
6. Optionally approve the verified project for future public visibility.

Persistence is backed by `projects` and `evidence` SQL tables. The API checks that completed status has passing acceptance tests, checklist completion, and an existing evidence record.

## Public and private experience
Private mode exposes Studio, project editing and evidence APIs. Public mode presents the template-driven portfolio, with project records filtered to those marked public and verified. Live database credentials and real engineering evidence are stored outside the repository.

## Future engineering interfaces
- Scoped local runner for explicit approved Containerlab and Ansible operations.
- Structured captures of command/test outputs and machine-readable execution history.
- Versioned architecture packages and rollback points.
- Role-scoped authorization for any remotely hosted private workbench.
- Automated redaction and review of materials selected for public case studies.

These integrations have distinct service boundaries, allowing each to be developed, tested and operated independently.
