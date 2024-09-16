#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

SSL_CERT_FILE="$(realpath '/Library/Application Support'/*/*/data/*cacert.pem 2>/dev/null || true)"

WAIT_BOOT_COMPLETED="${WAIT_BOOT_COMPLETED:-15}"

choose_an_emulator() {
	emulator -list-avds |
		head -n 1
}

start_android_emulator() {
	emulator \
		-avd "$ANDROID_SERIAL" \
		-writable-system # this allow to send certificate
}

add_certificate_to_this_session() {
	CERTIFICATE_HASH=$(openssl x509 -inform PEM -subject_hash_old -in "$SSL_CERT_FILE" | head -n 1)

	adb root
	adb remount
	adb push "$SSL_CERT_FILE" "/system/etc/security/cacerts/${CERTIFICATE_HASH}.0"
	adb shell "mount -o remount,ro /system"
	adb unroot
}

if [ -f "$SSL_CERT_FILE" ]; then
	if [ -z "${ANDROID_SERIAL+x}" ]; then
		echo "You didn't set the ANDROID_SERIAL environment variable"
		echo "Choosing one for you :"
		ANDROID_SERIAL="$(choose_an_emulator || true)"
		if [ -z "${ANDROID_SERIAL}" ]; then
			echo '`emulator -list-avds` show 0 Android Emulator'
			echo 'Please create an Android Emulator first, using Android Studio or `avdmanager`'
			exit 1
		fi
		echo "ANDROID_SERIAL=${ANDROID_SERIAL}"
		echo "If you want to hide this message or want to change the emulator, add the previous line to the .env.local file"
	fi

	start_android_emulator >/dev/null &

	sleep "$WAIT_BOOT_COMPLETED"

	add_certificate_to_this_session
fi
