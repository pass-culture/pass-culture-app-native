#!/bin/bash

set -e

yarn config set version-tag-prefix "testing_v"
yarn version --patch
yarn config set version-tag-prefix "v"
