#!/usr/bin/env bash

# Script d'analyse de la complexité architecturale pour T3-T4
# Surveille l'évolution des métriques d'architecture pendant les refactors

set -o errexit
set -o nounset
set -o pipefail

ARCH_OUTPUT_DIR=".architecture-analysis"
mkdir -p "$ARCH_OUTPUT_DIR"

echo "🏗️ Analyzing architectural complexity for T3-T4 strategy..."

# Comptage des contexts React (objectif: 46 → <10)
CONTEXT_FILES=$(find src/ -name "*Context*.tsx" -o -name "*Context*.ts" | wc -l)
WRAPPER_FILES=$(find src/ -name "*Wrapper*.tsx" -o -name "*Wrapper*.ts" | wc -l)
TOTAL_CONTEXTS=$((CONTEXT_FILES + WRAPPER_FILES))

echo "📊 Found $TOTAL_CONTEXTS contexts/wrappers (target: <10)"

# Analyse des imports profonds (couplage)
DEEP_IMPORTS=$(find src/ -name "*.ts" -o -name "*.tsx" | xargs grep -l "\.\./\.\./\.\." | wc -l)
TOTAL_FILES=$(find src/ -name "*.ts" -o -name "*.tsx" | wc -l)

echo "🔗 Found $DEEP_IMPORTS files with deep imports out of $TOTAL_FILES ($((DEEP_IMPORTS * 100 / TOTAL_FILES))% coupling)"

# Analyse des modules critiques T3-T4
echo "🎯 Analyzing T3-T4 critical modules..."

# AuthWrapper analysis
AUTH_WRAPPER_COMPLEXITY=0
AUTH_WRAPPER_STATUS="NOT_FOUND"
if [ -f "src/features/auth/context/AuthWrapper.tsx" ]; then
    AUTH_WRAPPER_COMPLEXITY=$(wc -l < "src/features/auth/context/AuthWrapper.tsx")
    AUTH_WRAPPER_STATUS="FOUND_${AUTH_WRAPPER_COMPLEXITY}_LINES"
    echo "🔐 AuthWrapper: $AUTH_WRAPPER_COMPLEXITY lines (high priority for T4)"
fi

# LocationWrapper analysis  
LOCATION_WRAPPER_COMPLEXITY=0
LOCATION_WRAPPER_STATUS="NOT_FOUND"
if [ -f "src/libs/location/LocationWrapper.tsx" ]; then
    LOCATION_WRAPPER_COMPLEXITY=$(wc -l < "src/libs/location/LocationWrapper.tsx")
    LOCATION_WRAPPER_STATUS="FOUND_${LOCATION_WRAPPER_COMPLEXITY}_LINES"
    echo "📍 LocationWrapper: $LOCATION_WRAPPER_COMPLEXITY lines (medium priority for T4)"
fi

# useSync analysis
USE_SYNC_COMPLEXITY=0
USE_SYNC_STATUS="NOT_FOUND"
if [ -f "src/features/search/helpers/useSync/useSync.ts" ]; then
    USE_SYNC_COMPLEXITY=$(wc -l < "src/features/search/helpers/useSync/useSync.ts")
    USE_SYNC_STATUS="FOUND_${USE_SYNC_COMPLEXITY}_LINES" 
    echo "🔄 useSync: $USE_SYNC_COMPLEXITY lines (critical complexity)"
fi

# useCtaWordingAndAction analysis
CTA_COMPLEXITY=0
CTA_STATUS="NOT_FOUND"
if [ -f "src/features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction.ts" ]; then
    CTA_COMPLEXITY=$(wc -l < "src/features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction.ts")
    CTA_STATUS="FOUND_${CTA_COMPLEXITY}_LINES"
    echo "🎭 useCtaWordingAndAction: $CTA_COMPLEXITY lines (complexity reduction target)"
fi

# Analyse des queries React Query
REACT_QUERY_FILES=$(find src/ -name "*.ts" -o -name "*.tsx" | xargs grep -l "useQuery\|useMutation" | wc -l)
echo "⚡ React Query usage: $REACT_QUERY_FILES files (good architecture pattern)"

# Analyse des hooks personnalisés
CUSTOM_HOOKS=$(find src/ -name "use*.ts" -o -name "use*.tsx" | wc -l)
echo "🎣 Custom hooks: $CUSTOM_HOOKS (architecture modularity indicator)"

# Génération du rapport JSON
cat > "$ARCH_OUTPUT_DIR/complexity_analysis.json" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "t3_t4_strategy": {
    "contexts_target": "<10",
    "current_contexts": $TOTAL_CONTEXTS,
    "reduction_needed": $((TOTAL_CONTEXTS - 10)),
    "coupling_percentage": $((DEEP_IMPORTS * 100 / TOTAL_FILES))
  },
  "critical_modules": {
    "auth_wrapper": {
      "lines": $AUTH_WRAPPER_COMPLEXITY,
      "status": "$AUTH_WRAPPER_STATUS",
      "priority": "HIGH",
      "t4_action": "migrate_to_react_query"
    },
    "location_wrapper": {
      "lines": $LOCATION_WRAPPER_COMPLEXITY,
      "status": "$LOCATION_WRAPPER_STATUS", 
      "priority": "MEDIUM",
      "t4_action": "migrate_to_zustand"
    },
    "use_sync": {
      "lines": $USE_SYNC_COMPLEXITY,
      "status": "$USE_SYNC_STATUS",
      "priority": "CRITICAL", 
      "t4_action": "complete_refactor"
    },
    "use_cta_wording": {
      "lines": $CTA_COMPLEXITY,
      "status": "$CTA_STATUS",
      "priority": "MEDIUM",
      "t4_action": "simplify_logic"
    }
  },
  "architecture_health": {
    "react_query_adoption": $REACT_QUERY_FILES,
    "custom_hooks": $CUSTOM_HOOKS,
    "deep_coupling_files": $DEEP_IMPORTS,
    "modularity_score": $((100 - (DEEP_IMPORTS * 100 / TOTAL_FILES)))
  }
}
EOF

# Génération du rapport Markdown
cat > "$ARCH_OUTPUT_DIR/report.md" << EOF
### 🏗️ Architecture Complexity Analysis

#### 🎯 T3-T4 Strategy Progress
- **Current Contexts**: $TOTAL_CONTEXTS (Target: <10)
- **Reduction Needed**: $((TOTAL_CONTEXTS - 10)) contexts
- **Coupling Level**: $((DEEP_IMPORTS * 100 / TOTAL_FILES))% files with deep imports

#### 🔍 Critical Modules Status
| Module | Lines | Priority | T4 Action |
|--------|--------|----------|-----------|
| 🔐 AuthWrapper | $AUTH_WRAPPER_COMPLEXITY | HIGH | React Query migration |
| 📍 LocationWrapper | $LOCATION_WRAPPER_COMPLEXITY | MEDIUM | Zustand migration |
| 🔄 useSync | $USE_SYNC_COMPLEXITY | CRITICAL | Complete refactor |
| 🎭 useCtaWordingAndAction | $CTA_COMPLEXITY | MEDIUM | Logic simplification |

#### 📊 Architecture Health Indicators
- ⚡ React Query files: $REACT_QUERY_FILES (modern pattern adoption)
- 🎣 Custom hooks: $CUSTOM_HOOKS (modularity indicator)
- 🔗 Modularity score: $((100 - (DEEP_IMPORTS * 100 / TOTAL_FILES)))% (higher is better)

#### 💡 T4 Architecture Priorities
1. **AuthWrapper** (80 usages) → React Query + coordination cross-squads
2. **useSync** (606 lines) → URL source of truth + Zustand
3. **LocationWrapper** (30 usages) → Zustand for local UI state
4. **Bundle impact monitoring** during all migrations

*This analysis tracks the architectural evolution supporting T3-T4 performance goals*
EOF

echo "✅ Architecture complexity analysis complete!"
echo "📊 Results saved in $ARCH_OUTPUT_DIR/"
echo "🎯 Ready for T4 collaborative architecture refactors"