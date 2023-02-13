#!/usr/bin/env bash

set -e
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NO_COLOR='\033[0m'

PROJECT_DIR="$(dirname "${BASH_SOURCE[0]}")/.."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

. "${PROJECT_DIR}/scripts/upload_sourcemaps_to_sentry.sh"

invalid_option_val() {
  echo >&2 "Invalid option value \"$OPTARG\""
  print_usage
  exit 1
}

error() {
  echo -e "${RED}$1${NO_COLOR}" >&2
  exit 1
}

success() {
  echo -e "✅  ${GREEN}$1${NO_COLOR}"
}

warn() {
  echo -e "⚠️  ${YELLOW}$1${NO_COLOR}"

  if [ $DEV -eq 0 ]; then
    exit 1
  fi
}

print_usage() {
  echo "Usage : ./scripts/deploy [-e <env>] [-t hard|soft] [-o ios|android] [-h]

Options:
    -e               Environment to deploy, default staging
    -t               Deployment type for feature envs, default soft
    -o               OS to deploy, default ios and android
    -h               Display this usage
  "
}

DEV=0
APP_ENV="testing"
APP_OS="ios and android"

DEPLOY_TYPE="soft"

check_environment() {
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  CURRENT_TAG=$(git tag --points-at HEAD)

  # If we are not on master, we can still deploy if we have a valid tag
  # The CI jobs are based on a tag (not a branch)
  HARD_DEPLOY_TESTING_TAG_REGEX="(testing\/)?v[0-9]+(\.[0-9]+){2}"

  if [[ $CURRENT_TAG =~ fake....$HARD_DEPLOY_TESTING_TAG_REGEX ]]; then
    success "Not on master but tag found. Deploying to $APP_ENV."
  elif [[ "$APP_ENV" == "testing" && "$CURRENT_BRANCH" != "master" ]]; then
    if [[ $CURRENT_TAG =~ $HARD_DEPLOY_TESTING_TAG_REGEX ]]; then
      success "Not on master but tag found. Deploying to $APP_ENV."
    else
      warn "Wrong branch, checkout master or create tag to deploy to $APP_ENV."
    fi
  else
    success "Deploying to $APP_ENV."
  fi
}

check_dependency() {
  if ! which jq >/dev/null; then
    error "Please install jq at: https://stedolan.github.io/jq/download/"
    exit 1
  fi
}

while getopts ":e:o:t:h:d" opt; do
  case $opt in
  e) APP_ENV="$OPTARG" ;;
  o) if [[ $OPTARG =~ ^(ios|android)$ ]]; then APP_OS="$OPTARG"; else invalid_option_val; fi ;;
  t) if [[ $OPTARG =~ ^(hard|soft)$ ]]; then DEPLOY_TYPE="$OPTARG"; else invalid_option_val; fi ;;
  h)
    print_usage
    exit
    ;;
  d) DEV=1 ;;
  \?)
    error "Invalid option -$OPTARG"
    exit 1
    ;;
  esac
done

check_dependency

[[ -z $(git status -s --assume-unchanged ../.env.*) ]] || warn 'Please make sure you deploy with no changes or untracked files. You can run *git stash --include-untracked*.'

check_environment $APP_ENV

if [ "${DEPLOY_TYPE}" == "hard" ]; then
  echo -e "${BLUE}* * * * *"
  echo -e "👷  Hard-Deploy"
  echo -e "* * * * *${NO_COLOR}"
  if [[ "${APP_OS}" = "ios" ]]; then
    echo -e "${GREEN}- - - - -"
    echo -e "Fastlane 🍎  iOS $APP_ENV"
    echo -e "- - - - -${NO_COLOR}"
    bundle exec fastlane ios deploy --env "${APP_ENV}" --verbose
  fi
  if [[ "${APP_OS}" = "android" ]]; then
    echo -e "${YELLOW}- - - - -"
    echo "Fastlane 🤖  Android $APP_ENV"
    echo -e "- - - - -${NO_COLOR}"
    bundle exec fastlane android deploy --env "${APP_ENV}" --verbose
  fi

  upload_sourcemaps "${APP_OS}" "${APP_ENV}"
fi

if [ "${DEPLOY_TYPE}" == "soft" ]; then
  echo -e "${CYAN}* * * * *"
  echo -e "🍦  Soft-Deploy"
  echo -e "* * * * *${NO_COLOR}"

  if [[ "${APP_OS}" = "ios" ]]; then
    echo -e "${GREEN}- - - - -"
    echo -e "Codepush 🍎  iOS ${APP_ENV}"
    echo -e "- - - - -${NO_COLOR}"
    bundle exec fastlane ios deploy codepush: --env "${APP_ENV}"
  fi
  if [[ "${APP_OS}" = "android" ]]; then
    echo -e "${YELLOW}- - - - -"
    echo -e "Codepush 🤖  Android ${APP_ENV}"
    echo -e "- - - - -${NO_COLOR}"
    bundle exec fastlane android deploy codepush: --env "${APP_ENV}"
  fi
fi

success "📦  Deploy succeeded."
