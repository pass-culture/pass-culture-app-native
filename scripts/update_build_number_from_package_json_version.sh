#!/usr/bin/env bash

set -e

update_build_number_from_package_json_version() {
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

  source ./scripts/get_version.sh
  SEMVER=(${VERSION//./ })
  MAJOR=${SEMVER[0]}
  MINOR=${SEMVER[1]}
  PATCH=${SEMVER[2]}
  BUILD_NUMBER="$((10000000 * MAJOR + 1000 * MINOR + PATCH))"
  yarn json --in-place -f package.json -e "this.build=$BUILD_NUMBER"
}

update_build_number_from_package_json_version
