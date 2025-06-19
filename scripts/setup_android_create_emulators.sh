#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

echo "we are in script"
curl -fsSL "https://get.maestro.mobile.dev" | bash
export PATH="$PATH":"$HOME/.maestro/bin"

echo "maestro -v":
maestro -v

curl https://get.flashlight.dev | bash
export PATH="$PATH":"$HOME/.flashlight/bin"

echo "flashlight -v":
flashlight -v

ANDROID_SDK_MANAGER_COMMAND_LINE_TOOLS_VERSION="12.0"

# first emulator's boot is usually slower
ANDROID_EMULATOR_WAIT_FIRST_BOOT_COMPLETED="${ANDROID_EMULATOR_WAIT_FIRST_BOOT_COMPLETED:-60}"

export ANDROID_HOME="${ANDROID_HOME:-"$HOME/Library/Android/sdk"}"

PATH="$(realpath "$ANDROID_HOME"/cmdline-tools/*/bin 2>/dev/null || echo '/dev/null'):$PATH" # to get previous version
PATH="$ANDROID_HOME/cmdline-tools/$ANDROID_SDK_MANAGER_COMMAND_LINE_TOOLS_VERSION/bin:$PATH" # to get the pinned version
PATH="$ANDROID_HOME/platform-tools:$PATH"
PATH="$ANDROID_HOME/emulator:$PATH"
export PATH

accept_licence() {
	echo "y"
}

sdkmanager_install_accepting_licence() {
	accept_licence |
		sdkmanager "$@" >/dev/null
}

get_version() {
	local FIELD="$1"

	grep "$FIELD" './android/build.gradle' |
		grep -Eo '[0-9]+(\.[0-9]+)*'
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

	echo "Downloading Android SDK $SDK_VERSION"
	sdkmanager_install_accepting_licence \
		--install \
		"platforms;android-$SDK_VERSION" \
		"$(image_for_sdk "$SDK_VERSION")"
}

kill_all_emulators() {
	adb devices |
		grep emulator |
		cut -f1 |
		while read EMULATOR_ID; do
			adb -s "$EMULATOR_ID" \
				emu kill
		done
}

recreate_emulator() {
	local EMULATOR_NAME="$1"
	local SDK_VERSION="$2"
	local DEVICE="$3"

	install_platforms_and_image "$SDK_VERSION"

	avdmanager create avd \
		--name "$EMULATOR_NAME" \
		--package "$(image_for_sdk "$SDK_VERSION")" \
		--device "$DEVICE" \
		--force

	# emulator \
	# 	-avd "$EMULATOR_NAME" \
	# 	>/dev/null \
	# 	&
    emulator \
        -avd "$EMULATOR_NAME" -no-window -no-audio -no-snapshot-save \
        >/dev/null 2>&1 \
        &

}

mkdir --parents "$(dirname "$ANDROID_HOME")"

# use sdkmanager currently installed (legacy)
# to install the specified version of sdkmanager
sdkmanager_install_accepting_licence \
	--install \
	"cmdline-tools;$ANDROID_SDK_MANAGER_COMMAND_LINE_TOOLS_VERSION"

# use newly installed sdkmanager
# to install dependencies
sdkmanager_install_accepting_licence \
	--install \
	"emulator" \
	"platform-tools"

recreate_emulator \
	"SDK_minimum_supporte" \
	"$(get_version 'minSdkVersion')" \
	"Galaxy Nexus" \
	&

wait

echo "Waiting ${ANDROID_EMULATOR_WAIT_FIRST_BOOT_COMPLETED}s while devices are booting"
sleep "$ANDROID_EMULATOR_WAIT_FIRST_BOOT_COMPLETED"

# Ensure emulator is fully booted
echo "Waiting for emulator to be ready..."
timeout 240 bash -c 'until adb shell getprop sys.boot_completed | grep -m 1 "1"; do sleep 10; done' # During 4 minutes, check every 10 seconds.

adb devices
adb shell getprop sys.boot_completed

flashlight test --bundleId app.passculture.testing \
    --testCommand "MAESTRO_APP_ID=app.passculture.testing maestro test .maestro/tests/subFolder/commons/LaunchApp.yml" \
    --duration 10000 \
    --resultsFilePath resultsLaunchApp.json 

# kill_all_emulators