# Direct GNS3 Integration — Native Project Building

## Confirmed local environment

- GNS3 Server 2.2.61 on `127.0.0.1:3080`
- Native GNS3 templates are discoverable through the authenticated local API, including installed vendor appliances.
- The Mac version bundles GNS3's Dynamips, VPCS, Ubridge and Qemu executables.
- `npm run start:local` includes the GNS3 macOS executable paths in PATH when starting the local server.
- The GNS3 project **Taha IT Solutions - Client Network Starter Lab** was actually created on the Mac with a switch and two VPCS nodes, connected by two links. No simulation node was started by the Studio.

## Workflows inside /studio/[project] → Topology

The **Live GNS3 Builder** panel now supports:

1. Connect to the localhost GNS3 Server, list native projects and installed device templates.
2. Create a new GNS3 project with a custom name, or open an existing project.
3. Add native **Ethernet Switch** and **VPCS** nodes, or instantiate any GNS3 template already installed and configured on the Mac.
4. Connect devices by specifying source and destination port numbers (adapter 0 by default). Use free ports and ensure the template actually has those interfaces.
5. Load the selected native GNS3 project's nodes/links into the editable Studio React Flow canvas.
6. Save the Studio project to PostgreSQL, or edit and export configuration notes from the adjacent Configuration tab.

Importing **.gns3** files works separately from the live API. The live GNS3 project and Studio topology snapshot remain intentionally separate to avoid unexpected device changes.

## API contract

- `GET /api/gns3?action=status`: GNS3 version/connection health
- `GET /api/gns3?action=projects`: available GNS3 projects
- `GET /api/gns3?action=templates`: installed device templates
- `GET /api/gns3?action=topology&project_id=<UUID>`: inspect nodes and links
- `POST /api/gns3` permitted actions: `create_project`, `open_project`, `add_builtin_node`, `add_template_node`, `connect_link`, `update_node`

**Security:** private mode only, validated Same-Origin POST requests, request schemas limiting actions and coordinate/port numbers, loopback-only GNS3 server connection. No arbitrary command execution, file upload, remote URL or shell interface is exposed. Credential details come from the Mac's local GNS3 configuration and never appear in the UI.

**Device configurations:** Studio's Monaco editor can maintain and export configuration text. Running vendor CLI commands or injecting startup configurations automatically is **not implemented**: apply them through authorized native GNS3 consoles / device template procedures after reviewing compatibility. A configured template does not guarantee the emulator, device image or license is available. Missing emulator binaries generate a GNS3 error; check the GNS3 Server logs and bundled executable paths.

**Simulation boundaries:** adding/connecting nodes is a real GNS3 database operation. The nodes are not automatically powered on and no network reachability or security policy is claimed until verified in an actual lab session.

## Tests

```bash
npm run start:local
npm run audit:local
npm test
```

The integration audit verifies local GNS3 status, projects, templates, CSRF protection and validated request rejection. The live Starter Lab was separately exercised end-to-end through the Studio API with real project/node/link creation. Re-running the general audit does not create or delete native projects.

For Containerlab/FRRouting deployment and remote Linux VMs, refer to [LAB_RUNNER_SETUP.md](LAB_RUNNER_SETUP.md); that runner is a distinct optional execution backend.
