#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
REPO_ROOT=$(dirname "$SCRIPT_DIR")

BUNDLE_ID=app.passculture.staging
TARGET_SDK_VERSION="30"
ANDROID_SDK_MANAGER_COMMAND_LINE_TOOLS_VERSION="12.0"
EMULATOR_NAME="pixel_6"
export ANDROID_HOME="${ANDROID_HOME:-"$HOME/Library/Android/sdk"}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export ANDROID_AVD_HOME="$ANDROID_HOME/avd"
export MAESTRO_VERSION="1.41.0"
export FLASHLIGHT_VERSION="0.18.0"
PERF_PROFILER_REPORTER_VERSION="0.9.0"

readonly C_BLUE='\e[1;34m'
readonly C_GREEN='\e[1;32m'
readonly C_RED='\e[1;31m'
readonly C_RESET='\e[0m'

log_info() {
    printf "\n${C_BLUE}[INFO] ==> %s${C_RESET}\n" "$*"
}

log_success() {
    printf "${C_GREEN}[SUCCESS] ==> %s${C_RESET}\n" "$*"
}

log_error() {
    printf "${C_RED}[ERROR] ==> %s${C_RESET}\n" "$*" >&2
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

verify_dependencies() {
    log_info "Verifying required commands: $*"
    for cmd in "$@"; do
        if ! command -v "$cmd" &> /dev/null; then
            log_error "Required command '$cmd' is not installed. Please install it and try again."
            exit 1
        fi
    done
    log_success "All required commands are present."
}

accept_licence() {
    echo "y"
}

sdkmanager_install_accepting_licence() {
    local output_file
    output_file=$(mktemp)
    
    if ! (accept_licence | sdkmanager "$@" > "$output_file" 2>&1); then
        log_error "sdkmanager failed. See output below:"
        cat "$output_file" >&2
        rm "$output_file"
        return 1
    fi
    
    rm "$output_file"
}

verify_package_installed() {
    local package_name="$1"
    log_info "Verifying that package '$package_name' is installed..."
    if sdkmanager --list_installed | grep --quiet --extended-regexp "^\s*${package_name}"; then
        log_success "Package '$package_name' is confirmed to be installed."
        return 0
    else
        log_error "Verification failed. Package '$package_name' was NOT found after installation attempt."
        exit 1
    fi
}

image_for_sdk() {
    local SDK_VERSION="$1"
    local ARCHITECTURE_SUFFIX
    if [ "$(uname --machine)" == "arm64" ]; then
        ARCHITECTURE_SUFFIX="arm64-v8a"
    else
        ARCHITECTURE_SUFFIX="x86_64"
    fi
    echo "system-images;android-$SDK_VERSION;google_apis;$ARCHITECTURE_SUFFIX"
}

install_flashlight() {
    local os_name
    local binary_name

    if [[ "$(uname)" == "Darwin" ]]; then
        os_name="macos"
    elif [[ "$(uname)" == "Linux" ]]; then
        os_name="linux"
    else
        log_error "Unsupported OS for Flashlight installation: $(uname)"
        exit 1
    fi

    binary_name="flashlight-${os_name}"
    local archive_name="${binary_name}.zip"
    
    local url="https://github.com/bamlab/flashlight/releases/download/v${FLASHLIGHT_VERSION}/${archive_name}"
    local install_dir="$HOME/.flashlight/bin"
    local download_dir
    download_dir=$(mktemp --directory)
    trap 'rm --recursive --force "$download_dir"' RETURN

    log_and_run "Ensuring Flashlight installation directory exists" mkdir --parents "$install_dir"
    log_and_run "Downloading Flashlight v${FLASHLIGHT_VERSION} for ${os_name}" \
        curl --fail --location --progress-bar "$url" --output "$download_dir/$archive_name"

    log_and_run "Unzipping Flashlight archive" \
        unzip -q "$download_dir/$archive_name" -d "$download_dir"

    log_and_run "Moving Flashlight binary to installation directory" \
        mv "$download_dir/$binary_name" "$install_dir/flashlight"

    log_and_run "Making Flashlight binary executable" \
        chmod u+x "$install_dir/flashlight"

    log_info "Flashlight v${FLASHLIGHT_VERSION} installation complete."
}

install_platforms_and_image() {
    local SDK_VERSION="$1"
    local PLATFORM_PACKAGE="platforms;android-$SDK_VERSION"
    local IMAGE_PACKAGE
    IMAGE_PACKAGE=$(image_for_sdk "$SDK_VERSION")

    log_and_run "Installing Android SDK platform '$PLATFORM_PACKAGE'" \
        sdkmanager_install_accepting_licence --install "$PLATFORM_PACKAGE"
    verify_package_installed "$PLATFORM_PACKAGE"

    log_and_run "Installing system image '$IMAGE_PACKAGE'" \
        sdkmanager_install_accepting_licence --install "$IMAGE_PACKAGE"
    verify_package_installed "$IMAGE_PACKAGE"
}

clean_disk() {
    log_info "Free up space"
    df -h
    # Remove .NET SDKs
    sudo rm -rf /usr/share/dotnet
    # Remove Swift toolchain
    sudo rm -rf /usr/share/swift
    # Remove Haskell (ghc)
    sudo rm -rf /opt/ghc
    # Remove some packages in /var/cache
    sudo apt-get clean
    df -h
}

clean_build_artifacts() {
    log_info "Cleaning up build artifacts to maximize space for emulator..."
    df -h
    
    log_and_run "Removing Gradle caches" \
        rm -rf "$HOME/.gradle/caches/"
        
    log_and_run "Removing project build directories" \
        rm -rf "$REPO_ROOT/android/build" "$REPO_ROOT/android/app/build"

    log_and_run "Cleaning yarn cache" \
        yarn cache clean
        
    log_info "Cleanup complete."
    df -h
}

recreate_emulator() {
    local EMULATOR_NAME="$1"
    local SDK_VERSION="$2"
    local DEVICE_NAME="$3"
    local IMAGE_PACKAGE

    install_platforms_and_image "$SDK_VERSION"
    IMAGE_PACKAGE=$(image_for_sdk "$SDK_VERSION")

    log_and_run "Creating AVD '$EMULATOR_NAME' (without launching)" \
        avdmanager create avd \
            --name "$EMULATOR_NAME" \
            --package "$IMAGE_PACKAGE" \
            --device "$DEVICE_NAME" \
            --force

    clean_build_artifacts
    
    local EMULATOR_LOG_FILE="emulator-boot.log"
    log_info "Starting emulator '$EMULATOR_NAME' in the background with a 4GB partition (log: ${EMULATOR_LOG_FILE})..."
    emulator \
        -avd "$EMULATOR_NAME" \
        -partition-size 4096 \
        -wipe-data \
        -no-window -no-audio -no-snapshot -no-boot-anim \
        > "$EMULATOR_LOG_FILE" 2>&1 &

    local EMULATOR_PID=$!
    log_info "Waiting 15s for emulator process (PID: $EMULATOR_PID) to initialize..."
    sleep 15

    if ! ps --pid "$EMULATOR_PID" > /dev/null; then
        log_error "Emulator process (PID $EMULATOR_PID) crashed on startup. See log below:"
        cat "$EMULATOR_LOG_FILE" >&2
        exit 1
    else
        log_success "Emulator process is running (PID $EMULATOR_PID)."
    fi
}

# --- Main Script ---

log_info "Repository root detected at: $REPO_ROOT"
verify_dependencies "curl" "unzip" "yarn" "corepack" "node"

clean_disk

log_and_run "Ensuring AVD storage directory exists" mkdir --parents "$ANDROID_AVD_HOME"

log_info "Updating PATH with Android SDK tool locations..."
CMDLINE_TOOLS_LATEST_PATH="$(realpath "$ANDROID_HOME"/cmdline-tools/*/bin 2>/dev/null || echo '')"
readonly CMDLINE_TOOLS_LATEST_PATH
export PATH="$ANDROID_HOME/cmdline-tools/$ANDROID_SDK_MANAGER_COMMAND_LINE_TOOLS_VERSION/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$CMDLINE_TOOLS_LATEST_PATH:$PATH"
log_success "PATH updated."

log_info "Environment setup begins."

log_and_run "Enabling Corepack" corepack enable

log_and_run "Installing Node.js dependencies from lockfile" \
    bash -c "cd '$REPO_ROOT' && yarn install --frozen-lockfile"

log_and_run "Installing profiler packages for parsing" \
    bash -c "cd '$REPO_ROOT' && yarn add --dev @perf-profiler/reporter@$PERF_PROFILER_REPORTER_VERSION"

log_and_run "Downloading Maestro installer" \
    curl --fail --silent --show-error --location "https://get.maestro.mobile.dev" --output /tmp/maestro_installer.sh
log_and_run "Running Maestro installer" bash /tmp/maestro_installer.sh
log_info "Adding Maestro to PATH..."
export PATH="$PATH":"$HOME/.maestro/bin"

install_flashlight
log_info "Adding Flashlight to PATH..."
export PATH="$PATH":"$HOME/.flashlight/bin"

log_and_run "Installing Android command-line tools v${ANDROID_SDK_MANAGER_COMMAND_LINE_TOOLS_VERSION}" \
    sdkmanager_install_accepting_licence --install "cmdline-tools;$ANDROID_SDK_MANAGER_COMMAND_LINE_TOOLS_VERSION"
log_and_run "Installing Android platform-tools" \
    sdkmanager_install_accepting_licence --install "platform-tools"
verify_package_installed "platform-tools"
log_and_run "Installing Android emulator package" \
    sdkmanager_install_accepting_licence --install "emulator"
verify_package_installed "emulator"

log_and_run "Building the Android staging release APK" \
    bash -c "cd '$REPO_ROOT/android' && ./gradlew assembleStagingRelease"

log_info "Finding the generated APK file..."
APK_PATH=$(find "$REPO_ROOT/android" -type f -name "*.apk" | head --lines=1)
if [ -z "$APK_PATH" ]; then
    log_error "No .apk file was found."
    exit 1
fi
log_success "APK found at: $APK_PATH"

recreate_emulator "SDK_modern_test" "$TARGET_SDK_VERSION" "$EMULATOR_NAME"

log_and_run "Waiting up to 10 minutes for emulator to fully boot" \
    timeout 600 adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 5; done; echo "Emulator booted."'

log_and_run "Listing connected devices" adb devices
log_info "Waiting an extra 15 seconds for services to stabilize..."
sleep 15

log_and_run "Installing the APK onto the emulator" adb install "$APK_PATH"

log_info "Running Flashlight test with Maestro..."
flashlight test \
    --bundleId "$BUNDLE_ID" \
    --testCommand "MAESTRO_APP_ID=$BUNDLE_ID maestro test $REPO_ROOT/.maestro/tests/HomePerformance.yml" \
    --duration 10000 \
    --resultsFilePath "$REPO_ROOT/resultsHomePerformance.json" \
    || log_error "[WARNING] Flashlight command exited with a non-zero status. Results may be incomplete."

log_and_run "Parsing and evaluating performance results" \
    bash -c "cd '$REPO_ROOT' && node 'scripts/parse-perf-results.js' 'resultsHomePerformance.json'"

log_success "Script finished successfully!"