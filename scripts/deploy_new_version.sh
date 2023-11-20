#!/usr/bin/env bash

set -e

./scripts/check_branch.sh

# $1 is the tag used to trigger the ci deployment (see .circleci/config.yml)
# $2 is upgrade level (major, minor or patch)

if [ "$1" = "patch/v" ]; then
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [ "$CURRENT_BRANCH" == "master" ]; then
        echo # step a new line
        echo "It seems you are deploying master to patch staging"
        echo
        echo "You should be checking out the staging tag already released: git checkout <your_tag> (either v1.X.Y or patch/v1.X.Y)"
        echo
        echo "Then cherry-pick the commits you need for your patch, and run yarn trigger:staging:deploy:patch"
        echo
        echo "Aborting deployment"
        echo
        exit 1
    fi
fi

./scripts/update_app_version.sh "$1" "$2"
