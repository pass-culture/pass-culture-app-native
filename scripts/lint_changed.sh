#!/usr/bin/env bash

CHANGED_FILES=$(
  (git diff --name-only origin/master... ;
   git diff --name-only ;
   git ls-files --others --exclude-standard) |
  sort -u |
  grep '^src/' |
  grep -E '\.(js|ts|tsx|mjs)$'
)

if [ -n "$CHANGED_FILES" ]; then
  echo "$CHANGED_FILES"
  yarn eslint $CHANGED_FILES
fi