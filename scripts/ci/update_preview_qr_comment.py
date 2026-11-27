#!/usr/bin/env python3
"""Create or update the sticky PR comment with Web/iOS/Android preview QR codes."""

from __future__ import annotations

import argparse
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

MARKER = "<!-- sticky-preview-builds -->"
STATE_PREFIX = "<!-- preview-builds-state "
STATE_SUFFIX = " -->"

# Custom scheme of the preview binary (.env.preview URL_PREFIX). Testing does not
# register it, so a scan opens the preview app when it is installed.
PREVIEW_APP_SCHEME = "passculturepreview"
PREVIEW_INSTALL_PATH = "preview-install"
SPINNER_URL = (
    "https://cdnjs.cloudflare.com/ajax/libs/file-uploader/5.16.2/processing.gif"
)

VALID_PLATFORMS = ("web", "ios", "android")
VALID_STATUSES = ("idle", "building", "ready", "failed")

PLATFORM_LABELS = {
    "web": "Web",
    "ios": "iOS",
    "android": "Android",
}

PLATFORM_IDLE_HINTS = {
    "web": "_En attente du label `preview`_",
    "ios": "_En attente du label `preview ios`_",
    "android": "_En attente du label `preview android`_",
}

PLATFORM_REQUIRED_LABEL = {
    "web": "preview",
    "ios": "preview ios",
    "android": "preview android",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--reconcile-labels",
        action="store_true",
        help="Reset platforms stuck on building when their preview label is absent",
    )
    parser.add_argument("--platform", choices=VALID_PLATFORMS)
    parser.add_argument("--status", choices=VALID_STATUSES)
    parser.add_argument("--download-url", default="")
    parser.add_argument("--channel", default="")
    parser.add_argument("--fingerprint", default="")
    parser.add_argument(
        "--job-url",
        default="",
        help="GitHub Actions run URL, shown while a build is in progress",
    )
    parser.add_argument("--pr", required=True, type=int)
    parser.add_argument("--commit-sha", default=os.environ.get("GITHUB_SHA", ""))
    parser.add_argument(
        "--repo",
        default=os.environ.get("GITHUB_REPOSITORY", ""),
        help="owner/repo (defaults to GITHUB_REPOSITORY)",
    )
    parser.add_argument(
        "--token",
        default=os.environ.get("GITHUB_TOKEN", ""),
        help="GitHub token (defaults to GITHUB_TOKEN)",
    )
    args = parser.parse_args()
    if not args.reconcile_labels and (not args.platform or not args.status):
        parser.error(
            "--platform and --status are required unless --reconcile-labels is set"
        )
    if args.status == "ready" and not args.download_url:
        parser.error("--download-url is required when --status=ready")
    if (
        args.status == "ready"
        and args.platform in ("ios", "android")
        and (not args.channel or not args.fingerprint)
    ):
        parser.error(
            "--channel and --fingerprint are required when --status=ready for ios and android"
        )
    if args.status == "building" and not args.job_url:
        parser.error("--job-url is required when --status=building")
    if not args.repo or "/" not in args.repo:
        parser.error("--repo or GITHUB_REPOSITORY is required (owner/repo)")
    if not args.token:
        parser.error("--token or GITHUB_TOKEN is required")
    return args


def github_request(
    method: str,
    url: str,
    token: str,
    body: dict[str, Any] | None = None,
) -> Any:
    data = None if body is None else json.dumps(body).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "pass-culture-preview-qr-comment",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(request) as response:
            raw = response.read().decode("utf-8")
            return json.loads(raw) if raw else None
    except urllib.error.HTTPError as error:
        details = error.read().decode("utf-8", errors="replace")
        raise SystemExit(
            f"GitHub API {method} {url} failed: {error.code} {details}"
        ) from error


def make_platform_state(
    status: str = "idle",
    download_url: str = "",
    job_url: str = "",
    channel: str = "",
    fingerprint: str = "",
) -> dict[str, str]:
    return {
        "status": status,
        "downloadUrl": download_url,
        "jobUrl": job_url,
        "channel": channel,
        "fingerprint": fingerprint,
    }


def default_state() -> dict[str, dict[str, str]]:
    return {
        "web": make_platform_state(),
        "ios": make_platform_state(),
        "android": make_platform_state(),
    }


def parse_state(body: str) -> dict[str, dict[str, str]]:
    state = default_state()
    start = body.find(STATE_PREFIX)
    if start < 0:
        return state
    start += len(STATE_PREFIX)
    end = body.find(STATE_SUFFIX, start)
    if end < 0:
        return state
    try:
        parsed = json.loads(body[start:end])
    except json.JSONDecodeError:
        return state
    for platform in VALID_PLATFORMS:
        platform_state = parsed.get(platform) or {}
        status = platform_state.get("status", "idle")
        if status not in VALID_STATUSES:
            status = "idle"
        state[platform] = make_platform_state(
            status=status,
            download_url=platform_state.get("downloadUrl", "") or "",
            job_url=platform_state.get("jobUrl", "") or "",
            channel=platform_state.get("channel", "") or "",
            fingerprint=platform_state.get("fingerprint", "") or "",
        )
    return state


def build_deeplink(
    platform: str,
    download_url: str,
    channel: str = "",
    fingerprint: str = "",
) -> str:
    query = {"platform": platform, "downloadUrl": download_url}
    if channel:
        query["channel"] = channel
    if fingerprint:
        query["fingerprint"] = fingerprint
    return (
        f"{PREVIEW_APP_SCHEME}://{PREVIEW_INSTALL_PATH}?{urllib.parse.urlencode(query)}"
    )


def qr_image_url(payload: str) -> str:
    params = {
        "text": payload,
        "size": "220",
        "margin": "2",
        "ecLevel": "M",
    }
    return "https://quickchart.io/qr?" + urllib.parse.urlencode(params)


# Matches the QR image so a spinner sits in the same vertical slot.
VISUAL_ROW_HEIGHT = "180"


def render_table_cell(content: str, valign: str, height: str = "") -> str:
    height_attr = f' height="{height}"' if height else ""
    return (
        f'<td align="center" valign="{valign}" width="220"{height_attr}>{content}</td>'
    )


def render_platform_visual(platform: str, platform_state: dict[str, str]) -> str:
    label = PLATFORM_LABELS[platform]
    status = platform_state["status"]
    download_url = platform_state.get("downloadUrl", "")

    if status == "building":
        return f'<img src="{SPINNER_URL}" alt="Build {label} en cours" width="24" height="24" />'
    if status == "ready" and download_url:
        if platform == "web":
            qr_payload = download_url
        else:
            qr_payload = build_deeplink(
                platform,
                download_url,
                platform_state.get("channel", ""),
                platform_state.get("fingerprint", ""),
            )
        qr_url = qr_image_url(qr_payload)
        return f'<img src="{qr_url}" alt="QR {label}" width="180" height="180" />'
    return "&nbsp;"


def render_platform_description(platform: str, platform_state: dict[str, str]) -> str:
    label = PLATFORM_LABELS[platform]
    status = platform_state["status"]
    download_url = platform_state.get("downloadUrl", "")

    if status == "building":
        content = f"<em>Build {label} en cours…</em>"
        job_url = platform_state.get("jobUrl", "")
        if job_url:
            content += f'<br/><a href="{job_url}">Voir le job</a>'
        return content
    if status == "ready" and download_url:
        if platform == "web":
            link_label = f"Ouvrir la preview ({label})"
        else:
            link_label = f"Lien App Distribution ({label})"
        return f'<a href="{download_url}">{link_label}</a>'
    if status == "failed":
        return f"❌ Build {label} échoué"
    return PLATFORM_IDLE_HINTS[platform]


def render_install_fallback(state: dict[str, dict[str, str]]) -> str:
    """Direct App Distribution QRs, hidden until the preview app is missing."""
    ready_platforms = [
        platform
        for platform in ("ios", "android")
        if state[platform]["status"] == "ready" and state[platform].get("downloadUrl")
    ]
    if not ready_platforms:
        return ""

    label_cells = [
        render_table_cell(f"<strong>{PLATFORM_LABELS[platform]}</strong>", "middle")
        for platform in ready_platforms
    ]
    visual_cells = [
        render_table_cell(
            (
                f'<img src="{qr_image_url(state[platform]["downloadUrl"])}" '
                f'alt="QR App Distribution {PLATFORM_LABELS[platform]}" '
                f'width="180" height="180" />'
            ),
            "middle",
            VISUAL_ROW_HEIGHT,
        )
        for platform in ready_platforms
    ]
    return "\n".join(
        [
            "<details>",
            "<summary>App de preview pas encore installée ?</summary>",
            "",
            "<table>",
            "<tr>",
            *label_cells,
            "</tr>",
            "<tr>",
            *visual_cells,
            "</tr>",
            "</table>",
            "",
            "</details>",
        ]
    )


def render_comment_body(state: dict[str, dict[str, str]], commit_sha: str) -> str:
    state_json = json.dumps(state, separators=(",", ":"), sort_keys=True)
    short_sha = commit_sha[:7] if commit_sha else "unknown"
    platforms = ("web", "ios", "android")
    show_visual_row = any(
        render_platform_visual(platform, state[platform]) != "&nbsp;"
        for platform in platforms
    )
    visual_height = VISUAL_ROW_HEIGHT if show_visual_row else ""

    label_cells = [
        render_table_cell(f"<strong>{PLATFORM_LABELS[platform]}</strong>", "middle")
        for platform in platforms
    ]
    visual_cells = [
        render_table_cell(
            render_platform_visual(platform, state[platform]),
            "middle",
            visual_height,
        )
        for platform in platforms
    ]
    description_cells = [
        render_table_cell(render_platform_description(platform, state[platform]), "top")
        for platform in platforms
    ]

    rows = ["<tr>", *label_cells, "</tr>"]
    if show_visual_row:
        rows.extend(["<tr>", *visual_cells, "</tr>"])
    rows.extend(["<tr>", *description_cells, "</tr>"])

    return "\n".join(
        [
            MARKER,
            f"{STATE_PREFIX}{state_json}{STATE_SUFFIX}",
            "## Preview builds",
            "",
            '<div align="center">',
            "",
            "<table>",
            *rows,
            "</table>",
            "",
            render_install_fallback(state),
            "",
            f"_Commit: `{short_sha}`_",
            "",
            "</div>",
            "",
        ]
    )


def list_pr_label_names(owner: str, repo: str, pr_number: int, token: str) -> set[str]:
    url = f"https://api.github.com/repos/{owner}/{repo}/issues/{pr_number}/labels?per_page=100"
    labels = github_request("GET", url, token)
    if not isinstance(labels, list):
        return set()
    return {str(label.get("name", "")) for label in labels if isinstance(label, dict)}


def clear_building_without_label(
    state: dict[str, dict[str, str]], label_names: set[str]
) -> None:
    """A removed label must not leave the platform looking like a build is running."""
    idle = make_platform_state()
    for platform, required_label in PLATFORM_REQUIRED_LABEL.items():
        if required_label in label_names:
            continue
        if state[platform]["status"] == "building":
            state[platform] = dict(idle)


def find_sticky_comment(comments: list[dict[str, Any]]) -> dict[str, Any] | None:
    for comment in comments:
        body = comment.get("body") or ""
        if MARKER in body:
            return comment
    return None


def list_issue_comments(
    owner: str, repo: str, pr_number: int, token: str
) -> list[dict[str, Any]]:
    comments: list[dict[str, Any]] = []
    page = 1
    while True:
        query = urllib.parse.urlencode({"per_page": 100, "page": page})
        url = f"https://api.github.com/repos/{owner}/{repo}/issues/{pr_number}/comments?{query}"
        batch = github_request("GET", url, token)
        if not isinstance(batch, list) or not batch:
            break
        comments.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return comments


def main() -> None:
    args = parse_args()
    owner, repo = args.repo.split("/", 1)

    comments = list_issue_comments(owner, repo, args.pr, args.token)
    existing = find_sticky_comment(comments)
    if args.reconcile_labels and not existing:
        print(f"No sticky preview comment to reconcile on PR {args.pr}")
        return
    state = parse_state(existing["body"]) if existing else default_state()

    if not args.reconcile_labels:
        previous = state[args.platform]
        previous_url = previous.get("downloadUrl", "")
        channel = args.channel or previous.get("channel", "")
        fingerprint = args.fingerprint or previous.get("fingerprint", "")
        if args.status == "ready":
            download_url = args.download_url
            job_url = ""
            channel = args.channel
            fingerprint = args.fingerprint
        elif args.status == "building":
            download_url = previous_url
            job_url = args.job_url
        elif args.status == "idle":
            download_url = ""
            job_url = ""
            channel = ""
            fingerprint = ""
        else:
            # failed: keep previous download URL, drop the in-progress job link
            download_url = previous_url
            job_url = ""
        state[args.platform] = make_platform_state(
            status=args.status,
            download_url=download_url,
            job_url=job_url,
            channel=channel,
            fingerprint=fingerprint,
        )

    label_names = list_pr_label_names(owner, repo, args.pr, args.token)
    clear_building_without_label(state, label_names)

    body = render_comment_body(state, args.commit_sha)
    detail = (
        "reconcile-labels"
        if args.reconcile_labels
        else f"{args.platform}={args.status}"
    )

    if existing:
        url = f"https://api.github.com/repos/{owner}/{repo}/issues/comments/{existing['id']}"
        github_request("PATCH", url, args.token, {"body": body})
        print(f"Updated sticky preview comment {existing['id']} for {detail}")
    else:
        url = f"https://api.github.com/repos/{owner}/{repo}/issues/{args.pr}/comments"
        created = github_request("POST", url, args.token, {"body": body})
        print(f"Created sticky preview comment {created['id']} for {detail}")


if __name__ == "__main__":
    main()
