#!/bin/bash

# The path to the TypeScript file
FILE_PATH="src/api/gen/api.ts"

# The root directory of your project to search within
PROJECT_DIR="src"

# Start and end flags to capture the function block
START_FLAG="const DefaultApiFetchParamCreator"
END_FLAG="^}$"

REGEX='async ([^ ]*)\(.*'
REGEX_PATHNAME='let pathname = `([^`]*)`'



# Use awk to extract the block of code that defines DefaultApiFetchParamCreator
function_names=$(awk "/${START_FLAG}/,/${END_FLAG}/{print}" $FILE_PATH |
    # Use grep to filter lines that likely define functions within the block
    grep -o -E "${REGEX}" |
    # Use sed to clean up the lines to only have function names
    sed -E "s/${REGEX}/\1/")

# rm used_routes.txt 2>/dev/null
# rm unused_routes.txt 2>/dev/null

write_path_to_file () {
    function_body=$(awk "/async ${function_name}\(/,/^    },$/" $FILE_PATH)
    pathname=$(echo "$function_body" | grep -o -E "$REGEX_PATHNAME" | sed -E "s/$REGEX_PATHNAME/\1/")
    filename=$1
    echo "$pathname"
    if echo "$function_body" | grep -q -E "$REGEX_PATHNAME"; then
        echo "$pathname" >> $filename
    else
        echo "Pathname not found for $function_name">> $filename
    fi
}

# Loop through each function name
echo "$function_names" | while read -r function_name; do
    # Search for the function name within the project directory
    if grep -qr --exclude="api.ts" "$function_name" "$PROJECT_DIR"; then
        write_path_to_file "used_routes.txt"
    else
        write_path_to_file "unused_routes.txt"
    fi
done

