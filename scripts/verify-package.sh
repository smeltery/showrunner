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
name="$(node -p 'require("./package.json").name')"
for attempt in 1 2 3 4 5 6; do
	if published="$(npm view "${name}@${version}" version --registry "$registry" 2>/dev/null)" && [[ "$published" == "$version" ]]; then
		echo "${name}@${version} is on GitHub Packages"
		exit 0
	fi
	echo "attempt ${attempt}: ${name}@${version} is not visible yet"
	sleep 10
done
echo "${name}@${version} was not published" >&2
exit 1
