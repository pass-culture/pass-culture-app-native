#!/usr/bin/env bash

set -e

# When releasing a staging minor, all we do is getting the version from
# the package.json and pushing the corresponding tag to trigger the CI.

./scripts/check_branch.sh

./scripts/create_and_push_tag_from_package_json_version.sh "v"
