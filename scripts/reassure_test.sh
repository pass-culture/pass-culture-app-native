#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

# Test on branch master as baseline
BASELINE_BRANCH=${BASELINE_BRANCH:="master"}

# Required for `git switch` on CI
git fetch origin

# Gather baseline perf measurements
git switch "$BASELINE_BRANCH"
yarn install --force
yarn test:perf --baseline

# Gather current perf measurements & compare results
git switch --detach -
yarn install --force
yarn test:perf