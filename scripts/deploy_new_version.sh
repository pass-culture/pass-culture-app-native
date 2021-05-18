#!/usr/bin/env bash

set -e

./scripts/check_branch.sh
git pull

# $1 is the tag used to trigger the ci deployment (see .circleci/config.yml)
# $2 is upgrade level (major, minor or patch)
./scripts/update_app_version.sh "$1" "$2"
git push --follow-tags
