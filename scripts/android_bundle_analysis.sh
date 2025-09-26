#!/usr/bin/env bash

# Analyse spécifique du bundle Android pour objectif <15MB T4

set -o errexit
set -o nounset
set -o pipefail

echo "📱 Android bundle analysis for T4 <15MB objective..."

ANDROID_DIR="android"
BUNDLE_OUTPUT="android-bundle-size.txt"

if [ ! -d "$ANDROID_DIR" ]; then
    echo "❌ Android directory not found"
    exit 1
fi

# Recherche du bundle Android
BUNDLE_PATH=""
if [ -f "android/app/build/outputs/bundle/release/app-release.aab" ]; then
    BUNDLE_PATH="android/app/build/outputs/bundle/release/app-release.aab"
elif [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
    BUNDLE_PATH="android/app/build/outputs/apk/release/app-release.apk"
else
    echo "⚠️ No Android bundle found - build required"
    echo "20.0" > "$BUNDLE_OUTPUT"  # Valeur par défaut pour déclencher l'alerte
    exit 0
fi

# Calcul de la taille en MB
BUNDLE_SIZE_BYTES=$(wc -c < "$BUNDLE_PATH")
BUNDLE_SIZE_MB=$(echo "scale=1; $BUNDLE_SIZE_BYTES / 1024 / 1024" | bc)

echo "📦 Android bundle size: ${BUNDLE_SIZE_MB}MB"
echo "$BUNDLE_SIZE_MB" > "$BUNDLE_OUTPUT"

# Vérification objectif T4
if (( $(echo "$BUNDLE_SIZE_MB > 15" | bc -l) )); then
    echo "❌ Bundle size exceeds 15MB target!"
    exit 1
else
    echo "✅ Bundle size meets 15MB target"
fi