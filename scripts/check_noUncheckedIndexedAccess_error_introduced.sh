#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

yarn --silent test:types:noUncheckedIndexedAccess >scripts/noUncheckedIndexedAccess_current.txt

current_count=$(wc -l <scripts/noUncheckedIndexedAccess_current.txt)
snapshot_count=$(wc -l <scripts/noUncheckedIndexedAccess_snapshot.txt)
diff_count=$((current_count - snapshot_count))

function display_snapshot_differences() {
    diff --color=auto --unified scripts/noUncheckedIndexedAccess_snapshot.txt scripts/noUncheckedIndexedAccess_current.txt
}

function how_to_update_snapshot() {
    echo '⏺️ Please run `yarn test:types:noUncheckedIndexedAccess:update`'
    echo 'More informations https://en.wikipedia.org/wiki/Software_testing#Output_comparison_testing'
}

if [ "$diff_count" -lt 0 ]; then
    echo "✅ The number of @ts-expect-error has decreased:"
    display_snapshot_differences || {
        echo '👏 This means that you have deleted more @ts-expect-error than you potentially introduced'
        echo '👀 Check that you have not introduced new @ts-expect-error'
        how_to_update_snapshot
        exit 1
    }
elif [ "$diff_count" -gt 0 ]; then
    echo "❌ The number of @ts-expect-error has increased:"
    display_snapshot_differences || {
        echo '📝 Please remove the new @ts-expect-error you introduced'
        exit 1
    }
else
    echo "⬜ The number of @ts-expect-error is unchanged"
    display_snapshot_differences || {
        echo '📝 Please remove the @ts-expect-error in the file you have changed'
        exit 1
    }
fi
