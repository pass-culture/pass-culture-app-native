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

VERSION=`json -f package.json version`

update_app_version(){
  yarn version --minor --no-git-tag-version

  BUILD_NUMBER="${VERSION//./0}"
  json -I -f package.json -e "this.build=$BUILD_NUMBER"

  git add package.json
  git commit -m "v${VERSION}"
  git tag -a "v${VERSION}" -m "v${VERSION}"
}


check_branch
git pull

git checkout -b MES-${VERSION}
update_app_version
git push --follow-tags

hub pull-request -m "Upgrade version to ${VERSION} for MES " -b master
hub pull-request -m "[Staging] MES ${VERSION}" -b staging --browse