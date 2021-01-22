#!/bin/bash

set -e

check_branch(){
  CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

  if [[ "$CURRENT_BRANCH" != "master" ]];
  then
    echo "Wrong branch, checkout master to deploy to staging"
    exit 1
  fi
}

check_branch

git pull

yarn version --minor
git push --follow-tags

git push -f origin HEAD:staging
