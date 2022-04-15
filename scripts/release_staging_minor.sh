#!/usr/bin/env bash

set -e

# When releasing a staging minor, we get the current minor from the package.json, 
# set the patch back to 0 then push the tag.

# définir une fonction qui parse la version pour la ramener à un patch égal à 0 dans le package.json
# idem pour le build

# ./scripts/check_branch.sh

# $1 is the tag used to trigger the ci deployment (see .circleci/config.yml)
# $2 is upgrade level (major, minor or patch)


reset_patch_number_in_package_json(){
    VERSION=`yarn --silent json -f package.json version`
    SEMVER=( ${VERSION//./ } )
    MAJOR=${SEMVER[0]}
    MINOR=${SEMVER[1]}
    NEW_VERSION="$MAJOR.$MINOR.0"
    yarn --silent json -I -f package.json -e "this.version='$NEW_VERSION'"
    ./scripts/update_build_number_from_package_json_version.sh
}

./scripts/check_branch.sh

reset_patch_number_in_package_json
git add package.json
VERSION=`yarn --silent json -f package.json version`
git commit -m "v${VERSION}"
./scripts/create_and_push_tag_from_package_json_version.sh "v"

