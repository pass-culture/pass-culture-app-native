#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
REPO_ROOT=$(dirname "$SCRIPT_DIR")
echo "Repository root detected at: $REPO_ROOT"

readonly C_BLUE='\e[1;34m'
readonly C_GREEN='\e[1;32m'
readonly C_RED='\e[1;31m'
readonly C_RESET='\e[0m'

log_info() {
    echo -e "\n${C_BLUE}[INFO] ==> $*${C_RESET}"
}

log_success() {
    echo -e "${C_GREEN}[SUCCESS] ==> $*${C_RESET}"
}

log_error() {
    # Redirecting error messages to stderr (>&2).
    echo -e "${C_RED}[ERROR] ==> $*${C_RESET}" >&2
}

log_and_run() {
    local message="$1"
    shift
    local cmd_string="$*"

    log_info "${message}..."
    if "$@"; then
        log_success "Done."
    else
        log_error "Command failed with exit code $?: '${cmd_string}'"
        exit 1
    fi
}

accept_licence() {
    echo "y"
}

sdkmanager_install_accepting_licence() {
    accept_licence | sdkmanager "$@" >/dev/null
}

verify_package_installed() {
    local package_name="$1"
    echo -e "${C_BLUE}[INFO] ==> Verifying that package '$package_name' is installed...${C_RESET}"
    if sdkmanager --list_installed | grep --quiet --extended-regexp "^\s*${package_name}"; then
        echo -e "${C_GREEN}[SUCCESS] ==> Package '$package_name' is confirmed to be installed.${C_RESET}"
        return 0
    else
        echo -e "${C_RED}[ERROR] ==> Verification failed. Package '$package_name' was NOT found after installation attempt.${C_RESET}"
        exit 1
    fi
}

image_for_sdk() {
    local SDK_VERSION="$1"
    local ARCHITECTURE_SUFFIX
    if [ "$(uname -m)" == "arm64" ]; then
        ARCHITECTURE_SUFFIX="arm64-v8a"
    else
        ARCHITECTURE_SUFFIX="x86_64"
    fi
    echo "system-images;android-$SDK_VERSION;google_apis;$ARCHITECTURE_SUFFIX"
}

install_platforms_and_image() {
    local SDK_VERSION="$1"
    local PLATFORM_PACKAGE="platforms;android-$SDK_VERSION"
    local IMAGE_PACKAGE
    IMAGE_PACKAGE=$(image_for_sdk "$SDK_VERSION")

    log_and_run "Attempting to install Android SDK platform '$PLATFORM_PACKAGE'" \
        sdkmanager_install_accepting_licence --install "$PLATFORM_PACKAGE"
    verify_package_installed "$PLATFORM_PACKAGE"

    log_and_run "Attempting to install system image '$IMAGE_PACKAGE'" \
        sdkmanager_install_accepting_licence --install "$IMAGE_PACKAGE"
    verify_package_installed "$IMAGE_PACKAGE"
}

recreate_emulator() {
    local EMULATOR_NAME="$1"
    local SDK_VERSION="$2"
    local DEVICE_NAME="$3"
    local IMAGE_PACKAGE

    install_platforms_and_image "$SDK_VERSION"
    IMAGE_PACKAGE=$(image_for_sdk "$SDK_VERSION")

    echo -e "\n${C_BLUE}[INFO] ==> Attempting to create AVD '$EMULATOR_NAME'...${C_RESET}"
    if ! avdmanager create avd \
        --name "$EMULATOR_NAME" \
        --package "$IMAGE_PACKAGE" \
        --device "$DEVICE_NAME" \
        --force; then
        echo -e "${C_RED}[ERROR] ==> avdmanager create command failed.${C_RESET}"
        exit 1
    fi
    echo -e "${C_GREEN}[SUCCESS] ==> AVD '$EMULATOR_NAME' created.${C_RESET}"
    
    local EMULATOR_LOG_FILE="emulator-boot.log"
    echo -e "${C_BLUE}[INFO] ==> Starting emulator '$EMULATOR_NAME' in the background (log: ${EMULATOR_LOG_FILE}).${C_RESET}"
    emulator \
        -avd "$EMULATOR_NAME" \
        -no-window -no-audio -no-snapshot -no-boot-anim \
        > "$EMULATOR_LOG_FILE" 2>&1 &

    local EMULATOR_PID=$!
    echo -e "${C_BLUE}[INFO] ==> Waiting 15s for emulator process...${C_RESET}"
    sleep 15
    
    if ! ps -p $EMULATOR_PID > /dev/null; then
        echo -e "${C_RED}[ERROR] ==> Emulator process (PID $EMULATOR_PID) crashed on startup.${C_RESET}"
        cat "$EMULATOR_LOG_FILE"
        exit 1
    else
        echo -e "${C_GREEN}[SUCCESS] ==> Emulator process is running (PID $EMULATOR_PID).${C_RESET}"
    fi
}

ANDROID_SDK_MANAGER_COMMAND_LINE_TOOLS_VERSION="12.0"
export ANDROID_HOME="${ANDROID_HOME:-"$HOME/Library/Android/sdk"}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export ANDROID_AVD_HOME="$ANDROID_HOME/avd"
log_and_run "Ensuring AVD storage directory exists" mkdir -p "$ANDROID_AVD_HOME"
log_and_run "Creating Android SDK directory if it doesn't exist" mkdir -p "$(dirname "$ANDROID_HOME")"
echo -e "\n${C_BLUE}[INFO] ==> Updating PATH with Android SDK tool locations...${C_RESET}"
CMDLINE_TOOLS_LATEST_PATH="$(realpath "$ANDROID_HOME"/cmdline-tools/*/bin 2>/dev/null || echo '')"
readonly CMDLINE_TOOLS_LATEST_PATH
export PATH="$ANDROID_HOME/cmdline-tools/$ANDROID_SDK_MANAGER_COMMAND_LINE_TOOLS_VERSION/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$CMDLINE_TOOLS_LATEST_PATH:$PATH"echo -e "${C_GREEN}[SUCCESS] ==> Done.${C_RESET}"

echo "Environment setup begins."

log_and_run "Enabling Corepack" corepack enable

echo -e "\n${C_BLUE}[INFO] ==> Installing Node.js dependencies from lockfile...${C_RESET}"
if (cd "$REPO_ROOT" && yarn install --frozen-lockfile); then
    echo -e "${C_GREEN}[SUCCESS] ==> yarn install complete.${C_RESET}"
else
    echo -e "${C_RED}[ERROR] ==> yarn install failed. Exiting.${C_RESET}" >&2; exit 1
fi

echo -e "\n${C_BLUE}[INFO] ==> Explicitly installing profiler packages to ensure they exist for parsing...${C_RESET}"
if (cd "$REPO_ROOT" && yarn add --dev @perf-profiler/e2e @perf-profiler/reporter); then
    echo -e "${C_GREEN}[SUCCESS] ==> Profiler packages installed.${C_RESET}"
else
    echo -e "${C_RED}[ERROR] ==> Failed to install profiler packages. Exiting.${C_RESET}" >&2; exit 1
fi

log_and_run "Downloading Maestro installer" curl -fsSL "https://get.maestro.mobile.dev" -o /tmp/maestro_installer.sh
log_and_run "Running Maestro installer" bash /tmp/maestro_installer.sh
echo -e "\n${C_BLUE}[INFO] ==> Adding Maestro to PATH...${C_RESET}"
export PATH="$PATH":"$HOME/.maestro/bin"

log_and_run "Downloading Flashlight installer" curl -fsSL "https://get.flashlight.dev" -o /tmp/flashlight_installer.sh
log_and_run "Running Flashlight installer" bash /tmp/flashlight_installer.sh
echo -e "\n${C_BLUE}[INFO] ==> Adding Flashlight to PATH...${C_RESET}"
export PATH="$PATH":"$HOME/.flashlight/bin"

log_and_run "Installing Android command-line tools v${ANDROID_SDK_MANAGER_COMMAND_LINE_TOOLS_VERSION}" sdkmanager_install_accepting_licence --install "cmdline-tools;$ANDROID_SDK_MANAGER_COMMAND_LINE_TOOLS_VERSION"
log_and_run "Installing Android platform-tools" sdkmanager_install_accepting_licence --install "platform-tools"
verify_package_installed "platform-tools"
log_and_run "Installing Android emulator package" sdkmanager_install_accepting_licence --install "emulator"
verify_package_installed "emulator"

echo -e "\n${C_BLUE}[INFO] ==> Building the Android staging debug APK...${C_RESET}"
if (cd "$REPO_ROOT/android" && ./gradlew assembleStagingRelease); then
    echo -e "${C_GREEN}[SUCCESS] ==> APK build complete.${C_RESET}"
else
    echo -e "${C_RED}[ERROR] ==> ./gradlew assembleStagingRelease failed. Exiting.${C_RESET}" >&2; exit 1
fi

echo -e "\n${C_BLUE}[INFO] ==> Finding the generated APK file...${C_RESET}"
APK_PATH=$(find "$REPO_ROOT/android" -type f -name "*.apk" | head -n 1)
if [ -z "$APK_PATH" ]; then
    echo -e "${C_RED}[ERROR] ==> No .apk file was found.${C_RESET}"; exit 1
fi
echo -e "${C_GREEN}[SUCCESS] ==> APK was found at: $APK_PATH${C_RESET}"

MIN_SDK_VERSION="30"
recreate_emulator "SDK_modern_test" "$MIN_SDK_VERSION" "pixel_6"

log_and_run "Waiting up to 10 minutes for emulator to fully boot..." \
    timeout 600 adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 5; done; echo "Emulator booted."'

log_and_run "Listing connected devices" adb devices
echo -e "${C_BLUE}[INFO] ==> Waiting an extra 15 seconds for services to stabilize...${C_RESET}"; sleep 15

log_and_run "Installing the APK onto the emulator" adb install "$APK_PATH"

echo -e "\n${C_BLUE}[INFO] ==> Running Flashlight test with Maestro...${C_RESET}"

flashlight test \
    --bundleId app.passculture.staging \
    --testCommand "MAESTRO_APP_ID=app.passculture.staging maestro test $REPO_ROOT/.maestro/tests/subFolder/commons/LaunchApp.yml" \
    --duration 10000 \
    --resultsFilePath "$REPO_ROOT/resultsLaunchApp.json" || echo -e "${C_RED}[WARNING] Flashlight command exited with a non-zero status. Results may be incomplete.${C_RESET}"

echo -e "\n${C_BLUE}[INFO] ==> Parsing and evaluating performance results...${C_RESET}"

if (cd "$REPO_ROOT" && node "scripts/parse-perf-results.js" "resultsLaunchApp.json"); then
    echo -e "${C_GREEN}[SUCCESS] ==> Performance parsing complete.${C_RESET}"
else
    echo -e "${C_RED}[ERROR] ==> Performance script failed. Exiting.${C_RESET}" >&2; exit 1
fi

echo -e "\n${C_GREEN}Script finished successfully!${C_RESET}"