#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

error() {
  echo -e "\e[1;31m$1\e[0m"  # display message in red + bold and resets to normal
  exit 1
}

[[ -z $(git status -s) ]] || error 'Please make sure you deploy with no changes or untracked files. You can run *git stash --include-untracked*.'

git checkout "$1"

git tag "prod-hard-deploy-$1"
git push origin "prod-hard-deploy-$1" --no-verify
