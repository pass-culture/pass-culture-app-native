#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

PROXY_DIAGNOSTIC="$(realpath '/Library/Application Support'/*/*/*diag 2>/dev/null || echo '')"

if [ -n "${PROXY_DIAGNOSTIC}" ]; then
	"$PROXY_DIAGNOSTIC" -f | grep "TUNNEL_CONNECTED" >/dev/null
else
	return 1
fi
