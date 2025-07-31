#!/bin/bash

# Script pour mesurer la taille des bundles React Native iOS et Android
# Usage: ./bundle-size.sh

set -e

TEMP_DIR="./temp-bundle-measure"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fonction pour formater la taille en MB depuis des KB
format_size_from_kb() {
    local size_kb=$1
    local size_mb=$(LC_NUMERIC=C awk "BEGIN {printf \"%.1f\", $size_kb / 1024}")
    echo "${size_mb} MB"
}

# Fonction pour formater la taille en MB depuis des bytes
format_size() {
    local size_bytes=$1
    # Forcer la locale C pour avoir des points décimaux
    local size_mb=$(LC_NUMERIC=C awk "BEGIN {printf \"%.1f\", $size_bytes / 1024 / 1024}")
    echo "${size_mb} MB"
}

# Fonction pour obtenir la taille en MB comme nombre (avec point décimal)
get_size_mb() {
    local size_bytes=$1
    LC_NUMERIC=C awk "BEGIN {printf \"%.1f\", $size_bytes / 1024 / 1024}"
}

# Fonction pour obtenir la taille en MB depuis des KB
get_size_mb_from_kb() {
    local size_kb=$1
    LC_NUMERIC=C awk "BEGIN {printf \"%.1f\", $size_kb / 1024}"
}

# Fonction pour nettoyer les fichiers temporaires
cleanup() {
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi
}

# Nettoyer à la sortie
#trap cleanup EXIT

# Vérifier que nous sommes dans un projet React Native
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Are you in a React Native project?${NC}"
    exit 1
fi

if ! grep -q "react-native" package.json; then
    echo -e "${RED}❌ Error: This doesn't appear to be a React Native project${NC}"
    exit 1
fi

# Créer le dossier temporaire
mkdir -p "$TEMP_DIR"

echo -e "${BLUE}📱 React Native Bundle Size Analysis${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Mesurer Android
echo -e "${CYAN}🤖 Analyzing Android bundle...${NC}"
ANDROID_BUNDLE="$TEMP_DIR/index.android.bundle"
ANDROID_ASSETS="$TEMP_DIR/assets-android"

npx react-native bundle \
    --platform android \
    --dev false \
    --entry-file index.js \
    --bundle-output "$ANDROID_BUNDLE" \
    --assets-dest "$ANDROID_ASSETS" \
    --reset-cache > /dev/null 2>&1

if [ -f "$ANDROID_BUNDLE" ]; then
    ANDROID_JS_SIZE=$(stat -f%z "$ANDROID_BUNDLE" 2>/dev/null || stat -c%s "$ANDROID_BUNDLE" 2>/dev/null)
    ANDROID_JS_FORMATTED=$(format_size $ANDROID_JS_SIZE)
else
    echo -e "${RED}❌ Error: Android bundle not generated${NC}"
    exit 1
fi

if [ -d "$ANDROID_ASSETS" ]; then
    ANDROID_ASSETS_SIZE_KB=$(du -sk "$ANDROID_ASSETS" 2>/dev/null | cut -f1 || echo "0")
    ANDROID_ASSETS_SIZE=$((ANDROID_ASSETS_SIZE_KB * 1024))
    ANDROID_ASSETS_FORMATTED=$(format_size_from_kb $ANDROID_ASSETS_SIZE_KB)
else
    ANDROID_ASSETS_SIZE=0
    ANDROID_ASSETS_SIZE_KB=0
    ANDROID_ASSETS_FORMATTED="0.0 MB"
fi

# Debug: afficher les tailles réelles pour diagnostic
#echo "DEBUG Android - JS: $ANDROID_JS_SIZE bytes, Assets: $ANDROID_ASSETS_SIZE_KB KB" >&2

ANDROID_TOTAL_SIZE=$((ANDROID_JS_SIZE + ANDROID_ASSETS_SIZE))
ANDROID_TOTAL_FORMATTED=$(format_size $ANDROID_TOTAL_SIZE)

echo -e "${GREEN}✅ Android bundle generated${NC}"
echo ""

# Mesurer iOS
echo -e "${CYAN}🍎 Analyzing iOS bundle...${NC}"
IOS_BUNDLE="$TEMP_DIR/main.jsbundle"
IOS_ASSETS="$TEMP_DIR/assets-ios"

npx react-native bundle \
    --platform ios \
    --dev false \
    --entry-file index.js \
    --bundle-output "$IOS_BUNDLE" \
    --assets-dest "$IOS_ASSETS" \
    --reset-cache > /dev/null 2>&1

if [ -f "$IOS_BUNDLE" ]; then
    IOS_JS_SIZE=$(stat -f%z "$IOS_BUNDLE" 2>/dev/null || stat -c%s "$IOS_BUNDLE" 2>/dev/null)
    IOS_JS_FORMATTED=$(format_size $IOS_JS_SIZE)
else
    echo -e "${RED}❌ Error: iOS bundle not generated${NC}"
    exit 1
fi

if [ -d "$IOS_ASSETS" ]; then
    IOS_ASSETS_SIZE_KB=$(du -sk "$IOS_ASSETS" 2>/dev/null | cut -f1 || echo "0")
    IOS_ASSETS_SIZE=$((IOS_ASSETS_SIZE_KB * 1024))
    IOS_ASSETS_FORMATTED=$(format_size_from_kb $IOS_ASSETS_SIZE_KB)
else
    IOS_ASSETS_SIZE=0
    IOS_ASSETS_SIZE_KB=0
    IOS_ASSETS_FORMATTED="0.0 MB"
fi

# Debug: afficher les tailles réelles pour diagnostic
#echo "DEBUG iOS - JS: $IOS_JS_SIZE bytes, Assets: $IOS_ASSETS_SIZE_KB KB" >&2

IOS_TOTAL_SIZE=$((IOS_JS_SIZE + IOS_ASSETS_SIZE))
IOS_TOTAL_FORMATTED=$(format_size $IOS_TOTAL_SIZE)

echo -e "${GREEN}✅ iOS bundle generated${NC}"
echo ""

# Afficher les résultats complets
echo -e "${BLUE}📊 Bundle Size Analysis Results${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Android Results
echo -e "${YELLOW}🤖 ANDROID${NC}"
echo -e "   📄 JavaScript:  ${ANDROID_JS_FORMATTED}"
echo -e "   🖼️  Assets:      ${ANDROID_ASSETS_FORMATTED}"
echo -e "   📱 Total:       ${GREEN}${ANDROID_TOTAL_FORMATTED}${NC}"

# Comparaison Android avec Vision 2025
ANDROID_TARGET_MB=10
ANDROID_CURRENT_AUDIT_MB=11.7
ANDROID_CURRENT_MB=$(get_size_mb $ANDROID_TOTAL_SIZE)
ANDROID_TARGET_REACHED=$(LC_NUMERIC=C awk "BEGIN {print ($ANDROID_CURRENT_MB <= $ANDROID_TARGET_MB) ? 1 : 0}")

echo -e "   🎯 Target:      ${ANDROID_TARGET_MB} MB"
echo -e "   📊 Last audit:  ${ANDROID_CURRENT_AUDIT_MB} MB"

if [ "$ANDROID_TARGET_REACHED" = "1" ]; then
    echo -e "   🎉 ${GREEN}TARGET REACHED!${NC}"
else
    ANDROID_DIFF=$(LC_NUMERIC=C awk "BEGIN {printf \"%.1f\", $ANDROID_CURRENT_MB - $ANDROID_TARGET_MB}")
    echo -e "   📈 Over by:     ${RED}+${ANDROID_DIFF} MB${NC}"
fi

echo ""

# iOS Results
echo -e "${YELLOW}🍎 iOS${NC}"
echo -e "   📄 JavaScript:  ${IOS_JS_FORMATTED}"
echo -e "   🖼️  Assets:      ${IOS_ASSETS_FORMATTED}"
echo -e "   📱 Total:       ${GREEN}${IOS_TOTAL_FORMATTED}${NC}"

# Comparaison iOS avec Vision 2025
IOS_TARGET_MB=10
IOS_CURRENT_AUDIT_MB=11.7
IOS_CURRENT_MB=$(get_size_mb $IOS_TOTAL_SIZE)
IOS_TARGET_REACHED=$(LC_NUMERIC=C awk "BEGIN {print ($IOS_CURRENT_MB <= $IOS_TARGET_MB) ? 1 : 0}")

echo -e "   🎯 Target:      ${IOS_TARGET_MB} MB"
echo -e "   📊 Last audit:  ${IOS_CURRENT_AUDIT_MB} MB"

if [ "$IOS_TARGET_REACHED" = "1" ]; then
    echo -e "   🎉 ${GREEN}TARGET REACHED!${NC}"
else
    IOS_DIFF=$(LC_NUMERIC=C awk "BEGIN {printf \"%.1f\", $IOS_CURRENT_MB - $IOS_TARGET_MB}")
    echo -e "   📈 Over by:     ${RED}+${IOS_DIFF} MB${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Résumé global
if [ "$ANDROID_TARGET_REACHED" = "1" ] && [ "$IOS_TARGET_REACHED" = "1" ]; then
    echo -e "${GREEN}🎊 ALL TARGETS REACHED - Vision 2025 objectives met! 🎊${NC}"
elif [ "$ANDROID_TARGET_REACHED" = "1" ]; then
    echo -e "${YELLOW}📊 Android target reached, iOS needs optimization${NC}"
elif [ "$IOS_TARGET_REACHED" = "1" ]; then
    echo -e "${YELLOW}📊 iOS target reached, Android needs optimization${NC}"
else
    echo -e "${RED}📊 Both platforms need optimization to reach Vision 2025 targets${NC}"
fi

# Bundle Analysis avec react-native-bundle-visualizer
echo -e "${BLUE}🔍 Running Bundle Analysis...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Vérifier si react-native-bundle-visualizer est installé
if ! npm list react-native-bundle-visualizer &> /dev/null; then
    echo -e "${YELLOW}📦 Installing react-native-bundle-visualizer...${NC}"
    npm install --save-dev react-native-bundle-visualizer || {
        echo -e "${RED}❌ Failed to install react-native-bundle-visualizer${NC}"
        echo -e "${YELLOW}💡 You can install it manually: npm install --save-dev react-native-bundle-visualizer${NC}"
        echo -e "${CYAN}📊 Skipping detailed bundle analysis...${NC}"
        exit 0
    }
fi

# Analyser les deux plateformes avec fallback
analyze_platform() {
    local platform=$1
    local platform_name=$2
    
    echo -e "${CYAN}🔍 Analyzing ${platform_name} bundle composition...${NC}"
    
    # Méthode 1: Essayer avec react-native-bundle-visualizer
    echo -e "${YELLOW}   Trying with bundle visualizer...${NC}"
    
    npx react-native-bundle-visualizer \
        --platform="$platform" \
        --dev=false \
        --format=json \
        --output="$TEMP_DIR/bundle-analysis-${platform}.json" \
        --reset-cache \
        > "$TEMP_DIR/visualizer-${platform}.log" 2>&1
    
    if [ -f "$TEMP_DIR/bundle-analysis-${platform}.json" ] && [ -s "$TEMP_DIR/bundle-analysis-${platform}.json" ]; then
        echo -e "${GREEN}   ✅ Bundle visualizer analysis successful${NC}"
        
        # Parser le JSON et extraire les modules
        node -e "
        try {
            const fs = require('fs');
            const data = JSON.parse(fs.readFileSync('$TEMP_DIR/bundle-analysis-${platform}.json', 'utf8'));
            
            const modules = [];
            
            function extractModules(obj) {
                if (obj && typeof obj === 'object') {
                    if (obj.size && obj.label) {
                        modules.push({
                            name: obj.label,
                            size: obj.size,
                            sizeFormatted: (obj.size / (1024 * 1024)).toFixed(2) + ' MB'
                        });
                    }
                    
                    if (obj.children && Array.isArray(obj.children)) {
                        obj.children.forEach(child => extractModules(child));
                    }
                }
            }
            
            extractModules(data);
            
            const top10 = modules
                .sort((a, b) => b.size - a.size)
                .slice(0, 10);
            
            if (top10.length > 0) {
                console.log('📊 Top 10 heaviest modules (${platform_name}):');
                top10.forEach((module, index) => {
                    const name = module.name.length > 35 ? module.name.substring(0, 32) + '...' : module.name;
                    console.log(\`   \${(index + 1).toString().padStart(2)}. \${name.padEnd(38)} \${module.sizeFormatted.padStart(8)}\`);
                });
            } else {
                console.log('⚠️  No module data found in analysis');
            }
            
        } catch (error) {
            console.log('❌ Error parsing bundle analysis: ' + error.message);
        }
        " 2>/dev/null
        
    else
        # Méthode 2: Fallback avec analyse metro
        echo -e "${YELLOW}   ❌ Bundle visualizer failed, trying Metro stats...${NC}"
        
        # Générer le bundle avec Metro et analyser le source map
        BUNDLE_FILE="$TEMP_DIR/fallback-${platform}.bundle"
        
        npx react-native bundle \
            --platform "$platform" \
            --dev false \
            --entry-file index.js \
            --bundle-output "$BUNDLE_FILE" \
            --sourcemap-output "$TEMP_DIR/fallback-${platform}.map" \
            --reset-cache > /dev/null 2>&1
        
        if [ -f "$BUNDLE_FILE" ]; then
            echo -e "${GREEN}   ✅ Metro bundle analysis${NC}"
            
            # Analyser les require() dans le bundle pour estimer les modules
            echo -e "${YELLOW}📊 Top modules by occurrence (${platform_name}):${NC}"
            
            # Extraire les noms de modules les plus fréquents
            grep -o "require('[^']*')" "$BUNDLE_FILE" 2>/dev/null | \
            sed "s/require('//g; s/')//g" | \
            grep -E "^[a-zA-Z@]" | \
            sort | uniq -c | sort -rn | head -10 | \
            awk '{
                count = $1;
                module = $2;
                if (length(module) > 35) module = substr(module, 1, 32) "...";
                printf "   %2d. %-38s %8s refs\n", NR, module, count;
            }' 2>/dev/null || echo -e "${RED}   ❌ Could not analyze bundle modules${NC}"
            
        else
            echo -e "${RED}   ❌ Could not generate bundle for analysis${NC}"
            
            # Méthode 3: Analyse basique du package.json
            echo -e "${YELLOW}   Trying package.json dependency analysis...${NC}"
            
            if [ -f "package.json" ]; then
                echo -e "${YELLOW}📊 Largest dependencies (package.json):${NC}"
                
                # Lister les dépendances les plus lourdes estimées
                node -e "
                try {
                    const pkg = require('./package.json');
                    const deps = {...(pkg.dependencies || {}), ...(pkg.devDependencies || {})};
                    
                    // Modules connus pour être lourds
                    const heavyModules = {
                        'react-native': '~2.5 MB',
                        'lodash': '~1.5 MB', 
                        '@react-navigation/native': '~1.0 MB',
                        'react-query': '~0.8 MB',
                        '@tanstack/react-query': '~0.8 MB',
                        'react-native-vector-icons': '~0.7 MB',
                        'moment': '~0.6 MB',
                        'date-fns': '~0.5 MB',
                        'axios': '~0.4 MB',
                        'react-native-svg': '~0.4 MB'
                    };
                    
                    const found = [];
                    Object.keys(deps).forEach(dep => {
                        if (heavyModules[dep]) {
                            found.push({name: dep, size: heavyModules[dep]});
                        }
                    });
                    
                    found.forEach((dep, index) => {
                        const name = dep.name.length > 35 ? dep.name.substring(0, 32) + '...' : dep.name;
                        console.log(\`   \${(index + 1).toString().padStart(2)}. \${name.padEnd(38)} \${dep.size.padStart(8)}\`);
                    });
                    
                    if (found.length === 0) {
                        console.log('   No heavy dependencies detected');
                    }
                    
                } catch (error) {
                    console.log('   ❌ Could not analyze package.json');
                }
                " 2>/dev/null
            fi
        fi
    fi
    
    echo ""
}

# Analyser Android
analyze_platform "android" "Android"

# Analyser iOS  
analyze_platform "ios" "iOS"

echo -e "${BLUE}🎯 Bundle Optimization Recommendations:${NC}"
echo -e "   • Check for duplicate dependencies"
echo -e "   • Consider lazy loading for heavy modules"
echo -e "   • Review image assets optimization"
echo -e "   • Evaluate unused code elimination"
echo ""
echo -e "${CYAN}📊 For detailed visual analysis, run:${NC}"
echo -e "   npx react-native-bundle-visualizer --platform=android"
echo -e "   npx react-native-bundle-visualizer --platform=ios"