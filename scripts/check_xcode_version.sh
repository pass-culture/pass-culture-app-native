#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

XCODE_SUPPORTED_VERSION="$(cat ./.xcode-version)"
XCODE_CURRENT_VERSION="$(xcodebuild -version)"

if [[ "${XCODE_CURRENT_VERSION}" != *"Xcode ${XCODE_SUPPORTED_VERSION}"* ]]; then
	echo "The supported version of XCode in this project is ${XCODE_SUPPORTED_VERSION}"
	echo "Your XCode version is :"
	echo -e "${XCODE_CURRENT_VERSION}"
	echo "The build may not work"
	echo "You can install the supported version using https://xcodereleases.com"
fi
