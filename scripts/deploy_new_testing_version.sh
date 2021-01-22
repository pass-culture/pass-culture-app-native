#!/bin/bash

set -e

check_branch(){
  CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

  if [[ "$CURRENT_BRANCH" != "master" ]];
  then
    echo "Wrong branch, checkout master to deploy to testing"
    exit 1
  fi
}

check_branch

git pull

yarn config set version-tag-prefix "testing_v"
yarn version --patch
yarn config set version-tag-prefix "v"

git push --follow-tags