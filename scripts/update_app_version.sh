#!/usr/bin/env bash

set -e

update_app_version(){
  yarn version --"$2" --no-git-tag-version

  VERSION=`json -f package.json version`

  # We have to increment the build number because it is used as the versionCode
  # in app/build.gradle: versionCode (packageJson.build as Integer) and the
  # Play Store requires this value to be strictly increasing. Otherwise, we get this error:

  # ERROR Google Api Error: forbidden: You cannot rollout this release because it does not allow
  # any existing users to upgrade to the newly added APKs.

  # As such, since the current version is 10136027 = 1 * 10_000_000 + 136 * 1_000 + 27, we build each new version
  # as the sum of:
  #  + 10_000_000 * MAJOR,
  #  + 1_000 * MINOR,
  #  + PATCH
  # where <VERSION> = <MAJOR>.<MINOR>.<PATCH> (ex: 1.137.3) as we use semantic versioning.

  # Examples:
  #   1.136.27 => 10 000 000 + 136 000 + 027 => 10136027
  #   1.137.1  => 10 000 000 + 137 000 + 001 => 10137001


  SEMVER=( ${VERSION//./ } )
  MAJOR=${SEMVER[0]}
  MINOR=${SEMVER[1]}
  PATCH=${SEMVER[2]}
  BUILD_NUMBER="$((10000000 * MAJOR + 1000 * MINOR + PATCH))"
  CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

  json -I -f package.json -e "this.build=$BUILD_NUMBER"

  git add package.json
  git commit -m "v${VERSION}"
  git tag -a "$1${VERSION}" -m "v${VERSION}"
  git push origin "$1${VERSION}"

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