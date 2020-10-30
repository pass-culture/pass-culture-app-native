#!/bin/bash

set -e

check_branch(){
  CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

  if [[ "$CURRENT_BRANCH" != "master" ]];
  then
    warn "Wrong branch, checkout master to deploy to staging"
  fi
}

check_branch

yarn version --minor
git push --follow-tags

git push -f origin HEAD:staging
