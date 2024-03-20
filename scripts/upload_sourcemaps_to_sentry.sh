#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

SOURCEMAPS_DIR="sourcemaps"

create_sourcemaps() {
  APP_OS="$1"
  SOURCEMAPS_NAME="$2"

  echo "Creating sources maps... "
  mkdir -p "${SOURCEMAPS_DIR}"

  if [[ "$(uname -s)" = "Linux" ]]; then
    HERMES_OS_BIN="linux64-bin"
  else
    HERMES_OS_BIN="osx-bin"
  fi

  HERMES_BIN="node_modules/react-native/sdks/hermesc/${HERMES_OS_BIN}/hermesc"

  if [[ "${APP_OS}" = "android" ]]; then
    npx react-native bundle \
      --platform "${APP_OS}" \
      --dev false \
      --minify false \
      --reset-cache \
      --entry-file index.js \
      --bundle-output "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}" \
      --sourcemap-output "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}.packager.map"

    "${HERMES_BIN}" \
      -O \
      -emit-binary \
      -output-source-map \
      -out="${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}.hbc" \
      "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}"
    rm -f "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}"
    mv "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}.hbc" "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}"

    node node_modules/react-native/scripts/compose-source-maps.js \
      "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}.packager.map" \
      "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}.hbc.map" \
      -o "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}.map"

  else
    npx react-native bundle \
      --platform "${APP_OS}" \
      --dev false \
      --minify false \
      --reset-cache \
      --entry-file index.js \
      --bundle-output "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}" \
      --sourcemap-output "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}.map"
  fi
}

upload_sourcemaps() {
  APP_OS="$1"
  APP_ENV="$2"
  VERSION=$(jq -r .version package.json)
  BUILD=$(jq -r .build package.json)
  BUNDLE_FILE_NAME="${BUNDLE_FILE_NAME:-}"

  echo "APP_OS: ${APP_OS}"
  echo "APP_ENV: ${APP_ENV}"
  echo "VERSION: $VERSION"
  echo "BUILD: $BUILD"

  if [[ "${APP_OS}" = "android" ]]; then
    SOURCEMAPS_NAME="index.android.bundle"
  else
    SOURCEMAPS_NAME="main.jsbundle"
  fi

  create_sourcemaps "${APP_OS}" "${SOURCEMAPS_NAME}"

  echo "✅ Successfully created sources maps"

  echo "Uploading ${APP_OS} source maps... "

  RELEASE="${VERSION}-${APP_OS}"
  DIST="${BUILD}-${APP_OS}"
  echo "RELEASE: ${RELEASE}"
  echo "DIST: ${DIST}"

  node_modules/@sentry/cli/bin/sentry-cli releases files "${RELEASE}" \
    upload-sourcemaps \
    --dist "${DIST}" \
    --strip-prefix "${PWD}" \
    "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}" "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}.map"

  echo "✅ Successfully uploaded sources maps"
}
