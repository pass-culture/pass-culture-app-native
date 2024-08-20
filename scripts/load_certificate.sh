#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

SSL_CERT_FILE="$(ls '/Library/Application Support'/*/*/data/*cacert.pem)"

if [ -f "$SSL_CERT_FILE" ]; then
	export SSL_CERT_FILE="$SSL_CERT_FILE"
	export NODE_EXTRA_CA_CERTS="$SSL_CERT_FILE"
	export NIX_SSL_CERT_FILE="$SSL_CERT_FILE"
fi
