#!/usr/bin/env bash

set -e

VERSION=$(yarn --silent json -f package.json version)
