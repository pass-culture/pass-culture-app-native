#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

if [ "$#" -lt 3 ]; then
  echo "Not enough arguments supplied. Please provide platform ('ios', 'android', or 'web') and environment ('testing' or 'staging')."
  exit 1
else
  target=$1
  platform=$2
  env=$3

  if [[ "$target" != "cloud" && "$target" != "test" ]]; then
    echo "Invalid target: $target. Please provide either 'cloud' or 'test'."
    exit 1
  elif [[ "$platform" != "ios" && "$platform" != "android" && "$platform" != "web" ]]; then
    echo "Invalid platform: $platform. Please provide either 'ios', 'android', or 'web'."
    exit 1
  elif [[ "$env" != "testing" && "$env" != "staging" ]]; then
    echo "Invalid environment: $env. Please provide either 'testing' or 'staging'."
    exit 1
  fi
fi

parse_env_variable () {
  test line
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

case "$target" in
  "test")
    TAGS="--include-tags local"
    run_tracking_tests=true
    run_cloud_commands=false
    cloud_arguments=""
    ;;

  "cloud")
    if [ "$platform" = "ios" ]; then
      TAGS="--include-tags nightlyIOS"
    else
      TAGS="--include-tags nightlyAndroid"
    fi
    run_tracking_tests=false
    run_cloud_commands=true
    api_key=$(parse_env_variable ROBIN_API_KEY .maestro/.env.secret)
    project_id=$(parse_env_variable ROBIN_PROJECT_ID .maestro/.env.secret)
    cloud_arguments="--api-key=$api_key --project-id=$project_id --flows .maestro/tests/ --device-locale fr_FR --android-api-level 34 --timeout 120"
    ;;
esac

if [ "$#" -eq 3 ]; then
  rest_of_arguments=""
else
  shift
  shift
  shift
  rest_of_arguments="$*"
fi

METRO_SERVER_PORT=8081
MOCK_ANALYTICS_SERVER_PORT=4001

if [ "$platform" = "ios" ]; then
  app_id=$(parse_env_variable IOS_APP_ID ".env.$env")
  echo "Running iOS tests on $env environment with app id: $app_id"
elif [ "$platform" = "android" ]; then
  app_id=$(parse_env_variable ANDROID_APP_ID ".env.$env")
  echo "Running Android tests on $env environment with app id: $app_id"
  if [ "$target" == "test" ]; then
    adb reverse "tcp:${METRO_SERVER_PORT}" "tcp:${METRO_SERVER_PORT}"
    adb reverse "tcp:${MOCK_ANALYTICS_SERVER_PORT}" "tcp:${MOCK_ANALYTICS_SERVER_PORT}"
  fi
elif [ "$platform" = "web" ]; then
  app_id=$(parse_env_variable APP_PUBLIC_URL ".env.$env")
  echo "Running Web tests on $env environment with app id: $app_id"
fi

if adb shell pm list packages | grep "app.passculture.webapp"; then
  echo "Prod app is installed."
  app_installed="true"
else
  echo "Prod app isn't installed."
  app_installed="false"
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

if [ "$target" == "test" ]; then
  stop_mock_analytics_server
  start_mock_analytics_server_silently_in_the_background
fi
ts-node --compilerOptions '{"module": "commonjs"}' ./scripts/enableNativeAppRecaptcha.ts "$env" false
# shellcheck disable=SC2086
maestro "$target" \
  --env MAESTRO_APP_ID="$app_id" \
  --env MAESTRO_VALID_IOS_EMAIL="dev-tests-e2e-ios@passculture.team" \
  --env MAESTRO_VALID_ANDROID_EMAIL="dev-tests-e2e-android@passculture.team" \
  --env MAESTRO_INVALID_EMAIL="dev-tests-e2e-invalid@passculture.team" \
  --env MAESTRO_UNREGISTERED_EMAIL="dev-tests-unregistered+e2e@passculture.team" \
  --env MAESTRO_MOCK_ANALYTICS_SERVER="http://localhost:$MOCK_ANALYTICS_SERVER_PORT" \
  --env MAESTRO_NUMBER_PHONE="0607080910" \
  --env MAESTRO_PASSWORD="$password" \
  --env MAESTRO_RUN_TRACKING_TESTS="$run_tracking_tests" \
  --env MAESTRO_RUN_CLOUD_COMMANDS="$run_cloud_commands" \
  --env MAESTRO_APP_INSTALLED="$app_installed" \
  $TAGS \
  $cloud_arguments \
  $rest_of_arguments
ts-node --compilerOptions '{"module": "commonjs"}' ./scripts/enableNativeAppRecaptcha.ts "$env" true
if [ "$target" == "test" ]; then
  stop_mock_analytics_server
fi
