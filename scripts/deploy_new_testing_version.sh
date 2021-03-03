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

update_app_version(){
  yarn config set version-tag-prefix "testing_v"
  yarn version --patch
  yarn config set version-tag-prefix "v"

  VERSION=`json -f package.json version`
  BUILD_NUMBER="${VERSION//./0}"
  json -I -f package.json -e "this.build=$BUILD_NUMBER"
}


check_branch

git pull

update_app_version

git push --follow-tags