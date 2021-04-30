#!/bin/bash

set -e

check_branch(){
  CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

  if [[ "$CURRENT_BRANCH" != "master" ]];
  then
    echo "Wrong branch, checkout master to deploy"
    exit 1
  fi
}

check_branch
