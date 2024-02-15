#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

if [ "$#" -lt 2 ]; then
  echo "Not enough arguments supplied. Please provide platform ('ios', 'android', or 'web) and environment ('testing' or 'staging')."
  exit 1
elif [[ $1 != "ios" && $1 != "android" && $1 != "web" ]]; then
  echo "Invalid platform: $1. Please provide either 'ios', 'android', or 'web'."
  exit 1
elif [[ $2 != "testing" && $2 != "staging" ]]; then
  echo "Invalid environment: $2. Please provide either 'testing' or 'staging'."
  exit 1
fi

platform=$1
env=$2
if [ "$#" -eq 2 ]; then
  rest_of_arguments=".maestro/tests"
else
  shift
  shift
  rest_of_arguments="$*"
fi

parse_env_variable () {
  local line
  line=$(grep -E "$1=" "$2")
  if [[ $line =~ \'(.*)\' ]]; then
    echo "${BASH_REMATCH[1]}"
  elif [[ $line =~ \=(.*) ]]; then
    echo "${BASH_REMATCH[1]}"
  else
    echo "Error: the key \"$1\" was not found in $2" >&2
    exit 1
  fi
}

METRO_SERVER_PORT=8081
MOCK_ANALYTICS_SERVER_PORT=4001

if [ "$platform" = "ios" ]; then
  app_id=$(parse_env_variable IOS_APP_ID ".env.$env")
  echo "Running iOS tests on $env environment with app id: $app_id"
elif [ "$platform" = "android" ]; then
  app_id=$(parse_env_variable ANDROID_APP_ID ".env.$env")
  echo "Running Android tests on $env environment with app id: $app_id"
  adb reverse "tcp:${METRO_SERVER_PORT}" "tcp:${METRO_SERVER_PORT}"
  adb reverse "tcp:${MOCK_ANALYTICS_SERVER_PORT}" "tcp:${MOCK_ANALYTICS_SERVER_PORT}"
elif [ "$platform" = "web" ]; then
  app_id=$(parse_env_variable APP_PUBLIC_URL ".env.$env")
  echo "Running Web tests on $env environment with app id: $app_id"
fi

start_mock_analytics_server() {
  pushd .maestro/mock_analytics_server
  yarn install
  PORT="$MOCK_ANALYTICS_SERVER_PORT" yarn start
}

start_mock_analytics_server_silently_in_the_background() {
  start_mock_analytics_server &>/dev/null &
}

stop_mock_analytics_server() {
  MOCK_ANALYTICS_SERVER_PID=$(lsof -ti ":$MOCK_ANALYTICS_SERVER_PORT" || true)
  if [ -n "$MOCK_ANALYTICS_SERVER_PID" ]; then
    kill -s INT "$MOCK_ANALYTICS_SERVER_PID"
  fi
}

password=$(parse_env_variable PASSWORD .maestro/.env.secret)

stop_mock_analytics_server
start_mock_analytics_server_silently_in_the_background
ts-node --compilerOptions '{"module": "commonjs"}' ./scripts/enableNativeAppRecaptcha.ts "$env" false
# shellcheck disable=SC2086
maestro test \
  --env MAESTRO_APP_ID="$app_id" \
  --env MAESTRO_USERNAME="dev-tests-e2e@passculture.team" \
  --env MAESTRO_USERNAME_UNKNOWN="dev-tests-e2e-unknown@passculture.team" \
  --env MAESTRO_NEW_USERNAME="dev-tests-e2e-new@passculture.team" \
  --env MAESTRO_NUMBER_PHONE="0607080910" \
  --env MAESTRO_PASSWORD="$password" \
  --env MAESTRO_PHYSICAL_OFFER="OPSIS - 1 MOIS" \
  --env MAESTRO_EVENT_OFFER="Jeu de piste : le cambrioleur de la butte Montmartre" \
  --env MAESTRO_MESSAGE_CODE_VALIDATION_TELEPHONE="Code de validation du telephone" \
  --env MAESTRO_MOCK_ANALYTICS_SERVER="http://localhost:$MOCK_ANALYTICS_SERVER_PORT" \
  $rest_of_arguments
ts-node --compilerOptions '{"module": "commonjs"}' ./scripts/enableNativeAppRecaptcha.ts "$env" true
stop_mock_analytics_server
