#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

SSL_CERT_FILE="$(realpath '/Library/Application Support'/*/*/data/*cacert.pem 2>/dev/null || echo '')"

SCRIPT_FOLDER="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"

if sh "$SCRIPT_FOLDER/is_proxy_enabled.sh"; then
	export SSL_CERT_FILE="$SSL_CERT_FILE"
	export NODE_EXTRA_CA_CERTS="$SSL_CERT_FILE"
	export NIX_SSL_CERT_FILE="$SSL_CERT_FILE"
fi
