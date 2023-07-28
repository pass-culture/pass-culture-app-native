#!/usr/bin/env bash

last_common_commit=$(git merge-base origin/master @)
git switch --detach $last_common_commit
yarn --silent prune:scan > scripts/dead_code_master.txt
git switch -
yarn --silent prune:scan > scripts/dead_code_current.txt

current_dead_code_count=$(wc -l < scripts/dead_code_current.txt)

master_dead_code_count=$(wc -l < scripts/dead_code_master.txt)

diff_dead_code_count=$((current_dead_code_count - master_dead_code_count))

function display_differences_between_dead_code() {
    diff --color=auto --unified scripts/dead_code_master.txt scripts/dead_code_current.txt
}

if [ "$diff_dead_code_count" -lt 0 ]; then
    echo "✅ Le code mort a diminué :"
    display_differences_between_dead_code
elif [ "$diff_dead_code_count" -gt 0 ]; then
    echo "❌ Le code mort a augmenté :"
    display_differences_between_dead_code
    exit 1
else
    echo "⬜ Le code mort semble inchangé."
    display_differences_between_dead_code
fi
