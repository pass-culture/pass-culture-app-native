#!/usr/bin/env bash

OUTPUT=$(yarn --silent prune:count);
MAX_DEAD_CODE_LINES="20";

echo "$OUTPUT lines remaining, maximum set to $MAX_DEAD_CODE_LINES"

if [ "$OUTPUT" -gt "$MAX_DEAD_CODE_LINES" ];
then
echo "Error, you added dead code, please remove some."
exit 1
fi
