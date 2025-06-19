#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status.
# Treat unset variables as an error.
# Pipelines return the exit status of the last command to exit with a non-zero status.
set -o errexit -o nounset -o pipefail

# --- Logging Helper ---
# We define colors for our output
readonly C_BLUE='\e[1;34m'
readonly C_GREEN='\e[1;32m'
readonly C_RED='\e[1;31m'
readonly C_RESET='\e[0m'

# log_and_run "Descriptive message" command [args...]
# This function prints a message, runs a command, and checks for success.
log_and_run() {
    local message="$1"
    shift # Remove the message from the arguments list

    echo -e "\n${C_BLUE}[INFO] ==> ${message}...${C_RESET}"
    
    # Execute the command, redirecting its output if needed for cleaner logs
    # The command itself is passed as the remaining arguments "$@"
    if "$@"; then
        echo -e "${C_GREEN}[SUCCESS] ==> Done.${C_RESET}"
    else
        # The command failed. 'set -e' will likely exit the script,
        # but we print an error just in case.
        echo -e "${C_RED}[ERROR] ==> The last command failed: '$*'. Exiting.${C_RESET}" >&2
        exit 1
    fi
}
# --- End of Logging Helper ---


log_and_run "Starting script" echo "Environment setup begins."

# --- Maestro Installation ---
log_and_run "Downloading Maestro installer" \
    curl -fsSL "https://get.maestro.mobile.dev" -o /tmp/maestro_installer.sh
log_and_run "Running Maestro installer" \
    bash /tmp/maestro_installer.sh
log_and_run "Adding Maestro to PATH for this session" \
    export PATH="$PATH":"$HOME/.maestro/bin"
log_and_run "Verifying Maestro installation" \
    maestro -v

# --- Flashlight Installation ---
log_and_run "Downloading Flashlight installer" \
    curl -fsSL "https://get.flashlight.dev" -o /tmp/flashlight_installer.sh
log_and_run "Running Flashlight installer" \
    bash /tmp/flashlight_installer.sh
log_and_run "Adding Flashlight to PATH for this session" \
    export PATH="$PATH":"$HOME/.flashlight/bin"
log_and_run "Verifying Flashlight installation" \
    flashlight -v

# --- Android SDK Configuration ---
ANDROID_SDK_MANAGER_COMMAND_LINE_TOOLS_VERSION="12.0"
ANDROID_EMULATOR_WAIT_FIRST_BOOT_COMPLETED="${ANDROID_EMULATOR_WAIT_FIRST_BOOT_COMPLETED:-60}"
export ANDROID_HOME="${ANDROID_HOME:-"$HOME/Library/Android/sdk"}"

log_and_run "Creating Android SDK directory if it doesn't exist" \
    mkdir --parents "$(dirname "$ANDROID_HOME")"

log_and_run "Updating PATH with Android SDK tool locations" \
    export PATH="$(realpath "$ANDROID_HOME"/cmdline-tools/*/bin 2>/dev/null || echo '/dev/null'):$PATH:$ANDROID_HOME/cmdline-tools/$ANDROID_SDK_MANAGER_COMMAND_LINE_TOOLS_VERSION/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"

# --- Helper Functions (with internal logging) ---
accept_licence() {
	echo "y"
}

sdkmanager_install_accepting_licence() {
    # This function is tricky to wrap in log_and_run due to the pipe.
    # We rely on 'set -e' and 'pipefail' to catch errors here.
	accept_licence | sdkmanager "$@" >/dev/null
}

get_version() {
	local FIELD="$1"
	grep "$FIELD" './android/build.gradle' | grep -Eo '[0-9]+(\.[0-9]+)*'
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
    local IMAGE_NAME
    IMAGE_NAME=$(image_for_sdk "$SDK_VERSION")

	log_and_run "Downloading Android SDK platform $SDK_VERSION and system image" \
        sdkmanager_install_accepting_licence \
		--install \
		"platforms;android-$SDK_VERSION" \
		"$IMAGE_NAME"
}

kill_all_emulators() {
    log_and_run "Attempting to kill all running emulators" \
        adb devices |
		grep emulator |
		cut -f1 |
		while read -r EMULATOR_ID; do
			adb -s "$EMULATOR_ID" emu kill
		done
}

recreate_emulator() {
	local EMULATOR_NAME="$1"
	local SDK_VERSION="$2"
	local DEVICE="$3"
    local IMAGE_PACKAGE

	install_platforms_and_image "$SDK_VERSION"
    IMAGE_PACKAGE=$(image_for_sdk "$SDK_VERSION")

	log_and_run "Creating AVD '$EMULATOR_NAME' for SDK $SDK_VERSION" \
        avdmanager create avd \
		--name "$EMULATOR_NAME" \
		--package "$IMAGE_PACKAGE" \
		--device "$DEVICE" \
		--force

    # --- MODIFICATION FOR DEBUGGING ---
    # 1. Define a log file to capture emulator output.
    # 2. Add flags for CI: -no-accel, -no-boot-anim.
    # 3. Launch and store the Process ID (PID).
    local EMULATOR_LOG_FILE="emulator-boot.log"
    echo -e "${C_BLUE}[INFO] ==> Starting emulator '$EMULATOR_NAME' in the background.${C_RESET}"
    echo -e "${C_BLUE}[INFO] ==> Emulator output will be logged to: ${EMULATOR_LOG_FILE}${C_RESET}"
    
    emulator \
        -avd "$EMULATOR_NAME" \
        -no-window \
        -no-audio \
        -no-snapshot \
        -no-boot-anim \
        -no-accel \
        > "$EMULATOR_LOG_FILE" 2>&1 &

    # Store the PID of the emulator process
    EMULATOR_PID=$!
    
    # Give the emulator process a moment to initialize or fail
    echo -e "${C_BLUE}[INFO] ==> Waiting 15 seconds for the emulator process to initialize...${C_RESET}"
    sleep 15

    # Check if the emulator process is still running. If not, it likely crashed on startup.
    if ! ps -p $EMULATOR_PID > /dev/null; then
        echo -e "${C_RED}[ERROR] ==> Emulator process with PID $EMULATOR_PID is not running. It likely crashed on startup.${C_RESET}"
        echo -e "${C_RED}[ERROR] ==> Displaying contents of ${EMULATOR_LOG_FILE}:${C_RESET}"
        cat "$EMULATOR_LOG_FILE"
        exit 1
    else
        echo -e "${C_GREEN}[SUCCESS] ==> Emulator process is running with PID $EMULATOR_PID.${C_RESET}"
    fi
}

# ... (keep the sdkmanager install calls) ...

recreate_emulator \
	"SDK_minimum_supporte" \
	"$(get_version 'minSdkVersion')" \
	"Galaxy Nexus"

# --- MODIFIED WAITING LOGIC ---
log_and_run "Waiting up to 4 minutes for emulator to fully boot" \
    timeout 240 bash -c '
        until adb shell getprop sys.boot_completed | grep -q "1"; do
            echo "Waiting for boot... Current device status:"
            adb devices || echo "ADB server not ready yet."
            sleep 10
        done
    '

echo -e "${C_GREEN}[SUCCESS] ==> Emulator is fully booted!${C_RESET}"

log_and_run "Verifying final boot status" \
    adb shell getprop sys.boot_completed

log_and_run "Listing connected devices" \
    adb devices

log_and_run "Running Flashlight test with Maestro" \
    flashlight test --bundleId app.passculture.testing \
    --testCommand "MAESTRO_APP_ID=app.passculture.testing maestro test .maestro/tests/subFolder/commons/LaunchApp.yml" \
    --duration 10000 \
    --resultsFilePath resultsLaunchApp.json

# Uncomment the line below if you want to kill the emulator after the test
# kill_all_emulators

echo -e "\n${C_GREEN}Script finished successfully!${C_RESET}"