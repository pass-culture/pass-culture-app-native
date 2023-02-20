#!/usr/bin/env bash

set -e

update_app_version() {
    yarn version --new-version "$2" --no-git-tag-version

    source ./scripts/get_version.sh
    ./scripts/update_build_number_from_package_json_version.sh
    git add package.json

    git commit -m "v${VERSION}"
    ./scripts/create_and_push_tag_from_package_json_version.sh "$1"
}

## $1 : Numéro de version
update_app_version "fake/v" "$1"
