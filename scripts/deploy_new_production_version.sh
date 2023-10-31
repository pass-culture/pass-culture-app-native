#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

error() {
  echo "$1"
  exit 1
}

[[ -z $(git status -s) ]] || error 'Please make sure you deploy with no changes or untracked files. You can run *git stash --include-untracked*.'

git checkout $1

git tag prod-hard-deploy-$1
git push origin prod-hard-deploy-$1
