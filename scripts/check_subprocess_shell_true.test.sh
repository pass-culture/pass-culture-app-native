#!/bin/bash
# Verifies the subprocess shell=True detector catches an injection into set_resolution.py.
set -euo pipefail

SCRIPT="$(dirname "$0")/check_subprocess_shell_true.sh"
TARGET="scripts/set_resolution.py"
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

# 1. The real file must be clean (red before fix, green after)
if ! bash "$SCRIPT" "scripts" > /dev/null 2>&1; then
  echo "FAIL: shell=True found in scripts/ — fix not applied"
  exit 1
fi
echo "PASS: $TARGET is clean"

# 2. The detector must catch an injected shell=True in that same file
mkdir -p "$TMPDIR/scripts"
cp "$TARGET" "$TMPDIR/$TARGET"
echo "subprocess.run(['evil'], shell=True)" >> "$TMPDIR/$TARGET"

if bash "$SCRIPT" "$TMPDIR" > /dev/null 2>&1; then
  echo "FAIL: shell=True injection in $TARGET was not detected"
  exit 1
fi
echo "PASS: shell=True injection in $TARGET correctly detected and rejected"
