#!/usr/bin/env bash

current_dead_code_count=$(yarn --silent prune:count)

git fetch origin
git switch master
master_dead_code_count=$(yarn --silent prune:count)

echo "$current_dead_code_count lines of dead code, $master_dead_code_count on master"

if [ "$current_dead_code_count" -gt "$master_dead_code_count" ];
then
echo "Error, you added dead code, please remove some."
exit 1
fi
