#!/usr/bin/env python3

import json
import os
import re
import signal
import subprocess
import sys
import time

ENV = "staging"
TESTS_DIR = ".maestro/testsV3"
CONFIG_FILE = "/tmp/.maestro_e2e_last_config.json"
SECRET_FILE = ".maestro/.env.secret"
MOCK_ANALYTICS_PORT = 4001
LOGBOX_RELOAD_WAIT_SECONDS = 3

CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
DIM = "\033[2m"
BOLD = "\033[1m"
RESET = "\033[0m"


def banner():
    print(f"\n{BOLD}{CYAN}  🎭 Maestro E2E Test Runner{RESET}\n")


def step(msg: str):
    print(f"\n{BOLD}{CYAN}▸ {msg}{RESET}")


def info(msg: str):
    print(f"  {DIM}{msg}{RESET}")


def success(msg: str):
    print(f"  {GREEN}✓ {msg}{RESET}")


def warn(msg: str):
    print(f"  {YELLOW}⚠ {msg}{RESET}")


def error(msg: str):
    print(f"  {RED}✗ {msg}{RESET}")


def select(prompt: str, options: list[tuple[str, str]]) -> str:
    step(prompt)
    for i, (_, label) in enumerate(options, 1):
        print(f"  {CYAN}{i}){RESET} {label}")
    while True:
        choice = input(f"\n  {BOLD}▸{RESET} ").strip()
        if choice.isdigit() and 1 <= int(choice) <= len(options):
            value, label = options[int(choice) - 1]
            success(label)
            return value
        error("Choix invalide, réessaye.")


def multiselect(prompt: str, options: list[tuple[str, str]]) -> list[str]:
    step(prompt)
    for i, (_, label) in enumerate(options, 1):
        print(f"  {CYAN}{i}){RESET} {label}")
    info("Numéros séparés par des espaces")
    while True:
        raw = input(f"\n  {BOLD}▸{RESET} ").strip()
        indices = raw.split()
        if (
            all(s.isdigit() and 1 <= int(s) <= len(options) for s in indices)
            and indices
        ):
            selected = [options[int(s) - 1] for s in indices]
            success(", ".join(label for _, label in selected))
            return [value for value, _ in selected]
        error("Choix invalide, réessaye.")


def confirm(prompt: str, default: bool = True) -> bool:
    hint = "O/n" if default else "o/N"
    answer = input(f"\n  {prompt} ({hint}) ").strip().lower()
    if not answer:
        return default
    return answer in ("o", "oui", "y", "yes")


def text_input(prompt: str, placeholder: str = "", required: bool = False) -> str:
    hint = f" {DIM}({placeholder}){RESET}" if placeholder else ""
    while True:
        value = input(f"  {prompt}{hint} : ").strip()
        if value or not required:
            return value
        error("Valeur requise.")


def load_config() -> dict | None:
    try:
        with open(CONFIG_FILE) as f:
            data = json.load(f)
        required_keys = {"target", "platform", "tags"}
        if not required_keys.issubset(data.keys()):
            return None
        return data
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def save_config(config: dict):
    with open(CONFIG_FILE, "w") as f:
        json.dump(config, f, indent=2)


def format_config(config: dict) -> str:
    lines = [
        f"  {DIM}Mode       :{RESET} {BOLD}{'☁️  Cloud' if config['target'] == 'cloud' else '💻 Local'}{RESET}",
        f"  {DIM}Plateforme :{RESET} {BOLD}{config['platform']}{RESET}",
        f"  {DIM}Tags       :{RESET} {BOLD}{', '.join(config.get('tags') or []) or 'tous'}{RESET}",
    ]
    if config.get("app_binary"):
        lines.append(f"  {DIM}Binary ID  :{RESET} {BOLD}{config['app_binary']}{RESET}")
    elif config.get("app_file"):
        lines.append(f"  {DIM}App file   :{RESET} {BOLD}{config['app_file']}{RESET}")
    if config.get("run_name"):
        lines.append(f"  {DIM}Run name   :{RESET} {BOLD}{config['run_name']}{RESET}")
    lines.append(f"  {DIM}Env        :{RESET} {BOLD}{ENV}{RESET}")
    return "\n".join(lines)


def parse_env_variable(name: str, filepath: str) -> str:
    env_value = os.environ.get(name)
    if env_value:
        return env_value

    try:
        with open(filepath) as f:
            for line in f:
                if f"{name}=" in line:
                    match = re.search(r"'([^']*)'", line) or re.search(
                        r"=([^#\n]*)", line
                    )
                    if match:
                        return match.group(1).strip()
    except FileNotFoundError:
        pass

    print(
        f"{RED}Error: missing required secret '{name}' (not in env nor in {filepath}){RESET}"
    )
    sys.exit(1)


def collect_tags() -> list[tuple[str, str]]:
    tag_counts: dict[str, int] = {}

    for root, dirs, files in os.walk(TESTS_DIR):
        dirs[:] = [d for d in dirs if d != "common"]
        for filename in files:
            if not filename.endswith(".yml") or filename == "config.yaml":
                continue
            with open(os.path.join(root, filename)) as f:
                in_tags = False
                for line in f:
                    if line.startswith("tags:"):
                        in_tags = True
                        continue
                    if in_tags and re.match(r"^  - \S", line):
                        tag = line.strip().lstrip("- ").strip()
                        if tag and not tag.startswith("runScript"):
                            tag_counts[tag] = tag_counts.get(tag, 0) + 1
                    elif in_tags:
                        in_tags = False

    return sorted(
        [(tag, f"{tag} ({count} tests)") for tag, count in tag_counts.items()],
        key=lambda x: -tag_counts[x[0]],
    )


def prompt_config() -> dict:
    last = load_config()

    if last:
        print(f"\n{YELLOW}⟲  Configuration précédente :{RESET}")
        print(format_config(last))

        action = select(
            "Que veux-tu faire ?",
            [
                ("reuse", "🔁 Relancer avec la même config"),
                ("modify", "✏️  Modifier quelques paramètres"),
                ("new", "🆕 Nouvelle configuration"),
            ],
        )
        if action == "reuse":
            return last
        if action == "modify":
            config = dict(last)
            params = multiselect(
                "Quels paramètres modifier ?",
                [
                    ("target", "Mode (local/cloud)"),
                    ("platform", "Plateforme"),
                    ("tags", "Tags"),
                    ("app_binary", "Binary ID / Fichier app"),
                    ("run_name", "Nom de la run"),
                ],
            )
            for p_name in params:
                if p_name == "tags":
                    config["tags"] = None
                elif p_name == "app_binary":
                    config["app_binary"] = ""
                    config["app_file"] = ""
                else:
                    config[p_name] = ""
            return fill_missing(config)

    return fill_missing(empty_config())


def empty_config() -> dict:
    return {
        "target": "",
        "platform": "",
        "tags": None,
        "app_binary": "",
        "app_file": "",
        "run_name": "",
    }


def fill_missing(config: dict) -> dict:
    if not config.get("target"):
        config["target"] = select(
            "Mode d'exécution",
            [
                ("cloud", "☁️  Cloud (Maestro Cloud / Robin)"),
                ("test", "💻 Local (sur ton poste)"),
            ],
        )

    if not config.get("platform"):
        if config["target"] == "cloud":
            options = [("android", "🤖 Android"), ("ios", "🍎 iOS")]
        else:
            options = [("android", "🤖 Android"), ("ios", "🍎 iOS"), ("web", "🌐 Web")]
        config["platform"] = select("Plateforme", options)

    if config.get("tags") is None:
        tag_mode = select(
            "Quels tests lancer ?",
            [
                ("pick", "🏷️  Choisir des tags existants"),
                ("custom", "✍️  Écrire un tag custom (ex: fix)"),
                ("all", "🚀 Tous les tests"),
            ],
        )
        if tag_mode == "pick":
            config["tags"] = multiselect("Sélectionne les tags", collect_tags())
        elif tag_mode == "custom":
            raw = text_input(
                "Tag(s) custom, séparés par des espaces", "fix", required=True
            )
            config["tags"] = raw.split()
        else:
            config["tags"] = []

    if (
        config["target"] == "cloud"
        and config["platform"] != "web"
        and not config.get("app_binary")
        and not config.get("app_file")
    ):
        app_mode = select(
            "Application à tester",
            [
                ("binary", "🔑 Binary ID (build déjà uploadé)"),
                ("file", "📦 Fichier local (.apk / .app)"),
            ],
        )
        if app_mode == "binary":
            config["app_binary"] = text_input("Binary ID", required=True)
        else:
            config["app_file"] = text_input(
                "Chemin vers le fichier (.apk / .app)", required=True
            )

    if config["target"] == "cloud" and not config.get("run_name"):
        config["run_name"] = text_input(
            "Nom de la run (optionnel)", "fix-digital-booking#3"
        )

    return config

