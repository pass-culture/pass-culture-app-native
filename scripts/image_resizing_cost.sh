#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

GCP_LOGGIN_QUERY='
resource.labels.project_id="passculture-metier-prod"
resource.labels.target_proxy_name="image-resizing-https-proxy"
timestamp>="2025-04-30T17:00:00"
timestamp<"2025-04-30T18:00:00"
'
JQ_SUM_RESPONSE_SIZE='[.[].httpRequest.responseSize | select(. != null) | tonumber] | add'

FILE_OUTPUT="node_modules/image_resizing_request_small.json" # in node_modules just because it is ignored and we delete it often

gcloud logging --project="passculture-metier-prod" read "$GCP_LOGGIN_QUERY" --format=json >"$FILE_OUTPUT"

jq "length" "$FILE_OUTPUT"
jq "$JQ_SUM_RESPONSE_SIZE" "$FILE_OUTPUT"
