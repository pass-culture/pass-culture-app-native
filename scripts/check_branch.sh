#!/usr/bin/env bash

set -e

check_branch() {
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  echo $CURRENT_BRANCH
  if [ "$CURRENT_BRANCH" != "master" ]; then
    read -p "Are you sure you want to deploy this branch? (Yy/Nn)" -n 1 -r
    echo # step a new line
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo "YOU ARE DEPLOYING $CURRENT_BRANCH"
    else
      echo "Deployment aborted, checkout master to deploy"
      exit 1
    fi
  else
    git pull
  fi
}

check_branch
