#!/bin/bash

set -e

check_branch(){
  CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

  if [[ "$CURRENT_BRANCH" != "master" ]];
  then
    echo "Wrong branch, checkout master to upload source maps"
    exit 1
  fi
}

create_sourcemaps_android(){
  npx react-native bundle \
    --platform android \
    --entry-file index.js \
    --dev false \
    --bundle-output sourcemaps/index.android.bundle \
    --sourcemap-output sourcemaps/index.android.bundle.map
}

create_sourcemaps_ios(){
  npx react-native bundle \
    --platform ios \
    --entry-file index.js \
    --dev false \
    --bundle-output sourcemaps/main.jsbundle \
    --sourcemap-output sourcemaps/main.jsbundle.map
}

upload_sourcemaps(){
  VERSION=`jq -r .version package.json`
  DIST="${VERSION//./0}"

  node_modules/@sentry/cli/bin/sentry-cli releases files $VERSION \
    upload-sourcemaps sourcemaps \
    --dist $DIST \
    --url-prefix "app:///" \
    --no-rewrite # or rewrite
}


check_branch

mkdir -p sourcemaps

echo "Creating source maps... "
create_sourcemaps_android
create_sourcemaps_ios
echo "✅ Successfully created source maps"

echo "Uploading source maps... "
upload_sourcemaps
echo "✅ Successfully uploaded source maps"
