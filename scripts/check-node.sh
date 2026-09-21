#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

pnpm_version="$(pnpm --version 2>/dev/null || true)"
if [[ "$pnpm_version" != "10.13.1" ]]; then
	export COREPACK_HOME="${COREPACK_HOME:-$root/.corepack}"
	corepack enable
	corepack prepare pnpm@10.13.1 --activate
fi

pnpm install --frozen-lockfile
if [[ -n "${CI:-}" ]]; then
	pnpm exec playwright install --with-deps chromium
else
	pnpm exec playwright install chromium
fi
pnpm fmt:check
pnpm type-check
pnpm build
pnpm test:agent
pnpm demo
