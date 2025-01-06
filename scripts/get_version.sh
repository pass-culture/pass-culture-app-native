#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

VERSION=$(node -p "require('./package.json').version")