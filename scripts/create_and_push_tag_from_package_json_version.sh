#!/usr/bin/env bash

set -e


create_and_push_tag_from_package_json_version(){
  VERSION=`yarn --silent json -f package.json version`
  git tag -a "$1${VERSION}" -m "v${VERSION}"
  git push origin "$1${VERSION}"
}


# $1 is the tag used to trigger the ci deployment (see .circleci/config.yml)

create_and_push_tag_from_package_json_version "$1"
