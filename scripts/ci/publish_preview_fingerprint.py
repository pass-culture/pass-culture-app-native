#!/usr/bin/env python3
"""Publish or look up a preview build fingerprint on the pc-native-preview Firestore."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import urllib.error
import urllib.request
from datetime import datetime, timezone

VALID_PLATFORMS = ("android", "ios")
FINGERPRINT_HASH = re.compile(r"^[A-Za-z0-9_-]+$")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--platform", required=True, choices=VALID_PLATFORMS)
    parser.add_argument(
        "--lookup",
        action="store_true",
        help="Read an existing fingerprint instead of writing one",
    )
    parser.add_argument("--commit-sha", default="")
    parser.add_argument("--testing-uri", default="")
    parser.add_argument("--project-id", default="pc-native-preview")
    parser.add_argument("--fingerprint-file", default="fingerprint.json")
    parser.add_argument("--github-output", default=os.environ.get("GITHUB_OUTPUT", ""))
    args = parser.parse_args()
    if not args.lookup and (not args.commit_sha or not args.testing_uri):
        parser.error(
            "--commit-sha and --testing-uri are required unless --lookup is set"
        )
    return args


def read_fingerprint_hash(path: str, platform: str) -> str:
    with open(path, encoding="utf-8") as fingerprint_file:
        fingerprint = json.load(fingerprint_file)
    hash_value = (fingerprint.get(platform) or {}).get("hash")
    if not hash_value or not FINGERPRINT_HASH.fullmatch(hash_value):
        raise SystemExit(f"Missing {platform} fingerprint hash in {path}")
    return hash_value


def access_token() -> str:
    env = os.environ.copy()
    credentials = env.get("GOOGLE_APPLICATION_CREDENTIALS")
    if credentials:
        env.setdefault("CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE", credentials)
    result = subprocess.run(
        ["gcloud", "auth", "print-access-token"],
        check=False,
        capture_output=True,
        text=True,
        env=env,
    )
    token = result.stdout.strip()
    if result.returncode != 0 or not token:
        details = result.stderr.strip() or "empty access token"
        raise SystemExit(f"gcloud auth print-access-token failed: {details}")
    return token


def fingerprint_document_id(platform: str, fingerprint_hash: str) -> str:
    return f"{platform}_{fingerprint_hash}"


def firestore_document_url(project_id: str, document_id: str) -> str:
    return (
        "https://firestore.googleapis.com/v1/projects/"
        f"{project_id}/databases/(default)/documents/fingerprints/{document_id}"
    )


def testing_uri_from_document(document: dict) -> str:
    fields = document.get("fields") or {}
    testing_uri = (fields.get("testing_uri") or {}).get("stringValue") or ""
    if not testing_uri:
        raise SystemExit("Firestore fingerprint document is missing testing_uri")
    return testing_uri


def lookup_values(fingerprint_hash: str, testing_uri: str | None) -> dict[str, str]:
    return {
        "exists": "true" if testing_uri is not None else "false",
        "fingerprint_hash": fingerprint_hash,
        "testing_uri": testing_uri or "",
    }


def write_github_output(path: str, values: dict[str, str]) -> None:
    if not path:
        for key, value in values.items():
            print(f"{key}={value}")
        return
    with open(path, "a", encoding="utf-8") as output:
        for key, value in values.items():
            output.write(f"{key}={value}\n")


def lookup_document(project_id: str, document_id: str, token: str) -> str | None:
    request = urllib.request.Request(
        firestore_document_url(project_id, document_id),
        method="GET",
        headers={"Authorization": f"Bearer {token}"},
    )
    try:
        with urllib.request.urlopen(request) as response:
            document = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return None
        details = error.read().decode("utf-8", errors="replace")
        raise SystemExit(
            f"Firestore GET {document_id} failed: {error.code} {details}"
        ) from error
    return testing_uri_from_document(document)


def publish_document(
    project_id: str,
    document_id: str,
    commit_sha: str,
    testing_uri: str,
    token: str,
) -> None:
    created_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    url = firestore_document_url(project_id, document_id)
    body = {
        "fields": {
            "commit_hash": {"stringValue": commit_sha},
            "created_at": {"timestampValue": created_at},
            "testing_uri": {"stringValue": testing_uri},
        }
    }
    request = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        method="PATCH",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(request) as response:
            response.read()
    except urllib.error.HTTPError as error:
        details = error.read().decode("utf-8", errors="replace")
        raise SystemExit(
            f"Firestore PATCH {document_id} failed: {error.code} {details}"
        ) from error


def main() -> None:
    args = parse_args()
    fingerprint_hash = read_fingerprint_hash(args.fingerprint_file, args.platform)
    document_id = fingerprint_document_id(args.platform, fingerprint_hash)
    token = access_token()
    if args.lookup:
        testing_uri = lookup_document(args.project_id, document_id, token)
        write_github_output(
            args.github_output,
            lookup_values(fingerprint_hash, testing_uri),
        )
        state = "Found" if testing_uri is not None else "Missing"
        print(f"{state} fingerprints/{document_id} on {args.project_id}")
        return
    publish_document(
        args.project_id,
        document_id,
        args.commit_sha,
        args.testing_uri,
        token,
    )
    print(f"Wrote fingerprints/{document_id} on {args.project_id}")


if __name__ == "__main__":
    main()
