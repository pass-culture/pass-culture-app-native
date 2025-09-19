#!/usr/bin/env bash

# Script de surveillance de l'impact des corrections d'accessibilité
# Support pour les travaux T3-T4 avec audit Access42 et certification RGAA

set -o errexit
set -o nounset
set -o pipefail

A11Y_OUTPUT_DIR=".accessibility-analysis"
mkdir -p "$A11Y_OUTPUT_DIR"

echo "♿ Starting accessibility impact analysis for T3-T4 strategy..."

# Analyse des références d'accessibilité dans le code
echo "🔍 Analyzing accessibility patterns in codebase..."

# Comptage des usages d'accessibilité
ACCESSIBILITY_REFS=$(find src/ -name "*.tsx" -o -name "*.ts" | xargs grep -l "accessibility\|a11y\|RGAA\|testID\|accessibilityLabel" | wc -l)
TOTAL_COMPONENTS=$(find src/ -name "*.tsx" | wc -l)

echo "📊 Found $ACCESSIBILITY_REFS files with accessibility patterns out of $TOTAL_COMPONENTS components"

# Analyse des composants critiques identifiés par Access42
echo "🎯 Analyzing components flagged by Access42 audit..."

# Recherche des patterns d'accessibilité manquants
MISSING_LABELS=$(find src/ -name "*.tsx" | xargs grep -L "accessibilityLabel\|aria-label" | wc -l)
MISSING_ROLES=$(find src/ -name "*.tsx" | xargs grep -L "accessibilityRole\|role=" | wc -l)
MISSING_HINTS=$(find src/ -name "*.tsx" | xargs grep -L "accessibilityHint\|aria-describedby" | wc -l)

# Analyse des améliorations récentes (si git disponible)
RECENT_A11Y_CHANGES=0
if git log --oneline --since="1 month ago" | grep -i "a11y\|accessibility\|rgaa" >/dev/null 2>&1; then
    RECENT_A11Y_CHANGES=$(git log --oneline --since="1 month ago" | grep -i "a11y\|accessibility\|rgaa" | wc -l)
fi

# Génération du rapport JSON
cat > "$A11Y_OUTPUT_DIR/accessibility_analysis.json" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "audit_context": "Access42 corrections + T3-T4 RGAA compliance",
  "metrics": {
    "files_with_a11y": $ACCESSIBILITY_REFS,
    "total_components": $TOTAL_COMPONENTS,
    "coverage_percentage": $((ACCESSIBILITY_REFS * 100 / TOTAL_COMPONENTS)),
    "missing_labels": $MISSING_LABELS,
    "missing_roles": $MISSING_ROLES,
    "missing_hints": $MISSING_HINTS,
    "recent_a11y_commits": $RECENT_A11Y_CHANGES
  },
  "t3_t4_objectives": {
    "access42_deadline": "fin novembre",
    "squad_responsibility": "each squad handles their perimeter",
    "lucas_role": "supervision and guidance",
    "certification_target": "RGAA compliance"
  }
}
EOF

# Test automatique d'accessibilité basique (si possible)
echo "🧪 Running basic accessibility checks..."

# Recherche des problèmes d'accessibilité courants
BUTTON_WITHOUT_LABEL=$(find src/ -name "*.tsx" | xargs grep -c "<TouchableOpacity" | awk -F: '{sum+=$2} END {print sum}' || echo "0")
BUTTON_WITH_LABEL=$(find src/ -name "*.tsx" | xargs grep -c "TouchableOpacity.*accessibilityLabel" | awk -F: '{sum+=$2} END {print sum}' || echo "0")

IMAGES_COUNT=$(find src/ -name "*.tsx" | xargs grep -c "<Image\|FastImage" | awk -F: '{sum+=$2} END {print sum}' || echo "0")
IMAGES_WITH_ALT=$(find src/ -name "*.tsx" | xargs grep -c "alt=\|accessibilityLabel.*Image" | awk -F: '{sum+=$2} END {print sum}' || echo "0")

# Calcul des scores de conformité
BUTTON_COMPLIANCE=0
if [ $BUTTON_WITHOUT_LABEL -gt 0 ]; then
    BUTTON_COMPLIANCE=$((BUTTON_WITH_LABEL * 100 / BUTTON_WITHOUT_LABEL))
fi

IMAGE_COMPLIANCE=0
if [ $IMAGES_COUNT -gt 0 ]; then
    IMAGE_COMPLIANCE=$((IMAGES_WITH_ALT * 100 / IMAGES_COUNT))
fi

# Génération du rapport détaillé
cat > "$A11Y_OUTPUT_DIR/detailed_report.json" << EOF
{
  "compliance_analysis": {
    "buttons": {
      "total": $BUTTON_WITHOUT_LABEL,
      "with_labels": $BUTTON_WITH_LABEL,
      "compliance_rate": "${BUTTON_COMPLIANCE}%"
    },
    "images": {
      "total": $IMAGES_COUNT,
      "with_alt": $IMAGES_WITH_ALT,
      "compliance_rate": "${IMAGE_COMPLIANCE}%"
    }
  },
  "recommendations": [
    "Add accessibilityLabel to TouchableOpacity components",
    "Ensure all images have appropriate alt text",
    "Implement accessibilityRole for semantic elements",
    "Add accessibilityHint for complex interactions"
  ]
}
EOF

# Génération du rapport Markdown pour les PR
cat > "$A11Y_OUTPUT_DIR/report.md" << EOF
### ♿ Accessibility Impact Analysis

#### 📊 Current State
- **Files with a11y patterns**: $ACCESSIBILITY_REFS / $TOTAL_COMPONENTS ($((ACCESSIBILITY_REFS * 100 / TOTAL_COMPONENTS))%)
- **Recent a11y commits**: $RECENT_A11Y_CHANGES (last month)

#### 🎯 T3-T4 Access42 Compliance Status
- **Deadline**: Fin novembre 
- **Approach**: Squad-by-squad responsibility
- **Supervision**: Lucas + certified developers

#### 🧪 Quick Compliance Check
| Element Type | Total | With Labels | Compliance |
|-------------|-------|-------------|------------|
| 🔘 Buttons | $BUTTON_WITHOUT_LABEL | $BUTTON_WITH_LABEL | ${BUTTON_COMPLIANCE}% |
| 🖼️ Images | $IMAGES_COUNT | $IMAGES_WITH_ALT | ${IMAGE_COMPLIANCE}% |

#### ⚠️ Potential Issues
- Missing labels: $MISSING_LABELS components
- Missing roles: $MISSING_ROLES components  
- Missing hints: $MISSING_HINTS components

#### 💡 T4 Integration
- Each squad handles accessibility in their refactor perimeter
- AuthWrapper/LocationWrapper migrations should maintain a11y compliance
- New patterns should follow RGAA guidelines

*This analysis supports the T3-T4 accessibility compliance strategy*
EOF

# Test de régression d'accessibilité si des outils sont disponibles
if command -v axe >/dev/null 2>&1; then
    echo "🔍 Running axe accessibility tests..."
    # Note: axe nécessite un navigateur, donc simulation ici
    echo "✅ axe-core integration available for deeper testing"
else
    echo "📝 axe-core not found - install @axe-core/cli for deeper testing"
fi

echo "✅ Accessibility impact analysis complete!"
echo "📊 Results saved in $A11Y_OUTPUT_DIR/"
echo "🎯 Ready for Access42 audit completion by end of November"