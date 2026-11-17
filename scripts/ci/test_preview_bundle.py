#!/usr/bin/env python3
"""Tests for preview channel, fingerprint lookup and QR payload."""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import preview_channel
import publish_preview_fingerprint
import update_preview_qr_comment


class PreviewChannelTest(unittest.TestCase):
    def test_extracts_the_first_ticket_id(self) -> None:
        self.assertEqual(
            preview_channel.extract_channel("(PC-39912) feat: preview bundle"),
            "PC-39912",
        )
        self.assertEqual(
            preview_channel.extract_channel("PC-1 then PC-2"),
            "PC-1",
        )

    def test_rejects_a_title_without_a_ticket(self) -> None:
        with self.assertRaises(SystemExit):
            preview_channel.extract_channel("feat: no ticket here")

    def test_writes_the_channel_to_github_output(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "github_output"
            completed = subprocess.run(
                [sys.executable, str(Path(__file__).with_name("preview_channel.py"))],
                check=False,
                capture_output=True,
                text=True,
                env={"PR_TITLE": "(PC-42) fix: qr", "GITHUB_OUTPUT": str(output)},
            )
            self.assertEqual(completed.returncode, 0, completed.stderr)
            self.assertEqual(output.read_text(encoding="utf-8"), "channel=PC-42\n")


class FingerprintLookupTest(unittest.TestCase):
    def test_reads_the_testing_uri(self) -> None:
        document = {
            "fields": {"testing_uri": {"stringValue": "https://example.test/app"}}
        }
        self.assertEqual(
            publish_preview_fingerprint.testing_uri_from_document(document),
            "https://example.test/app",
        )

    def test_missing_document_is_not_found(self) -> None:
        self.assertEqual(
            publish_preview_fingerprint.lookup_values("abc", None),
            {"exists": "false", "fingerprint_hash": "abc", "testing_uri": ""},
        )

    def test_existing_document_exposes_the_uri(self) -> None:
        self.assertEqual(
            publish_preview_fingerprint.lookup_values("abc", "https://example.test/app"),
            {
                "exists": "true",
                "fingerprint_hash": "abc",
                "testing_uri": "https://example.test/app",
            },
        )


class PreviewQrTest(unittest.TestCase):
    def test_native_deeplink_includes_channel_and_fingerprint(self) -> None:
        payload = update_preview_qr_comment.build_deeplink(
            "android",
            "https://appdistribution.firebase.google.com/testerapps/abc",
            "PC-39912",
            "hash_1",
        )
        self.assertIn("platform=android", payload)
        self.assertIn("channel=PC-39912", payload)
        self.assertIn("fingerprint=hash_1", payload)
        self.assertIn("downloadUrl=", payload)

    def test_ready_qr_encodes_the_same_payload(self) -> None:
        visual = update_preview_qr_comment.render_platform_visual(
            "ios",
            update_preview_qr_comment.make_platform_state(
                status="ready",
                download_url="https://example.test/ios",
                channel="PC-7",
                fingerprint="ioshash",
            ),
        )
        self.assertIn("channel%3DPC-7", visual)
        self.assertIn("fingerprint%3Dioshash", visual)

    def test_parse_state_keeps_channel_and_fingerprint(self) -> None:
        state = {
            "web": update_preview_qr_comment.make_platform_state(),
            "ios": update_preview_qr_comment.make_platform_state(
                status="ready",
                download_url="https://example.test/ios",
                channel="PC-7",
                fingerprint="ioshash",
            ),
            "android": update_preview_qr_comment.make_platform_state(),
        }
        body = (
            update_preview_qr_comment.STATE_PREFIX
            + json.dumps(state)
            + update_preview_qr_comment.STATE_SUFFIX
        )
        parsed = update_preview_qr_comment.parse_state(body)
        self.assertEqual(parsed["ios"]["channel"], "PC-7")
        self.assertEqual(parsed["ios"]["fingerprint"], "ioshash")

    def test_native_ready_requires_channel_and_fingerprint(self) -> None:
        completed = subprocess.run(
            [
                sys.executable,
                str(Path(__file__).with_name("update_preview_qr_comment.py")),
                "--platform",
                "android",
                "--status",
                "ready",
                "--download-url",
                "https://example.test/app",
                "--pr",
                "1",
            ],
            check=False,
            capture_output=True,
            text=True,
            env={"GITHUB_REPOSITORY": "pass-culture/pass-culture-app-native", "GITHUB_TOKEN": "token"},
        )
        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("--channel and --fingerprint", completed.stderr)


if __name__ == "__main__":
    unittest.main()
