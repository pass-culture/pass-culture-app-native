#!/usr/bin/env bash

set -e

X_API_TOKEN="${APPCENTER_USER_API_TOKEN}"

APPCENTER_ENVIRONMENT="$1"
APPCENTER_PLATFORM="$2"
TARGET_VERSION="$3"

UNINSTALL="${UNINSTALL:-"true"}"
LAUNCH="${LAUNCH:-"true"}"

APPCENTER_API_URL="https://api.appcenter.ms/v0.1"
APPCENTER_OWNER_NAME="pass-Culture"
APPCENTER_DISTRIBUTION_GROUP_NAME="Collaborators"

GITHUB_APP_NATIVE_RAW_REPOSITORY_URL="https://raw.githubusercontent.com/pass-culture/pass-culture-app-native"

function help() {
  echo "Description:"
  echo
  echo "      Quickly uninstall, download and reinstall an APK from AppCenter."
  echo
  echo "      Android: Requires a running emulator OR a physical device (connected with USB and USB debugging enabled or through tcp) "
  echo
  echo "Syntax:"
  echo
  echo "      yarn appcenter:install <testing|staging> <android> [version]"
  echo
  echo "Options:"
  echo
  echo "      | Environment variable                 | Description                                                                                |"
  echo "      |======================================|============================================================================================|"
  echo "      | APPCENTER_USER_API_TOKEN             | Your AppCenter user API token. (See https://appcenter.ms/settings/apitokens) [REQUIRED]    |"
  echo "      | UNINSTALL                            | Set it to 'false' to skip application uninstallation                                       |"
  echo "      | LAUNCH                               | Set it to 'false' to skip application launch                                               |"
  echo
  echo "Examples:"
  echo
  echo "  - Install latest release for testing environment"
  echo
  echo "      yarn appcenter:install testing android"
  echo
  echo "  - Install version 1.206.0 release for testing environment"
  echo
  echo "      yarn appcenter:install testing android 1.206.0"
  echo
  echo
  echo "NOTE:"
  echo
  echo "  - Only Android is supported"
  echo '  - "adb devices" must show just one connected Android device'
  echo "  - It will try to uninstall prior installing the version"
  echo "  - Upon succeed, it will automatically launch the application"
  echo
  echo "Requirements:"
  echo
  echo "  - jq"
  echo "  - adb"
  echo
}

function android() {
  app_name="passculture-${APPCENTER_ENVIRONMENT}-${APPCENTER_PLATFORM}"

  releaseId="latest"
  if [[ -n "${TARGET_VERSION}" ]]; then
    releaseId="$(
      curl -sS \
        -H "X-API-Token: ${X_API_TOKEN}" \
        -H "accept: application/json" \
        "${APPCENTER_API_URL}/apps/pass-Culture/${app_name}/releases" |
        jq 'map(select(.short_version == "'"${TARGET_VERSION}"'").id)[0]'
    )" || die "Cannot retrieve AppCenter Release ID"
    echo "Fetched ${APPCENTER_PLATFORM} AppCenter Release ID ${releaseId} for application version ${TARGET_VERSION} (${APPCENTER_ENVIRONMENT}) with success"
  else
    echo "No version provided, it will install the latest ${APPCENTER_ENVIRONMENT} version"
  fi

  if [[ "${UNINSTALL}" = "true" ]]; then
    package_id="$(curl -sS "${GITHUB_APP_NATIVE_RAW_REPOSITORY_URL}/master/.env.${APPCENTER_ENVIRONMENT}" | grep "${APPCENTER_PLATFORM^^}_APP_ID" | awk -F '=' '{print $2}' | xargs)"
    echo "Trying to uninstall ${package_id}"
    adb uninstall "${package_id}" || echo "Ignoring uninstallation ${package_id}, it may not be installed, continuing."
  fi

  download_url="${APPCENTER_API_URL}/apps/${APPCENTER_OWNER_NAME}/${app_name}/distribution_groups/${APPCENTER_DISTRIBUTION_GROUP_NAME}/releases/${releaseId}"
  downloaded_file="app-${APPCENTER_ENVIRONMENT}-${APPCENTER_PLATFORM}.apk"

  echo "Downloading ${download_url}"
  curl -H "X-API-Token: ${X_API_TOKEN}" \
    --progress-bar \
    "$(curl -sS -H "X-API-Token: ${X_API_TOKEN}" "${download_url}" | jq -r '.download_url')" \
    --output "${downloaded_file}" || die "Version ${TARGET_VERSION} does not exist in environment ${APPCENTER_ENVIRONMENT}"

  echo "Installing ${downloaded_file} (AppCenter Release ID ${releaseId}). ${TARGET_VERSION}"
  adb install "${downloaded_file}"

  echo "Removing ${downloaded_file} from your disk"
  rm "${downloaded_file}"

  if [[ "${LAUNCH}" = "true" ]]; then
    app_and_activity="${package_id}/com.passculture.MainActivity"
    echo "Application is now starting on your device"
    adb shell am start -n "${app_and_activity}"
  fi
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

  die "Unknown platform ${APPCENTER_PLATFORM}"
}

run
