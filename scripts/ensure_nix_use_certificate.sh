#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

CERTIFICATE_PATH="$(ls '/Library/Application Support'/*/*/data/*cacert.pem)"
NIX_CONF="/etc/nix/nix.conf"

is_nix_using_certificate() {
	[ ! -e "$NIX_CONF" ] ||
		grep "ssl-cert-file" "$NIX_CONF" >/dev/null
}

is_nix_configuration_generated() {
	[ ! -e "$NIX_CONF" ] ||
		grep 'this file is generated' "$NIX_CONF" >/dev/null
}

add_certificate() {
	sudo mkdir -p "$(dirname $NIX_CONF)"
	echo "ssl-cert-file = $CERTIFICATE_PATH" | sudo tee -a "$NIX_CONF" >/dev/null
}

restart_nix() {
	sudo launchctl unload /Library/LaunchDaemons/org.nixos.nix-daemon.plist
	sudo launchctl load /Library/LaunchDaemons/org.nixos.nix-daemon.plist
}

ensure_nix_use_certificate() {
	if is_nix_using_certificate; then
		return
	fi

	if is_nix_configuration_generated; then
		echo 'You configuration seems to be generated, please use [`security.pki.certificates`](https://www.notion.so/passcultureapp/Proxyfication-des-outils-du-pass-d1f0da09eafb4158904e9197bbe7c1d4?pvs=4#03116c9cefa042f59f678ab22c8e1e6c)'
		exit 1
	fi

	echo 'Adding certificate for Nix in your system configuration require the root password'

	add_certificate

	restart_nix
}

if [ -f "$CERTIFICATE_PATH" ]; then
	ensure_nix_use_certificate
fi
