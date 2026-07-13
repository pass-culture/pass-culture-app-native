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


def build_maestro_args(config: dict) -> list[str]:
    secrets = resolve_secrets(config)
    args = [config["target"]]

    env_vars = {
        "MAESTRO_APP_ID": secrets["app_id"],
        "MAESTRO_VALID_IOS_EMAIL": "dev-tests-e2e-ios@passculture.team",
        "MAESTRO_VALID_ANDROID_EMAIL": "dev-tests-e2e-android@passculture.team",
        "MAESTRO_INVALID_EMAIL": "dev-tests-e2e-invalid@passculture.team",
        "MAESTRO_UNREGISTERED_EMAIL": "dev-tests-unregistered+e2e@passculture.team",
        "MAESTRO_MOCK_ANALYTICS_SERVER": f"http://localhost:{MOCK_ANALYTICS_PORT}",
        "MAESTRO_NUMBER_PHONE": "0607080910",
        "MAESTRO_PASSWORD": secrets["password"],
        "MAESTRO_RUN_TRACKING_TESTS": "false",
        "MAESTRO_RUN_CLOUD_COMMANDS": "true"
        if config["target"] == "cloud"
        else "false",
        "MAESTRO_E2E_API_KEY": secrets["e2e_api_key"],
        "MAESTRO_E2E_ENDPOINT": secrets["e2e_endpoint"],
        "MAESTRO_DRIVER_STARTUP_TIMEOUT": "60000",
    }
    if config["target"] == "cloud":
        env_vars["MAESTRO_CLOUD_API_KEY"] = secrets["cloud_api_key"]
    for key, value in env_vars.items():
        args.extend(["--env", f"{key}={value}"])

    if config.get("tags"):
        for tag in config["tags"]:
            args.extend(["--include-tags", tag])
    elif config["target"] == "test" and config["platform"] == "web":
        args.extend(["--include-tags", "web"])

    if config["target"] == "cloud":
        args.extend(
            [
                f"--api-key={secrets['robin_api_key']}",
                f"--project-id={secrets['robin_project_id']}",
                "--flows",
                f"{TESTS_DIR}/",
                "--device-locale",
                "fr_FR",
                "--timeout",
                "120",
            ]
        )
        if config["platform"] == "ios":
            args.extend(
                ["--device-os", "iOS-26-2", "--device-model", "iPhone-17-Pro-Max"]
            )
        elif config["platform"] == "android":
            args.extend(["--device-os", "android-36", "--device-model", "pixel_9"])

    if config.get("app_binary"):
        args.append(f"--app-binary-id={config['app_binary']}")
    elif config.get("app_file"):
        args.append(f"--app-file={config['app_file']}")

    if config.get("run_name"):
        args.extend(["--name", config["run_name"]])

    if config["platform"] == "web":
        args.append(f"{TESTS_DIR}/")

    return args


def resolve_secrets(config: dict) -> dict:
    env_file = f".env.{ENV}"
    platform = config["platform"]

    if platform == "ios":
        app_id = parse_env_variable("IOS_APP_ID", env_file)
    elif platform == "android":
        app_id = parse_env_variable("ANDROID_APP_ID", env_file)
    else:
        app_id = parse_env_variable("APP_PUBLIC_URL", env_file)

    secrets = {
        "app_id": app_id,
        "password": parse_env_variable("MAESTRO_PASSWORD", SECRET_FILE),
        "cloud_api_key": parse_env_variable("MAESTRO_CLOUD_API_KEY", SECRET_FILE),
        "e2e_api_key": parse_env_variable("MAESTRO_E2E_API_KEY", SECRET_FILE),
        "e2e_endpoint": parse_env_variable("MAESTRO_E2E_ENDPOINT", SECRET_FILE),
        "robin_api_key": "",
        "robin_project_id": "",
    }
    if config["target"] == "cloud":
        secrets["robin_api_key"] = parse_env_variable("ROBIN_API_KEY", SECRET_FILE)
        secrets["robin_project_id"] = parse_env_variable(
            "ROBIN_PROJECT_ID", SECRET_FILE
        )

    return secrets


APP_TSX = "./src/App.tsx"


def setup_environment(config: dict) -> bool:
    if config["target"] == "test" and config["platform"] == "android":
        _adb_reverse()

    if config["target"] == "test":
        _stop_mock_server()
        _start_mock_server()

    _disable_recaptcha()

    if config["platform"] in ("ios", "android"):
        return _inject_logbox_ignore()

    return False


def _cleanup(config: dict, logbox_injected: bool):
    if logbox_injected:
        _remove_logbox_ignore()
    if config["target"] == "test":
        _stop_mock_server()


def _adb_reverse():
    try:
        subprocess.run(
            ["adb", "reverse", "tcp:8081", "tcp:8081"], check=True, capture_output=True
        )
        subprocess.run(
            [
                "adb",
                "reverse",
                f"tcp:{MOCK_ANALYTICS_PORT}",
                f"tcp:{MOCK_ANALYTICS_PORT}",
            ],
            check=True,
            capture_output=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        warn("adb reverse failed — assure-toi que ton device est connecté")


def _stop_mock_server():
    subprocess.run(
        f"lsof -ti :{MOCK_ANALYTICS_PORT} | xargs kill -INT 2>/dev/null || true",
        shell=True,
        capture_output=True,
    )


def _start_mock_server():
    subprocess.Popen(
        f"cd .maestro/mock_analytics_server && yarn install --silent && PORT={MOCK_ANALYTICS_PORT} yarn start",
        shell=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def _disable_recaptcha():
    try:
        subprocess.run(
            [
                "npx",
                "ts-node",
                "--compilerOptions",
                '{"module": "commonjs"}',
                "./scripts/enableNativeAppRecaptcha.ts",
                ENV,
                "false",
            ],
            check=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        warn("enableNativeAppRecaptcha failed — continuing anyway")


def _inject_logbox_ignore() -> bool:
    try:
        with open(APP_TSX) as f:
            content = f.read()
        if "LogBox.ignoreAllLogs()" not in content:
            patched = content.replace(
                "LogBox.ignoreLogs([", "LogBox.ignoreAllLogs()\nLogBox.ignoreLogs(["
            )
            with open(APP_TSX, "w") as f:
                f.write(patched)
            return True
    except FileNotFoundError:
        pass
    return False


def _remove_logbox_ignore():
    try:
        with open(APP_TSX) as f:
            content = f.read()
        with open(APP_TSX, "w") as f:
            f.write(content.replace("LogBox.ignoreAllLogs()\n", ""))
    except FileNotFoundError:
        pass


def main():
    print("\n" * 2)
    banner()

    config = prompt_config()

    print(f"\n{BOLD}{CYAN}  📋 Récapitulatif{RESET}")
    print(format_config(config))

    if not confirm("Lancer les tests ?"):
        warn("Annulé.")
        sys.exit(0)

    save_config(config)

    print(f"\n{GREEN}▸ Préparation...{RESET}")
    maestro_args = build_maestro_args(config)
    logbox_injected = setup_environment(config)

    signal.signal(
        signal.SIGINT, lambda *_: (_cleanup(config, logbox_injected), sys.exit(130))
    )
    signal.signal(
        signal.SIGTERM, lambda *_: (_cleanup(config, logbox_injected), sys.exit(143))
    )

    if logbox_injected:
        time.sleep(LOGBOX_RELOAD_WAIT_SECONDS)

    print(
        f"\n{GREEN}▸ Lancement : maestro {config['target']} sur {BOLD}{config['platform']}{RESET}{GREEN} ({ENV}){RESET}\n"
    )

    result = subprocess.run(["maestro", *maestro_args])
    _cleanup(config, logbox_injected)

    if result.returncode == 0:
        print(f"\n{GREEN}✓ Tests terminés avec succès{RESET}")
    else:
        print(f"\n{RED}✗ Tests échoués (code {result.returncode}){RESET}")
    sys.exit(result.returncode)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n  {YELLOW}⚠ Interrompu.{RESET}\n")
        sys.exit(130)
