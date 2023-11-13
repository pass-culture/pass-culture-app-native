#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

yarn --silent test:deadcode >scripts/dead_code_current.txt

current_dead_code_count=$(wc -l <scripts/dead_code_current.txt)
snapshot_dead_code_count=$(wc -l <scripts/dead_code_snapshot.txt)
diff_dead_code_count=$((current_dead_code_count - snapshot_dead_code_count))

function display_differences_between_dead_code() {
    diff --color=auto --unified scripts/dead_code_snapshot.txt scripts/dead_code_current.txt
}

if [ "$diff_dead_code_count" -lt 0 ]; then
    echo "✅ The dead code has decreased:"
    display_differences_between_dead_code
    echo '👏 This means that you have deleted more dead code than you potentially introduced'
    echo '👀 Check that you have not introduced a new dead code'
    echo '⏺️ Please run `yarn test:deadcode:update`'
    echo 'More informations https://en.wikipedia.org/wiki/Software_testing#Output_comparison_testing'
    exit 1
elif [ "$diff_dead_code_count" -gt 0 ]; then
    echo "❌ The dead code has increased:"
    display_differences_between_dead_code
    echo '👀 If the increase of the dead code is legit and you tried to update the configuration of ts-prune to ignore it but it does not work 😣'
    echo '⏺️😥 Please run `yarn test:deadcode:update`'
    echo 'More informations https://en.wikipedia.org/wiki/Software_testing#Output_comparison_testing'
    exit 1
else
    echo "⬜ The dead code seems unchanged."
    display_differences_between_dead_code
fi
