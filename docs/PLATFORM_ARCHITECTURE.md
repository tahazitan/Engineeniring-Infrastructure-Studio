# Taha Infrastructure Studio — Technical Architecture

## Platform responsibilities

```mermaid
flowchart LR
    U[Engineer / Browser] --> N[Next.js React UI]
    N --> T[Three.js 3D Experience]
    N --> D[React Flow Topology]
    N --> M[Monaco Configuration Editor]
    N --> A[Next.js API Routes]
    A --> P[(PostgreSQL: Projects & Tests)]
    A --> O[(MinIO: Evidence Artifacts)]
    E[Linux VM] --> L[Containerlab + FRRouting]
    L --> V[verify.sh & command outputs]
    V --> U
```

The studio maintains project lifecycle, architecture, configurations and test plans. Network laboratories run separately in an **isolated Linux environment**. Engineers bring command output and artifacts into the evidence register through the private studio.

## Local service boundaries

| Component | Interface | Function |
| --- | --- | --- |
| Next.js | 127.0.0.1:3000 | Frontend and project APIs |
| PostgreSQL | 127.0.0.1:5434 | Project and evidence metadata |
| MinIO API | 127.0.0.1:9000 | Evidence objects |
| MinIO Console | 127.0.0.1:9001 | Local storage administration |
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
Private mode exposes Studio, project editing and evidence APIs. Public mode presents the immersive portfolio, with project records filtered to those marked public and verified. Live database credentials and real engineering evidence are stored outside the repository.

## Future engineering interfaces
- Scoped local runner for explicit approved Containerlab and Ansible operations.
- Structured captures of command/test outputs and machine-readable execution history.
- Versioned architecture packages and rollback points.
- Role-scoped authorization for any remotely hosted private workbench.
- Automated redaction and review of materials selected for public case studies.

These integrations have distinct service boundaries, allowing each to be developed, tested and operated independently.
