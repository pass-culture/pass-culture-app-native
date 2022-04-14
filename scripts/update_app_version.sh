#!/usr/bin/env bash

set -e

update_app_version(){
  yarn version --"$2" --no-git-tag-version

  VERSION=`json -f package.json version`
  .scripts/update_build_number_from_package_json_version
  git add package.json

  git commit -m "v${VERSION}"
  ./scripts/create_and_push_tag_from_package_json_version.sh "$1"

  CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`
  if [ "$CURRENT_BRANCH" = "master" ]
  then
    git push
  fi
}

check_hard_hotfix_integrity(){
  CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`
  echo $CURRENT_BRANCH
  if [ "$CURRENT_BRANCH" != "master" ];
  then
    read -p "Do not forget to cherry-pick your bump version commit to master" -n 1 -r
    echo    # step a new line
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
       echo "Thanks"
    else
     echo "Why not? :("
     exit 1
    fi
  fi
}

# $1 is the tag used to trigger the ci deployment (see .circleci/config.yml)
# $2 is upgrade level (major, minor or patch)
update_app_version "$1" "$2"

check_hard_hotfix_integrity