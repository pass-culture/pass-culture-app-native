#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

NODE_EXTRA_CA_CERTS='/Library/Application Support/Netskope/STAgent/data/nscacert.pem'
if [ -f "$NODE_EXTRA_CA_CERTS" ]; then
	export NODE_EXTRA_CA_CERTS
	export NIX_SSL_CERT_FILE="$NODE_EXTRA_CA_CERTS"
fi
