#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

SSL_CERT_FILE="$(realpath '/Library/Application Support'/*/*/data/*cacert.pem 2>/dev/null || echo '')"

SCRIPT_FOLDER="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"

if sh "$SCRIPT_FOLDER/is_proxy_enabled.sh"; then
	xcrun simctl keychain booted add-root-cert "$SSL_CERT_FILE"
	echo "Certificate added to simulator"
fi
