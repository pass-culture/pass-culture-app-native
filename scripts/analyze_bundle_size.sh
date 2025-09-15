#!/usr/bin/env bash

# Script d'analyse de la taille du bundle pour surveiller l'évolution
# Utilisé dans la stratégie T3-T4 pour respecter les objectifs :
# - Android : <15MB 
# - iOS : <25MB

set -o errexit
set -o nounset
set -o pipefail

BUNDLE_ANALYSIS_DIR=".bundle-analysis"
mkdir -p "$BUNDLE_ANALYSIS_DIR"

echo "🔍 Analyzing bundle sizes for T3-T4 strategy..."

# Analyse Web (Vite)
echo "📊 Web bundle analysis..."
if [ -d "build/static" ]; then
    WEB_SIZE=$(du -sh build/static | cut -f1)
    echo "Web bundle size: $WEB_SIZE"
else
    echo "⚠️ Web build not found - running web build..."
    yarn build:production
    WEB_SIZE=$(du -sh build/static | cut -f1)
    echo "Web bundle size: $WEB_SIZE"
fi

# Analyse Android (si disponible)
echo "📱 Android bundle analysis..."
ANDROID_SIZE="N/A"
if [ -f "android/app/build/outputs/bundle/release/app-release.aab" ]; then
    ANDROID_SIZE_BYTES=$(wc -c < android/app/build/outputs/bundle/release/app-release.aab)
    ANDROID_SIZE_MB=$((ANDROID_SIZE_BYTES / 1024 / 1024))
    ANDROID_SIZE="${ANDROID_SIZE_MB}MB"
    echo "Android bundle size: $ANDROID_SIZE"
    
    # Vérification objectif T4 : <15MB
    if [ $ANDROID_SIZE_MB -gt 15 ]; then
        echo "❌ Android bundle ($ANDROID_SIZE) exceeds 15MB target!"
        ANDROID_STATUS="❌ EXCEEDS TARGET"
    else
        echo "✅ Android bundle ($ANDROID_SIZE) meets 15MB target"
        ANDROID_STATUS="✅ MEETS TARGET"
    fi
else
    echo "⚠️ Android bundle not found - build required for full analysis"
    ANDROID_STATUS="⚠️ BUILD REQUIRED"
fi

# Analyse iOS (si disponible)  
echo "🍎 iOS bundle analysis..."
IOS_SIZE="N/A"
IOS_STATUS="⚠️ BUILD REQUIRED"
if [ -d "ios/build" ]; then
    IOS_SIZE_BYTES=$(find ios/build -name "*.ipa" -exec wc -c {} + | awk '{sum+=$1} END {print sum}')
    if [ -n "$IOS_SIZE_BYTES" ] && [ "$IOS_SIZE_BYTES" != "0" ]; then
        IOS_SIZE_MB=$((IOS_SIZE_BYTES / 1024 / 1024))
        IOS_SIZE="${IOS_SIZE_MB}MB"
        echo "iOS bundle size: $IOS_SIZE"
        
        # Vérification objectif T4 : <25MB
        if [ $IOS_SIZE_MB -gt 25 ]; then
            echo "❌ iOS bundle ($IOS_SIZE) exceeds 25MB target!"
            IOS_STATUS="❌ EXCEEDS TARGET"
        else
            echo "✅ iOS bundle ($IOS_SIZE) meets 25MB target"  
            IOS_STATUS="✅ MEETS TARGET"
        fi
    fi
fi

# Génération du rapport JSON
cat > "$BUNDLE_ANALYSIS_DIR/current.json" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "web": {
    "size": "$WEB_SIZE",
    "status": "📊 INFO"
  },
  "android": {
    "size": "$ANDROID_SIZE",
    "status": "$ANDROID_STATUS",
    "target": "15MB"
  },
  "ios": {
    "size": "$IOS_SIZE", 
    "status": "$IOS_STATUS",
    "target": "25MB"
  }
}
EOF

# Génération du rapport Markdown pour les PR
cat > "$BUNDLE_ANALYSIS_DIR/report.md" << EOF
### 📦 Bundle Size Analysis

| Platform | Current Size | Target | Status |
|----------|-------------|--------|--------|
| 🌐 Web | $WEB_SIZE | - | 📊 INFO |
| 📱 Android | $ANDROID_SIZE | <15MB | $ANDROID_STATUS |
| 🍎 iOS | $IOS_SIZE | <25MB | $IOS_STATUS |

#### 🎯 T3-T4 Strategy Objectives
- **Android**: Target <15MB (current: $ANDROID_SIZE)
- **iOS**: Target <25MB (current: $IOS_SIZE)
- **Focus**: AuthWrapper, LocationWrapper, useSync refactors should reduce bundle size
EOF

echo "✅ Bundle analysis complete - reports saved in $BUNDLE_ANALYSIS_DIR/"