#!/bin/zsh
# Version 20240918-01
title() { echo "\n=== $@ ===\n"; }
sep() { echo "--- $1 ---"; }
var() { eval val=\$$1; echo "$1: $val"; }
ver() { sep $1; r=`which -a $1`; e=$?; if [ "$e" -eq 0 ]; then for p in "${r:t}"; do echo -n "$p: "; [ "$2" = "" ] && "$p" --version || "$p" $2 $3; e=$?; done; else echo "$r"; fi; return "$e"; }
timestamp=`date +"%y%m%d%H%M%S"`
serial=`ioreg -c IOPlatformExpertDevice -d 2 -a | xmllint --xpath "/plist/dict[key='IORegistryEntryChildren']/array/dict/key[.='IOPlatformSerialNumber']/following-sibling::string[1]/node()" -`
# echo $(dirname "$0")/$(basename "$0" .sh).txt
output=${timestamp}_${serial}.txt
echo Generating ${output} ...
{
	date
	title System
	sw_vers
	hostname
	whoami
	uname -a
	title Recent updates
	softwareupdate --history
	title Variables
	var PATH
	var GIT_SSL_CAPATH
	var GIT_SSL_CERT
 	var GIT_PROXY_SSL_CAINFO
	var CLOUDSDK_PYTHON
	var REQUESTS_CA_BUNDLE
	var CURL_CA_BUNDLE
 	var SSL_CERT_DIR
	var SSL_CERT_FILE
	var NODE_EXTRA_CA_CERTS
	var HTTPLIB2_CA_CERTS
	var NIX_SSL_CERT_FILE
 	var JAVA_HOME
	title Tools
	ver brew && brew list
 	ver curl
	ver git && git config --global http.sslbackend
	ver python
	ver python3
	sep pip_packages; python3 -m pip list
	sep pip_debug; python3 -m pip debug
	sep pip_config; python3 -m pip config list
	ver poetry # not found if pipx
	ver pipx
	sep pipx_poetry; ~/.local/bin/poetry --version
	ver gcloud && gcloud config get core/custom_ca_certs_file # if needed: gcloud config set disable_prompts true
	ver openssl version
	ver yarn && yarn config get cafile
	ver npm && npm config get cafile
	ver java
	ver docker
	ver kubectl version --client
	ver node
	ver nix
 	ver direnv
	ver dbt # not found if used in virtualenv
 	ver virtualenv
	sep react_native; [ -e "./node_modules/.bin/react-native" ] && ./node_modules/.bin/react-native info
	ver emulator -version && emulator -list-avds
	ver xcrun && xcrun simctl list # --json
	ver xcodebuild -version || pkgutil --pkg-info=com.apple.pkg.CLTools_Executables | grep version
 	ver code && code --list-extensions
  	ver ruby
   	ver rvm && rvm list
    	ver adb
	ver devbox version
    	sep maestro; yes n | maestro --version # Enable analytics ? n
	title Proxy
	sep system-store; security find-certificate -c "$SECRET_PROXY_KEYWORD" -a -Z | grep "SHA-1"
	sep keytool; keytool -cacerts -list -storepass "$SECRET_KEYTOOL_PASSWORD" | grep -A 1 "$SECRET_PROXY_KEYWORD"
	sep proxy-certs; (cd /Library/Application\ Support/*/*Agent/data/ && ls -la *.pem)
} > ${output} 2>&1
