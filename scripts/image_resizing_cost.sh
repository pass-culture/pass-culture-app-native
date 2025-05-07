#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

GCP_LOGGIN_QUERY='
resource.labels.project_id="passculture-metier-prod"
resource.labels.target_proxy_name="image-resizing-https-proxy"
timestamp>="2025-04-30T17:00:00"
timestamp<"2025-04-30T18:00:00"
'
JQ_SUM_RESPONSE_SIZE='[.[].httpRequest.responseSize | select(. != null) | tonumber] | add'

FILE_OUTPUT="node_modules/image_resizing_request.json" # in node_modules just because it is ignored and we delete it often
# FILE_OUTPUT="node_modules/image_resizing_request_small.json" # in node_modules just because it is ignored and we delete it often
FILE_OUTPUT_COUNT="node_modules/image_resizing_request_count.json" # in node_modules just because it is ignored and we delete it often

# gcloud logging --project="passculture-metier-prod" read "$GCP_LOGGIN_QUERY" --format=json >"$FILE_OUTPUT"

rg '"responseSize": ' "$FILE_OUTPUT" |
    rg --only-matching '\d+' >"$FILE_OUTPUT_COUNT"

echo 'total responseSize'
awk '{ sum += $1 } END { print sum }' "$FILE_OUTPUT_COUNT"

echo 'line number'
wc -l "$FILE_OUTPUT_COUNT"

# j'ai plus de place sur ma machine, le fichier est tronqué ce qui ne plait pas à JQ
# jq "length" "$FILE_OUTPUT"
# jq "$JQ_SUM_RESPONSE_SIZE" "$FILE_OUTPUT"

# résultats
# logs allant de 2025-04-30T12:45:23.082944Z à 2025-04-30T23:59:59.971394Z
# gcloud récupère les logs depuis le récent vers l'ancien, et il n'y avait plus de place de stockage sur ma machine pour en récupérer plus

# total responseSize
# 507819290827
# line number
#  8201275 node_modules/image_resizing_request_count.json
