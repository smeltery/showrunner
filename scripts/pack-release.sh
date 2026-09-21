#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
if [[ -z "${RELEASE_TAG:-}" ]]; then
	echo "RELEASE_TAG is required" >&2
	exit 1
fi
version="${RELEASE_TAG#v}"
pnpm install --frozen-lockfile
pnpm pkg set "version=${version}"
rm -rf dist-release
mkdir -p dist-release
pnpm pack --pack-destination dist-release
mapfile -t tarballs < <(find dist-release -name '*.tgz' -print)
if [[ "${#tarballs[@]}" -ne 1 ]]; then
	echo "expected one packed tarball" >&2
	exit 1
fi
mv "${tarballs[0]}" "dist-release/showrunner-${version}.tgz"
(
	cd dist-release
	shasum -a 256 "showrunner-${version}.tgz" > SHA256SUMS
)
