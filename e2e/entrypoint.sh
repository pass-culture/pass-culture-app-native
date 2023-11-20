#!/usr/bin/env bash

IS_DB_INITIALIZED=$(echo "select name from feature where name = 'ENABLE_UBBLE'" | pgcli -U postgres -h pc-postgres-e2e -d pass_culture | grep '| ENABLE_UBBLE |')

if [[ -z "$IS_DB_INITIALIZED" ]]; then
  flask install_postgres_extensions
  alembic upgrade pre@head
  alembic upgrade post@head
  flask install_data
  flask sandbox --name industrial
fi

if [[ $ANDROID = "false" ]]; then
  API_URL="http://127.0.0.1:${PORT}"
else
  # Android emulator use localhost for it's own interface, and 10.0.2.2 for localhost
  API_URL="http://10.0.2.2:${PORT}"
fi

API_URL=$API_URL exec python "$@"
