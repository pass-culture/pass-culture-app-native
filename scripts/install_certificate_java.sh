#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

SSL_CERT_FILE="$(realpath '/Library/Application Support'/*/*/data/*cacert.pem 2>/dev/null || echo '')"

SCRIPT_FOLDER="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"

remove_certificate_bundle_safe() {
	if [ -f "$SSL_CERT_BUNDLE_FILE" ]; then
		sudo rm "$SSL_CERT_BUNDLE_FILE"
	fi
}

has_certificate() {
	echo "${SECRET_KEYTOOL_PASSWORD}" |
		sudo keytool -cacerts -list -alias "mykey"
}

remove_certificate() {
	echo "${SECRET_KEYTOOL_PASSWORD}" |
		sudo keytool -delete -cacerts -alias "mykey" >/dev/null
}

remove_certificate_safe() {
	remove_certificate_bundle_safe

	if has_certificate; then
		remove_certificate
	fi
}

set_password_and_accept_trusting_the_certificate() {
	echo "${SECRET_KEYTOOL_PASSWORD}"
	echo "oui"
}

add_certificate() {
	set_password_and_accept_trusting_the_certificate |
		sudo keytool -import -cacerts -file "$SSL_CERT_BUNDLE_FILE" >/dev/null
}

add_certificate_safe() {
	if ! has_certificate; then
		add_certificate
	fi
}

if [ -n "${SSL_CERT_FILE}" ]; then
	SSL_CERT_DIR="$(dirname "$SSL_CERT_FILE")"
	SSL_CERT_TENANT="$(realpath "$SSL_CERT_DIR"/*tenantcert.pem)"
	SSL_CERT_BUNDLE_FILE="$SSL_CERT_DIR/cert-bundle.pem"

	remove_certificate_safe # to be able to debug, remove everything done, comment this when not debugging

	if sh "$SCRIPT_FOLDER/is_proxy_enabled.sh"; then
		if [ -f "$SSL_CERT_TENANT" ]; then
			echo "Adding certificate for proxy in Java's keytool system requires root password"

			if [ ! -f "$SSL_CERT_BUNDLE_FILE" ]; then
				cat "$SSL_CERT_TENANT" "$SSL_CERT_FILE" | sudo tee "$SSL_CERT_BUNDLE_FILE" >/dev/null
			fi

			add_certificate_safe
		fi
	else
		remove_certificate_safe
	fi
fi
