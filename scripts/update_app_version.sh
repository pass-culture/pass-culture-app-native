#!/bin/bash

set -e

update_app_version(){  
  yarn version --"$2" --no-git-tag-version    

  VERSION=`json -f package.json version`

  BUILD_NUMBER="${VERSION//./0}"
  json -I -f package.json -e "this.build=$BUILD_NUMBER"

  git add package.json
  git commit -m "v${VERSION}"
  git tag -a "$1${VERSION}" -m "v${VERSION}"
}

# $1 is the tag used to trigger the ci deployment (see .circleci/config.yml)
# $2 is upgrade level (major, minor or patch)
update_app_version "$1" "$2"
