#!/usr/bin/env bash
set -e

print_usage() {
  echo "Usage : ./scripts/print_project_version.sh <path_to_project_root_dir>" >&2
}

if [ "$#" -ne 1 ]; then
  echo "One argument should be provided" >&2
  print_usage
  exit 1
fi

VERSION=$(jq -r '.version' "${1}/package.json")
BUILD=$(jq -r '.build' "${1}/package.json")

echo "VERSION=$VERSION" >>"${1}/ios/react-native-config.xcconfig"
echo "BUILD=$BUILD" >>"${1}/ios/react-native-config.xcconfig"

exit 0
