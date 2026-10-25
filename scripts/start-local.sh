#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# macOS Docker Desktop places its credential helper outside the default PATH.
export PATH="/Applications/GNS3.app/Contents/MacOS:/Applications/GNS3.app/Contents/MacOS/qemu/bin:/Applications/Docker.app/Contents/Resources/bin:$PATH"
if ! docker info >/dev/null 2>&1; then
  if command -v open >/dev/null 2>&1; then open -a Docker; fi
  echo "Starting Docker Desktop..."
  ready=0
  for _ in $(seq 1 25); do
    if docker info >/dev/null 2>&1; then ready=1; break; fi
    sleep 2
  done
  if [ "$ready" != 1 ]; then echo "Docker daemon unavailable." >&2; exit 1; fi
fi

docker compose up -d
if ! nc -z 127.0.0.1 3080 >/dev/null 2>&1; then
  binary="/Applications/GNS3.app/Contents/MacOS/gns3server"
  if [ -x "$binary" ]; then
    mkdir -p "$HOME/.cache/taha-infrastructure-studio"
    "$binary" --host 127.0.0.1 --port 3080 >"$HOME/.cache/taha-infrastructure-studio/gns3.log" 2>&1 &
    echo "GNS3 local server started (PID $!)."
  else
    echo "GNS3 executable not found; GNS3 file import remains available."
  fi
fi

if nc -z 127.0.0.1 3000 >/dev/null 2>&1; then
  echo "Infrastructure Studio is already listening: http://127.0.0.1:3000"
  exit 0
fi
echo "Launching Infrastructure Studio on http://127.0.0.1:3000"
exec npm run dev
