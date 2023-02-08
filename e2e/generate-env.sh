#!/usr/bin/env bash
# .env.local.secret generator
#

SCRIPT_DIR=$(dirname -- "$0")

ANDROID=${ANDROID:-"false"}
END_TO_END_TESTS_EMAIL_ADDRESS=${END_TO_END_TESTS_EMAIL_ADDRESS}
SENDINBLUE_API_KEY=${SENDINBLUE_API_KEY}

# shellcheck disable=SC2002
eval "$(cat "${SCRIPT_DIR}/.env.local.secret.tpl" | sed 's/^\(.*\)$/echo "\1"/')" > "${SCRIPT_DIR}/.env.local.secret"

