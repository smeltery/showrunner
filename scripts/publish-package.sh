#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
if [[ -z "${NODE_AUTH_TOKEN:-}" || -z "${RELEASE_TAG:-}" ]]; then
	echo "NODE_AUTH_TOKEN and RELEASE_TAG are required" >&2
	exit 1
fi
version="${RELEASE_TAG#v}"
registry="https://npm.pkg.github.com"
printf '@smeltery:registry=%s\n//npm.pkg.github.com/:_authToken=%s\n' "$registry" "$NODE_AUTH_TOKEN" > "${HOME}/.npmrc"
chmod 600 "${HOME}/.npmrc"
pnpm pkg set "version=${version}"
name="$(node -p 'require("./package.json").name')"
if npm view "${name}@${version}" version --registry "$registry" >/dev/null 2>&1; then
	echo "${name}@${version} is already on GitHub Packages"
	exit 0
fi
pnpm build
npm publish --ignore-scripts --registry "$registry"
echo "published ${name}@${version} to GitHub Packages"
