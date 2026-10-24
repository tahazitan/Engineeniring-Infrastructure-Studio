# Infrastructure Lab Runner

A Node.js 22+ local agent for the **Enterprise Multi-Site Network Lab**. It runs a strictly defined command set inside a dedicated Linux lab VM:

| Action | Fixed executable and arguments |
| --- | --- |
| Deploy | `sudo -n containerlab deploy -t topology.clab.yml` |
| Status | `sudo -n containerlab inspect -t topology.clab.yml --format json` |
| Verify | `bash scripts/verify.sh` |
| Destroy | `sudo -n containerlab destroy -t topology.clab.yml --cleanup` |

No command, shell script path, directory or executable argument is accepted from the browser. The agent binds to `127.0.0.1:4401` inside Linux and requires a random bearer token (32+ characters). All commands run with a fixed working directory, no shell parsing, bounded logs and timeouts.

The private application reaches the agent through a **local SSH tunnel** from macOS, so the VM does not expose the agent over the network.

See [Runner Integration Setup](../docs/LAB_RUNNER_SETUP.md) for macOS and Linux installation, SSH tunnel, PostgreSQL migration, start commands and verification.

Run agent unit tests from the repository root:

```bash
node --test lab-runner/agent.test.mjs
```
