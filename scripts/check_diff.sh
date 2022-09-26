#!/usr/bin/env bash

set -e

check_diff() {
  base_sha=$(curl -s -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/pass-culture/pass-culture-app-native/pulls?state=closed" | jq --arg sha "$CIRCLE_SHA1" -r '.[]|select(.merge_commit_sha == $sha).base.sha')
  filter='^(src|web|public|.circleci)/'
  echo "Diff $base_sha..$CIRCLE_SHA1"

  if git diff --name-only "$base_sha..$CIRCLE_SHA1" | grep -E -v "$filter"; then
    echo "Running build hard"
    exit 0
  else
    echo "Skipping build hard"
    exit 1
  fi
}

check_diff
