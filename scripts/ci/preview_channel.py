#!/usr/bin/env python3
"""Resolve the preview hot-updater channel from a pull request title."""

from __future__ import annotations

import argparse
import os
import re

TICKET_ID = re.compile(r"(?<![A-Za-z0-9_])PC-\d+")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--title", default=os.environ.get("PR_TITLE", ""))
    parser.add_argument("--github-output", default=os.environ.get("GITHUB_OUTPUT", ""))
    return parser.parse_args()


def extract_channel(title: str) -> str:
    match = TICKET_ID.search(title)
    if not match:
        raise SystemExit(f"PR title must contain a ticket id PC-XXXXX, got: {title!r}")
    return match.group(0)


def write_github_output(path: str, values: dict[str, str]) -> None:
    if not path:
        for key, value in values.items():
            print(f"{key}={value}")
        return
    with open(path, "a", encoding="utf-8") as output:
        for key, value in values.items():
            output.write(f"{key}={value}\n")


def main() -> None:
    args = parse_args()
    channel = extract_channel(args.title)
    write_github_output(args.github_output, {"channel": channel})
    print(f"Preview channel: {channel}")


if __name__ == "__main__":
    main()
