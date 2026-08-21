#!/bin/bash
# Fails if any Python script calls subprocess with shell=True (Semgrep: subprocess-shell-true).
set -euo pipefail

SEARCH_DIR="${1:-.}"
PATTERN='shell\s*=\s*True'

matches=$(grep -rEn --include="*.py" "$PATTERN" "$SEARCH_DIR" || true)

if [[ -n "$matches" ]]; then
  echo "ERROR: subprocess shell=True detected:"
  echo "$matches"
  exit 1
fi

echo "OK: No subprocess shell=True found in $SEARCH_DIR"
