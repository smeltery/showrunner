#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
bun install --cwd tools/docs --frozen-lockfile
bun tools/docs/check-file-sizes.ts
bun tools/docs/check-flat-directories.ts
actionlint
mapfile -t files < <(git ls-files '*.sh')
if ((${#files[@]} > 0)); then
	shellcheck "${files[@]}"
fi
git diff --check HEAD
