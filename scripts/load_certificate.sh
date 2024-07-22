#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

SSL_CERT_FILE='/Library/Application Support/Netskope/STAgent/data/nscacert.pem'

if [ -f "$SSL_CERT_FILE" ]; then
	export SSL_CERT_FILE="$SSL_CERT_FILE"
	export NODE_EXTRA_CA_CERTS="$SSL_CERT_FILE"
	export NIX_SSL_CERT_FILE="$SSL_CERT_FILE"
fi
