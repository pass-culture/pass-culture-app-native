#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

SCRIPT_FOLDER="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"
IMAGE_TAG="pcnative-e2e-web"

BUILD_CONTEXT_ARGS=()
if sh "$SCRIPT_FOLDER/is_proxy_enabled.sh"; then
	CERTS_DIR="$(mktemp -d)"
	cp "$(realpath '/Library/Application Support'/*/*/data/*cacert.pem)" "$CERTS_DIR/netskope-root.crt"
	cp "$(realpath '/Library/Application Support'/*/*/data/*tenantcert.pem)" "$CERTS_DIR/netskope-intermediate.crt"
	BUILD_CONTEXT_ARGS=(--build-context "netskope-certs=$CERTS_DIR")
fi

docker build "${BUILD_CONTEXT_ARGS[@]}" -f "$SCRIPT_FOLDER/../e2e/Dockerfile" -t "$IMAGE_TAG" "$SCRIPT_FOLDER/.."
docker run --rm --ipc=host "$IMAGE_TAG"
