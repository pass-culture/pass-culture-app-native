#!/usr/bin/env bash

set -e

SOURCEMAPS_DIR="sourcemaps"

create_sourcemaps(){
  APP_OS="$1"
  SOURCEMAPS_NAME="$2"

  if [[ "$(uname -s)" = "Linux" ]]; then
    HERMES_BIN="linux64-bin"
  else
    HERMES_BIN="osx-bin"
  fi

  npx react-native bundle \
    --platform "${APP_OS}" \
    --dev false \
    --entry-file index.js \
    --bundle-output "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}" \
    --sourcemap-output "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}.packager.map"

  node_modules/hermes-engine/${HERMES_BIN}/hermesc \
    -O \
    -emit-binary \
    -output-source-map \
    -out="${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}.hbc" \
    "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}"

  node node_modules/react-native/scripts/compose-source-maps.js \
    "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}.packager.map" \
    "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}.hbc.map" \
    -o "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}.map"
}

upload_sourcemaps(){
  APP_OS="$1"
  APP_ENV="$2"
  CODE_PUSH_LABEL="$3"
  VERSION=`jq -r .version package.json`
  BUILD=`jq -r .build package.json`

  echo "APP_OS: $APP_OS"
  echo "APP_ENV: $APP_ENV"
  if [[ -n "$CODE_PUSH_LABEL" ]]; then
    echo "CODE_PUSH_LABEL: $CODE_PUSH_LABEL"
  fi
  echo "VERSION: $VERSION"
  echo "BUILD: $BUILD"

  echo "Creating sources maps... "
  mkdir -p "${SOURCEMAPS_DIR}"


  if [[ "${APP_OS}" = "android" ]]; then
    SOURCEMAPS_NAME="index.android.bundle"
  else
    SOURCEMAPS_NAME="main.jsbundle"
  fi

  create_sourcemaps "${APP_OS}" "${SOURCEMAPS_NAME}"

  echo "✅ Successfully created sources maps"

  echo "Uploading ${APP_OS} source maps... "

  if [[ -n "$CODE_PUSH_LABEL" ]]; then
    RELEASE="$VERSION-${APP_OS}+codepush:${CODE_PUSH_LABEL}"
  else
    RELEASE="$VERSION-${APP_OS}"
  fi


  DIST="${BUILD}-${APP_OS}"
  echo "RELEASE: $RELEASE"
  echo "DIST: $DIST"

  node_modules/@sentry/cli/bin/sentry-cli releases files "${RELEASE}" \
    upload-sourcemaps \
    --dist "${DIST}" \
    --strip-prefix "${PWD}" \
    --rewrite "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}" "${SOURCEMAPS_DIR}/${SOURCEMAPS_NAME}.map"

  echo "✅ Successfully uploaded sources maps"
}

