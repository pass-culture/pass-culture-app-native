#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

VERSION=$(node --print "require('./package.json').version")