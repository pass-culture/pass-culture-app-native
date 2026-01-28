#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

# The path to the TypeScript api.ts file
FILE_PATH="src/api/gen/api.ts"

# The root directory of your project to search within
PROJECT_DIR="src"

# Start and end flags to capture the function block
START_FLAG="const DefaultApiFetchParamCreator"
END_FLAG="^}$"

REGEX_FUNC_PREFIX='async ([^ ]*)\(.*'
REGEX_PATHNAME='let pathname = `([^`]*)`'



# Use awk to extract the block of code that defines DefaultApiFetchParamCreator
function_names=$(awk "/${START_FLAG}/,/${END_FLAG}/{print}" $FILE_PATH |
    # Use grep to filter lines that likely define functions within the block
    grep -o -E "${REGEX_FUNC_PREFIX}" |
    # Use sed to clean up the lines to only have function names
    sed -E "s/${REGEX_FUNC_PREFIX}/\1/")

write_path_to_file () {
    function_body=$(awk "/async ${function_name}\(/,/^    },$/" $FILE_PATH)
    pathname=$(echo "$function_body" | grep -o -E "$REGEX_PATHNAME" | sed -E "s/$REGEX_PATHNAME/\1/")
    filename=$1
    echo "$pathname"
    if echo "$function_body" | grep -q -E "$REGEX_PATHNAME"; then
        echo "- $pathname" >> $filename
    else
        echo "Pathname not found for $function_name">> $filename
    fi
}

# Loop through each function name
echo "$function_names" | while read -r function_name; do
    # Search for the function name within the project directory, excluding the api.ts file, test files, and story files
    if grep --quiet --word-regexp --recursive --exclude="api.ts" --exclude="*.test.*" --exclude="*.stories.*" "$function_name" "$PROJECT_DIR"; then
        write_path_to_file "used_routes.txt"
    else
        write_path_to_file "unused_routes.txt"
    fi
done

{
    echo "# $1" 
    echo "To find the diff, use \`git diff tag_min_required_version tag_current_version -- route_usage_changelog.md\`"
    echo "## Used routes:" 
    cat used_routes.txt  
    echo "## Unused routes:" 
    cat unused_routes.txt 
    echo "" 
} > route_usage_changelog.md

rm used_routes.txt 2>/dev/null
rm unused_routes.txt 2>/dev/null
