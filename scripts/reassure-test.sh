#!/usr/bin/env bash
set -e

# Test on branch PC-20631-dup
BASELINE_BRANCH=${BASELINE_BRANCH:="PC-20631-dup"}

# Required for `git switch` on CI
git fetch origin

# Gather baseline perf measurements
git switch "$BASELINE_BRANCH"
yarn add reassure --ignore-scripts
yarn install --force
yarn reassure --baseline

# Gather current perf measurements & compare results
git switch --detach -
yarn install --force
yarn reassure