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

update_app_version(){
  yarn config set version-commit-hooks false
  yarn version --minor --no-git-tag-version

  VERSION=`json -f package.json version`
  BUILD_NUMBER="${VERSION//./0}"
  json -I -f package.json -e "this.build=$BUILD_NUMBER"

  git add package.json
  git commit -m "v${VERSION}"
  git tag -a "staging_v${VERSION}" -m "v${VERSION}"
}

check_branch

git pull

update_app_version
git push --follow-tags

git push -f origin HEAD:staging
