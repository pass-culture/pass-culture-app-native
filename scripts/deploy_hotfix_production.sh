#!/bin/bash

set -e

VERSION=`json -f package.json version`
git tag -a "hotfix-v${VERSION}" -m "hotfix-v${VERSION}"

git push --follow-tags

hub pull-request -m "[Hotfix PROD] $1" -b production --browse