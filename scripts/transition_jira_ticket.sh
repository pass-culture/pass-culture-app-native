#!/usr/bin/env bash

JIRA_TICKET_ID=$(git log --oneline | head -1 | grep -oP "PC-\d+" | head -1)
JIRA_TRANSITION_ID="81" # revue PM
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

[[ "$CURRENT_BRANCH" != "master" ]] && echo "Not on master branch, exiting" && exit 0

[[ -z "${JIRA_TICKET_ID}" ]] && echo "JIRA_TICKET_ID was not found, skipping Jira transition" && exit 0

curl -X POST \
  --url "https://passculture.atlassian.net/rest/api/3/issue/${JIRA_TICKET_ID}/transitions" \
  -u "${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"transition":{"id":"'${JIRA_TRANSITION_ID}'"}}'
