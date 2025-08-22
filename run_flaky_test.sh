#!/bin/bash

# A script to run a specific test multiple times to check for flakiness.
# It will capture and display the name of the failing test case.
#
# Usage:
#   ./run_flaky_test.sh <path_to_test_file> [number_of_runs]

# --- Configuration & Argument Handling ---

if [ -z "$1" ]; then
  echo "Error: No test file specified."
  echo "Usage: $0 <path_to_test_file> [number_of_runs]"
  exit 1
fi

TEST_FILE="$1"
TOTAL_RUNS="${2:-100}"

# --- Color Definitions (ANSI escape codes) ---
COLOR_GREEN='\033[0;32m'
COLOR_RED='\033[1;31m'   # Bold Red
COLOR_YELLOW='\033[0;33m' # Yellow for the test name
COLOR_RESET='\033[0m'  # Resets all text formatting

# --- Initialization ---
failures=0

# --- Main Execution ---

printf -- "--- Running test for '%s' (%s times) ---\n\n" "$TEST_FILE" "$TOTAL_RUNS"

for i in $(seq 1 $TOTAL_RUNS); do
  printf "Run %s/%s: " "$i" "$TOTAL_RUNS"

  test_output=$(yarn test:unit:web:ci -- "$TEST_FILE" 2>&1)
  exit_code=$?

  if [ $exit_code -eq 0 ]; then
    printf "${COLOR_GREEN}PASS${COLOR_RESET}\n"
  else
    ((failures++))

    # **THE FIX IS HERE**
    # This sed command now just removes leading whitespace ('s/^\s*//')
    # from the line, keeping the '●' but removing the indentation.
    failed_test_name=$(echo "$test_output" | grep '●' | head -n 1 | sed -e 's/^\s*//' -e 's/\x1b\[[0-9;]*m//g')

    printf "${COLOR_RED}FAIL${COLOR_RESET}"

    if [ -n "$failed_test_name" ]; then
      # The printf format string adds the " - " with a single space.
      printf " - ${COLOR_YELLOW}%s${COLOR_RESET}\n" "$failed_test_name"
    else
      printf "\n"
    fi
  fi
done

# --- Summary & Exit ---

printf "\n--- Test Complete ---\n"

if [ "$failures" -gt 0 ]; then
  printf "Total failures: ${COLOR_RED}%s${COLOR_RESET} out of %s runs.\n" "$failures" "$TOTAL_RUNS"
  exit 1
else
  printf "All runs passed! ${COLOR_GREEN}%s/%s successful.${COLOR_RESET}\n" "$TOTAL_RUNS" "$TOTAL_RUNS"
  exit 0
fi