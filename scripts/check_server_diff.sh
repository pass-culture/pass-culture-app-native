#!/usr/bin/env bash

set -e

check_server_diff() {
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  echo $CURRENT_BRANCH
  if [ "$CURRENT_BRANCH" != "master" ]; then
    echo "Require manual deploy"
    exit 0
  fi

  base_sha=$(curl -s -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/pass-culture/pass-culture-app-native/pulls?state=closed" | jq --arg sha "$CIRCLE_SHA1" -r '.[]|select(.merge_commit_sha == $sha).base.sha')
  filter='^(server)/'
  echo "Diff $base_sha..$CIRCLE_SHA1"

  if git diff --name-only "$base_sha..$CIRCLE_SHA1" | grep -E "$filter"; then
    echo "Running server deploy"
    exit 0
  else
    echo "Skipping server deploy"
    exit 1
  fi
}

check_server_diff
