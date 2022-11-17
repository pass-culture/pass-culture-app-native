#!/usr/bin/env bash

set -e

GREEN="\033[0;32m"
NC="\033[0m"
INSTALL_DIRECTORY="e2e/tests/wdio-demo"

GITHUB_REPOSITORY="https://github.com/webdriverio/appium-boilerplate"

function fix() {
  echo "Fixing lint"
  # There is an unlikely bug with eslint --fix
  yarn e2e:lint --fix || echo -e "${GREEN}Fixing ${NC}lint error and retry lint"
  # --fix just break a file so we fix it
  sed -i'.original' -e "s/^  ) {//g" "${INSTALL_DIRECTORY}/tests/helpers/Gestures.ts"
  rm "${INSTALL_DIRECTORY}/tests/helpers/Gestures.ts.original"
  # and fix lint again
  yarn e2e:lint --fix

  echo "Applying fix for https://github.com/webdriverio/appium-boilerplate/pull/143"
  sed -i'.original' -e "s/return driver.getContexts()/return driver.getContexts() as Promise<string[]>/g" "${INSTALL_DIRECTORY}/tests/helpers/WebView.ts"
  rm "${INSTALL_DIRECTORY}/tests/helpers/WebView.ts.original"
}

function run() {
  rm -rf "${INSTALL_DIRECTORY}"
  git clone \
    --depth 1 \
    --filter=blob:none \
    --no-checkout \
    "${GITHUB_REPOSITORY}" \
    "${INSTALL_DIRECTORY}"
  git -C "${INSTALL_DIRECTORY}" checkout main -- tests
}

run
fix
echo -e "${GREEN}wdio-demo ${NC}e2e tests successfully installed in ${INSTALL_DIRECTORY} directory."
