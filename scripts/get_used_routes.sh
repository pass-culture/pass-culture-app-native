#!/bin/bash

# The path to the TypeScript file
FILE_PATH="src/api/gen/api.ts"

# The root directory of your project to search within
PROJECT_DIR="src"

# Start and end flags to capture the function block
START_FLAG="const DefaultApiFetchParamCreator"
END_FLAG="^}$"

REGEX='async ([^ ]*)\(.*'
REGEX_PATHNAME='const pathname = `([^`]*)`'



# Use awk to extract the block of code that defines DefaultApiFetchParamCreator
function_names=$(awk "/${START_FLAG}/,/${END_FLAG}/{print}" $FILE_PATH |
    # Use grep to filter lines that likely define functions within the block
    grep -o -E "${REGEX}" |
    # Use sed to clean up the lines to only have function names
    sed -E "s/${REGEX}/\1/")

echo "" > used_routes.txt
echo "" > unused_routes.txt

# Loop through each function name
echo "$function_names" | while read -r function_name; do
    # Search for the function name within the project directory
    if grep -qr --exclude="api.ts" "$function_name" "$PROJECT_DIR"; then
        function_body=$(awk "/async ${function_name}\(/,/^    },$/" $FILE_PATH)
        if echo "$function_body" | grep -q -E "$REGEX_PATHNAME"; then
            pathname=$(echo "$function_body" | grep -o -E "$REGEX_PATHNAME" | sed -E "s/$REGEX_PATHNAME/\1/")
            echo "$pathname" >> used_routes.txt
        else
            echo "Pathname not found for $function_name">> used_routes.txt
        fi
    else
        function_body=$(awk "/async ${function_name}\(/,/^    },$/" $FILE_PATH)
        if echo "$function_body" | grep -q -E "$REGEX_PATHNAME"; then
            pathname=$(echo "$function_body" | grep -o -E "$REGEX_PATHNAME" | sed -E "s/$REGEX_PATHNAME/\1/")
            echo "$pathname" >> unused_routes.txt
        else
            echo "Pathname not found for $function_name" >> unused_routes.txt
        fi
    fi
done

