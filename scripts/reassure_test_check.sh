#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

REASSURE_FILE=.reassure/output.json

render_count_changes=$(jq '[.countChanged[] | select(.countDiff > 0)] | length' $REASSURE_FILE)

if [ "$render_count_changes" -gt 0 ]; then
  echo "Error: number of renders increased for $render_count_changes test(s). Please check the following test(s):"
  jq '[.countChanged[] | select(.countDiff > 0)] | .[].name' $REASSURE_FILE
  exit 1
fi
