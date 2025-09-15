#!/usr/bin/env bash

# Script to generate a comprehensive global performance report for T3-T4
# Agrège toutes les analyses (bundle, performance, accessibilité) en un rapport unique

set -o errexit
set -o nounset
set -o pipefail

PERF_OUTPUT_DIR=".performance-baseline"
BUNDLE_OUTPUT_DIR=".bundle-analysis"
A11Y_OUTPUT_DIR=".accessibility-analysis"

echo "📊 Generating comprehensive T3-T4 performance report..."

# Création du répertoire de sortie
mkdir -p "$PERF_OUTPUT_DIR"

# En-tête du rapport
cat > "$PERF_OUTPUT_DIR/report.md" << 'EOF'
# 🎯 T3-T4 Strategy Performance Impact Report

## Executive Summary
This report analyzes the impact of current changes on the T3-T4 performance and architecture strategy.

**Strategy Objectives:**
- 📱 Android P90: 35s → 7s (Home performance)
- 📦 Bundle size: Android <15MB, iOS <25MB  
- 🏗️ Architecture: Reduce contexts from 46 → <10
- ♿ Accessibility: Complete Access42 audit by November

---

EOF

# Ajout de l'analyse bundle si disponible
if [ -f "$BUNDLE_OUTPUT_DIR/report.md" ]; then
    echo "📦 Including bundle analysis..."
    cat "$BUNDLE_OUTPUT_DIR/report.md" >> "$PERF_OUTPUT_DIR/report.md"
    echo -e "\n---\n" >> "$PERF_OUTPUT_DIR/report.md"
else
    echo "⚠️ Bundle analysis not available - run ./scripts/analyze_bundle_size.sh first" >> "$PERF_OUTPUT_DIR/report.md"
    echo -e "\n---\n" >> "$PERF_OUTPUT_DIR/report.md"
fi

# Ajout de l'analyse d'accessibilité si disponible
if [ -f "$A11Y_OUTPUT_DIR/report.md" ]; then
    echo "♿ Including accessibility analysis..."
    cat "$A11Y_OUTPUT_DIR/report.md" >> "$PERF_OUTPUT_DIR/report.md"
    echo -e "\n---\n" >> "$PERF_OUTPUT_DIR/report.md"
else
    echo "⚠️ Accessibility analysis not available - run ./scripts/analyze_accessibility_impact.sh first" >> "$PERF_OUTPUT_DIR/report.md"
    echo -e "\n---\n" >> "$PERF_OUTPUT_DIR/report.md"
fi

# Ajout des métriques Reassure si disponibles
if [ -f ".reassure/output.json" ]; then
    echo "🎭 Including Reassure performance metrics..."
    cat >> "$PERF_OUTPUT_DIR/report.md" << 'EOF'
### 🎭 Reassure Performance Analysis

EOF
    
    # Analyse des changements de performance
    RENDER_CHANGES=$(jq '[.countChanged[] | select(.countDiff > 0)] | length' .reassure/output.json 2>/dev/null || echo "0")
    RENDER_IMPROVEMENTS=$(jq '[.countChanged[] | select(.countDiff < 0)] | length' .reassure/output.json 2>/dev/null || echo "0") 
    DURATION_CHANGES=$(jq '[.durationChanged[] | select(.durationDiff > 0)] | length' .reassure/output.json 2>/dev/null || echo "0")
    DURATION_IMPROVEMENTS=$(jq '[.durationChanged[] | select(.durationDiff < 0)] | length' .reassure/output.json 2>/dev/null || echo "0")
    
    cat >> "$PERF_OUTPUT_DIR/report.md" << EOF
| Metric | Regressions | Improvements |
|--------|-------------|--------------|
| 🔄 Render Count | $RENDER_CHANGES | $RENDER_IMPROVEMENTS |
| ⏱️ Duration | $DURATION_CHANGES | $DURATION_IMPROVEMENTS |

EOF

    if [ "$RENDER_CHANGES" -gt 0 ] || [ "$DURATION_CHANGES" -gt 0 ]; then
        echo "⚠️ **Performance regressions detected** - Review before merging" >> "$PERF_OUTPUT_DIR/report.md"
    else
        echo "✅ **No performance regressions detected**" >> "$PERF_OUTPUT_DIR/report.md"
    fi
    
    echo -e "\n---\n" >> "$PERF_OUTPUT_DIR/report.md"
else
    echo "⚠️ Reassure data not available - run yarn test:perf first" >> "$PERF_OUTPUT_DIR/report.md"
    echo -e "\n---\n" >> "$PERF_OUTPUT_DIR/report.md"
fi

# Ajout de l'analyse Android si disponible
if [ -f "$PERF_OUTPUT_DIR/android_report.md" ]; then
    echo "📱 Including Android performance analysis..."
    cat "$PERF_OUTPUT_DIR/android_report.md" >> "$PERF_OUTPUT_DIR/report.md"
    echo -e "\n---\n" >> "$PERF_OUTPUT_DIR/report.md"
fi

# Recommandations finales
cat >> "$PERF_OUTPUT_DIR/report.md" << 'EOF'
## 💡 T3-T4 Strategy Recommendations

### Immediate Actions
1. **Architecture**: Focus on AuthWrapper (80 usages) and LocationWrapper (30 usages)
2. **Performance**: Monitor P90 Android metrics during refactors
3. **Bundle**: Track size evolution during Context → React Query migrations
4. **Accessibility**: Maintain RGAA compliance during architectural changes

### Next Steps
- [ ] Complete collaborative investigation (2 days) for Android 35s issue
- [ ] Implement React Query patterns for identified contexts
- [ ] Set up Sentry Performance monitoring
- [ ] Enable continuous bundle size tracking

### Tools Status
- ✅ **Reassure**: Active performance regression detection
- ⚠️ **react-native-performance**: Ready for deeper integration
- ⚠️ **Bundle analysis**: Manual execution required
- ♿ **Accessibility**: Automated compliance checking

---

*Generated automatically for T3-T4 performance strategy*
*For questions: contact Architecture Guild or Tech Leads*
EOF

echo "✅ Comprehensive performance report generated!"
echo "📄 Report available at: $PERF_OUTPUT_DIR/report.md"
echo "🎯 Ready for T3-T4 strategy monitoring"