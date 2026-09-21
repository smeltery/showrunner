#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
hooks=(
	trailing-whitespace
	end-of-file-fixer
	check-merge-conflict
	check-yaml
	check-json
	check-added-large-files
)
for hook in "${hooks[@]}"; do
	pre-commit run "$hook" --all-files
done
