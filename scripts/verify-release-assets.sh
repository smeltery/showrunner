#!/usr/bin/env bash
set -euo pipefail
if [[ -z "${RELEASE_TAG:-}" || -z "${GH_TOKEN:-}" || -z "${GITHUB_API_URL:-}" || -z "${GITHUB_REPOSITORY:-}" ]]; then
	echo "RELEASE_TAG, GH_TOKEN, GITHUB_API_URL, and GITHUB_REPOSITORY are required" >&2
	exit 1
fi
version="${RELEASE_TAG#v}"
api="${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}/releases/tags/${RELEASE_TAG}"
expected="$(printf '%s\n' "SHA256SUMS" "showrunner-${version}.tgz" | sort)"
for attempt in 1 2 3 4 5 6; do
	if body="$(curl -fsSL -H "Authorization: Bearer ${GH_TOKEN}" -H "Accept: application/vnd.github+json" "$api")"; then
		assets="$(printf '%s' "$body" | jq -r '.assets[].name' | sort)"
		if [[ "$assets" == "$expected" ]]; then
			echo "release assets match for ${RELEASE_TAG}"
			exit 0
		fi
		echo "attempt ${attempt}: assets do not match yet"
		printf '%s\n' "$assets"
	fi
	sleep 10
done
echo "release assets not ready for ${RELEASE_TAG}" >&2
exit 1
