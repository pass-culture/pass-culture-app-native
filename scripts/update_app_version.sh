#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

update_app_version() {
  yarn version "$2"
  cd server
  yarn version "$2"
  cd ..

  source ./scripts/get_version.sh
  ./scripts/update_build_number_from_package_json_version.sh
  git add package.json
  git add server/package.json

  git commit -m "v${VERSION}"
  ./scripts/create_and_push_tag_from_package_json_version.sh "$1"

  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  if [ "$CURRENT_BRANCH" = "master" ]; then
    git push
  fi
}

# $1 is the tag used to trigger the ci deployment (see .circleci/config.yml)
# $2 is upgrade level (major, minor or patch)
update_app_version "$1" "$2"
