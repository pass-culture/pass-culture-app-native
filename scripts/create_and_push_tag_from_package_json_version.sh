#!/usr/bin/env bash

set -e

create_and_push_tag_from_package_json_version() {
  TAG_PREFIX="$1"
  source ./scripts/get_version.sh
  git tag --annotate "${TAG_PREFIX}${VERSION}" --message "v${VERSION}"
  git push origin "${TAG_PREFIX}${VERSION}"
}

# $1 is the tag used to trigger the ci deployment (see .circleci/config.yml)

create_and_push_tag_from_package_json_version "$1"
