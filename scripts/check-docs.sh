#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
bun install --cwd tools/docs --frozen-lockfile
bun tools/docs/check-markdown.ts
bun tools/docs/check-mermaid.ts
bun tools/docs/check-doc-links.ts
