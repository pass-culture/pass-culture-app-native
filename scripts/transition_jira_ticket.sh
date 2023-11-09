#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

JIRA_TICKET_ID=$(git log --oneline | head -1 | grep --only-matching --perl-regexp "PC-\d+" | head -1)
JIRA_TRANSITION_ID="81" # revue PM
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

[[ "$CURRENT_BRANCH" != "master" ]] && echo "Not on master branch, exiting" && exit 0

[[ -z "${JIRA_TICKET_ID}" ]] && echo "JIRA_TICKET_ID was not found, skipping Jira transition" && exit 0

curl -X POST \
  --url "https://passculture.atlassian.net/rest/api/3/issue/${JIRA_TICKET_ID}/transitions" \
  --user "${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  --data '{"transition":{"id":"'${JIRA_TRANSITION_ID}'"}}'
