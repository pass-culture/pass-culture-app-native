#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

QUERY="
def pad(n): 
  tostring + (\" \" * (n - (tostring | length)));

[.[].messages[] 
  | select(.severity == 1) 
  | select(.ruleId != null) 
  | .ruleId]
  | reduce .[] as \$rule ({}; .[\$rule] += 1)
  | to_entries
  | sort_by(-.value)
  | .[]
  | \"| \(.key + \" \" * (50 - (.key | length))) | \(.value | pad(6)) |\"
"

echo 'ESLint Warnings Summary'
echo '======================='
echo ''
echo '| Rule                                               | Count  |'
echo '|----------------------------------------------------|--------|'
yarn eslint . --format json --cache |
  jq --raw-output "$QUERY"
