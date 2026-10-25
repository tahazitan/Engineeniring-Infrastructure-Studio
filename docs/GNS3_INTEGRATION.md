# GNS3 integration — Taha Infrastructure Studio

## Supported workflows

The **Architecture / Topology** tab in each engineering project has two options:

1. **Connect GNS3 Server** checks the local GNS3 v2 REST API at `127.0.0.1:3080`, lists projects, and imports the selected project's devices and links into the React Flow editor.
2. **Import .gns3 file** imports a locally selected GNS3 JSON topology without requiring an active GNS3 server. A downloadable demonstration diagram is available in the sidebar.

Imported node roles (router, switch, firewall, client, server, cloud) and link interface labels are preserved when **Save project** is selected. Saved data is stored in PostgreSQL; imported diagrams are editable snapshots, **not** remote edits to the original GNS3 project. The app does not start or stop GNS3 nodes automatically.

## Starting GNS3 Server on the connected Mac

The tested GNS3 application version is 2.2.61. The server binary supplied by GNS3 is:

```bash
/Applications/GNS3.app/Contents/MacOS/gns3server --host 127.0.0.1 --port 3080
```

Keep the API bound to loopback. The server uses GNS3's **existing, locally configured Basic authentication**. The Studio server obtains this authentication from GNS3's local configuration on the same Mac; credentials are never embedded in frontend HTML or committed to Git.

For an offline diagram example, open `/examples/taha-network-demo.gns3` in the browser or download it from the Architecture sidebar.

## Verifying

```bash
curl http://127.0.0.1:3000/api/gns3
curl 'http://127.0.0.1:3000/api/gns3?action=projects'
npm run audit:local
```

`/api/gns3` should show `connected:true` when the GNS3 server is authenticated and reachable. An empty projects list indicates no available GNS3 projects, not a connection failure.

## Lab execution limitations

GNS3 topology import and real FRRouting/Containerlab execution are separate. The Enterprise Multi-Site Lab Operations tab uses a restricted Linux VM runner documented in [LAB_RUNNER_SETUP.md](LAB_RUNNER_SETUP.md). It requires an isolated Linux machine or VM and a localhost SSH tunnel. A connected GNS3 Server does not imply that the Linux lab runner is available.

## Operations & security

- GNS3 integration API is **read-only** and private-mode only.
- API target is hardcoded to loopback; clients cannot specify arbitrary URLs.
- Project identifiers are validated before backend requests.
- GNS3 configuration secrets remain on the local machine.
- Do not expose the private Studio to the public Internet without additional authentication.
