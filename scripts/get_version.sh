#!/usr/bin/env bash

set -e

VERSION=$(yarn run --silent json -f package.json version)
