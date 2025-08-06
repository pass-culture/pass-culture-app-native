#!/usr/bin/env bash
heading_2() {
	echo -e "\n## $*\n"
}

heading_3() {
	echo -e "\n### $1\n"
}

display_variable() {
	eval "val=\$$1"
	# the variable is dynamically assigned with eval, schellcheck don't understand it
	# shellcheck disable=SC2154
	echo "$1: $val"
}

display_version() {
	heading_3 "$1"
	r=$(which -a "$1")
	e=$?
	if [ "$e" -eq 0 ]; then
		for p in ${r:t}; do
			echo -n "$p: "
			if [ "$2" = "" ]; then
				"$p" --version
			else
				"$p" "${@:2}"
			fi
			e=$?
		done
	else
		echo "$r"
	fi
	return "$e"
}

timestamp=$(date +"%y%m%d%H%M%S")
serial=$(ioreg -c IOPlatformExpertDevice -d 2 -a | xmllint --xpath "/plist/dict[key='IORegistryEntryChildren']/array/dict/key[.='IOPlatformSerialNumber']/following-sibling::string[1]/node()" -)
output=${timestamp}_${serial}.md
echo "Generating ${output} ..."
{
	echo "# $(date)"

	heading_2 System
	sw_vers
	hostname
	whoami
	uname -a

	heading_2 Recent updates
	softwareupdate --history

	heading_2 Variables
	display_variable PATH
	display_variable GIT_SSL_CAPATH
	display_variable GIT_SSL_CERT
	display_variable GIT_PROXY_SSL_CAINFO
	display_variable CLOUDSDK_PYTHON
	display_variable REQUESTS_CA_BUNDLE
	display_variable CURL_CA_BUNDLE
	display_variable SSL_CERT_DIR
	display_variable SSL_CERT_FILE
	display_variable NODE_EXTRA_CA_CERTS
	display_variable HTTPLIB2_CA_CERTS
	display_variable NIX_SSL_CERT_FILE
	display_variable JAVA_HOME

	heading_2 Tools
	display_version brew && brew list
	display_version curl
	display_version git && git config --global http.sslbackend
	display_version python
	display_version python3
	heading_3 pip_packages
	python3 -m pip list
	heading_3 pip_debug
	python3 -m pip debug
	heading_3 pip_config
	python3 -m pip config list
	display_version poetry # not found if pipx
	display_version pipx
	heading_3 pipx_poetry
	~/.local/bin/poetry --version
	display_version gcloud && gcloud config get core/custom_ca_certs_file # if needed: gcloud config set disable_prompts true
	display_version openssl version
	display_version yarn && yarn config get cafile
	display_version npm && npm config get cafile
	display_version java
	display_version docker
	display_version kubectl version --client
	display_version node
	display_version nix && ls -l /etc/nix/ && cat /etc/nix/nix.conf && display_version determinate-nixd
	display_version direnv
	display_version dbt # not found if used in virtualenv
	display_version virtualenv
	heading_3 react_native
	[ -e "./node_modules/.bin/react-native" ] && ./node_modules/.bin/react-native info
	display_version emulator -version && emulator -list-avds
	display_version xcrun && xcrun simctl list # --json
	display_version xcodebuild -version || pkgutil --pkg-info=com.apple.pkg.CLTools_Executables | grep version
	display_version code && code --list-extensions
	display_version ruby
	display_version rvm && rvm list
	display_version adb
	heading_3 maestro
	yes n | maestro --version # Enable analytics ? n

	heading_2 Proxy
	heading_3 system-store
	security find-certificate -c "$SECRET_PROXY_KEYWORD" -a -Z | grep "SHA-1"
	heading_3 keytool
	keytool -cacerts -list -storepass "$SECRET_KEYTOOL_PASSWORD" | grep -A 1 "$SECRET_PROXY_KEYWORD"
	heading_3 proxy-certs
	(cd /Library/Application\ Support/*/*Agent/data/ && ls -la ./*.pem)
} >"${output}" 2>&1
