#!/usr/bin/env bash

set -e

X_API_TOKEN="${APPCENTER_USER_API_TOKEN}"

APPCENTER_ENVIRONMENT="$1"
APPCENTER_PLATFORM="$2"
TARGET_VERSION="$3"

INSTALL="${INSTALL:-"true"}"
UNINSTALL="${UNINSTALL:-"true"}"
LAUNCH="${LAUNCH:-"true"}"
REMOVE_APK_AFTER_INSTALL="${REMOVE_APK_AFTER_INSTALL:-"true"}"
REMOVE_IPA_AFTER_INSTALL="${REMOVE_IPA_AFTER_INSTALL:-"true"}"
APPCENTER_API_URL="https://api.appcenter.ms/v0.1"
APPCENTER_OWNER_NAME="pass-Culture"
APPCENTER_DISTRIBUTION_GROUP_NAME="Collaborators"

GITHUB_APP_NATIVE_RAW_REPOSITORY_URL="https://raw.githubusercontent.com/pass-culture/pass-culture-app-native"

appName="passculture-${APPCENTER_ENVIRONMENT}-${APPCENTER_PLATFORM}"
releaseId="latest"
appId=$(echo "${APPCENTER_PLATFORM}_APP_ID" | tr 'a-z' 'A-Z')

function help() {
  echo "Description:"
  echo
  echo "      Quickly download, uninstall and reinstall an apk/ipa from AppCenter."
  echo
  echo "      Android: Requires a running emulator OR a physical device (connected with USB and USB debugging enabled or through tcp) "
  echo
  echo "      iOS: It only support ipa download"
  echo
  echo "Syntax:"
  echo
  echo "      yarn appcenter:install <testing|staging> <android|ios> [version]"
  echo
  echo "Options:"
  echo
  echo "      | Environment variable                 | Description                                                                                |"
  echo "      |======================================|============================================================================================|"
  echo "      | APPCENTER_USER_API_TOKEN             | Your AppCenter user API token. (See https://appcenter.ms/settings/apitokens) [REQUIRED]    |"
  echo
  echo
  echo "      | Android only Environment variable    | Description                                                                                |"
  echo "      |======================================|============================================================================================|"
  echo "      | APPCENTER_USER_API_TOKEN             | Your AppCenter user API token. (See https://appcenter.ms/settings/apitokens) [REQUIRED]    |"
  echo "      | INSTALL                              | Set it to 'false' to skip application installation                                         |"
  echo "      | UNINSTALL                            | Set it to 'false' to skip application uninstallation                                       |"
  echo "      | LAUNCH                               | Set it to 'false' to skip application launch                                               |"
  echo "      | REMOVE_AFTER_INSTALL                 | Set it to 'false' to keep apk                                                              |"
  echo
  echo "Examples:"
  echo
  echo
  echo "  - Install latest Android release for testing environment"
  echo
  echo "      yarn appcenter:install testing android"
  echo
  echo "  - Install Android version 1.206.0 release for testing environment"
  echo
  echo "      yarn appcenter:install testing android 1.206.0"
  echo
  echo "  - Download latest ipa from appcenter"
  echo
  echo "      yarn appcenter:install testing ios"
  echo
  echo "NOTE:"
  echo
  echo '  - "adb devices" must show just one connected Android device'
  echo '  - AppCenter ipa does not support simulator'
  echo
  echo "Requirements:"
  echo
  echo "  - jq"
  echo "  - adb"
  echo
}

function android() {
  releaseId="latest"
  downloadedFile="app-${APPCENTER_ENVIRONMENT}-${APPCENTER_PLATFORM}.apk"

  if [[ -f "${downloadedFile}" ]]; then
    echo "Removing previously downloaded file ${downloadedFile} from your disk"
    rm "${downloadedFile}"
  fi

  if [[ -n "${TARGET_VERSION}" ]]; then
    releaseId="$(
      curl -sS \
        -H "X-API-Token: ${X_API_TOKEN}" \
        -H "accept: application/json" \
        "${APPCENTER_API_URL}/apps/pass-Culture/${appName}/releases" |
        jq 'map(select(.short_version == "'"${TARGET_VERSION}"'").id)[0]'
    )" || die "Cannot retrieve AppCenter Release ID"
    echo "Fetched ${APPCENTER_PLATFORM} AppCenter Release ID ${releaseId} for application version ${TARGET_VERSION} (${APPCENTER_ENVIRONMENT}) with success"
  else
    echo "No version provided, it will install the latest ${APPCENTER_ENVIRONMENT} version"
  fi

  if [[ "${UNINSTALL}" = "true" ]]; then
    packageId="$(curl -sS "${GITHUB_APP_NATIVE_RAW_REPOSITORY_URL}/master/.env.${APPCENTER_ENVIRONMENT}" | grep "${appId}" | awk -F '=' '{print $2}' | xargs)"
    echo "Trying to uninstall ${packageId}"
    adb uninstall "${packageId}" || echo "Ignoring uninstallation ${packageId}, it may not be installed, continuing."
  fi

  downloadUrl="${APPCENTER_API_URL}/apps/${APPCENTER_OWNER_NAME}/${appName}/distribution_groups/${APPCENTER_DISTRIBUTION_GROUP_NAME}/releases/${releaseId}"

  echo "Downloading ${downloadUrl}"
  curl -H "X-API-Token: ${X_API_TOKEN}" \
    --progress-bar \
    "$(curl -sS -H "X-API-Token: ${X_API_TOKEN}" "${downloadUrl}" | jq -r '.download_url')" \
    --output "${downloadedFile}" || die "Version ${TARGET_VERSION} does not exist in ${APPCENTER_ENVIRONMENT} environment ${APPCENTER_PLATFORM}"

  if [[ "${INSTALL}" = "true" ]]; then
    echo "Installing ${downloadedFile} (AppCenter Release ID ${releaseId}). ${TARGET_VERSION}"
    adb install "${downloadedFile}"
  fi

  if [[ "${REMOVE_AFTER_INSTALL}" = "true" ]] && [[ -f "${downloadedFile}" ]]; then
    echo "Removing ${downloadedFile} from your disk"
    rm "${downloadedFile}"
  fi

  if [[ "${LAUNCH}" = "true" ]]; then
    app_and_activity="${packageId}/com.passculture.MainActivity"
    echo "Application is now starting on your device"
    adb shell am start -n "${app_and_activity}"
  fi
  exit 0
}


function ios() {
  downloadedFile="app-${APPCENTER_ENVIRONMENT}-${APPCENTER_PLATFORM}.ipa"

  if [[ -f "${downloadedFile}" ]]; then
    echo "Removing previously downloaded file ${downloadedFile} from your disk"
    rm "${downloadedFile}"
  fi

  if [[ -n "${TARGET_VERSION}" ]]; then
    releaseId="$(
      curl -sS \
        -H "X-API-Token: ${X_API_TOKEN}" \
        -H "accept: application/json" \
        "${APPCENTER_API_URL}/apps/pass-Culture/${appName}/releases" |
        jq 'map(select(.short_version == "'"${TARGET_VERSION}"'").id)[0]'
    )" || die "Cannot retrieve AppCenter Release ID"
    echo "Fetched ${APPCENTER_PLATFORM} AppCenter Release ID ${releaseId} for application version ${TARGET_VERSION} (${APPCENTER_ENVIRONMENT}) with success"
  else
    echo "No version provided, it will install the latest ${APPCENTER_ENVIRONMENT} version"
  fi

  downloadUrl="${APPCENTER_API_URL}/apps/${APPCENTER_OWNER_NAME}/${appName}/distribution_groups/${APPCENTER_DISTRIBUTION_GROUP_NAME}/releases/${releaseId}"

  echo "Downloading ${downloadUrl}"
  curl -H "X-API-Token: ${X_API_TOKEN}" \
    --progress-bar \
    "$(curl -sS -H "X-API-Token: ${X_API_TOKEN}" "${downloadUrl}" | jq -r '.download_url')" \
    --output "${downloadedFile}" || die "Version ${TARGET_VERSION} does not exist in ${APPCENTER_ENVIRONMENT} environment ${APPCENTER_PLATFORM}"

  exit 0
}

function die() {
  echo
  echo "ERROR: $1"
  echo
  help
  exit 1
}

function run() {
  if [[ -z "${APPCENTER_USER_API_TOKEN}" || -z "${APPCENTER_ENVIRONMENT}" || -z "${APPCENTER_PLATFORM}" ]]; then
    die "Required arguments are missing, see below."
  fi

  if [[ "${APPCENTER_ENVIRONMENT}" != "testing" && "${APPCENTER_ENVIRONMENT}" != "staging" ]]; then
    die "Unknown environment ${APPCENTER_ENVIRONMENT}"
  fi

  if [[ "${APPCENTER_PLATFORM}" = "android" ]]; then
    android
  fi

  if [[ "${APPCENTER_PLATFORM}" = "ios" ]]; then
    ios
  fi

  die "Command is incorrect, see below."
}

run
