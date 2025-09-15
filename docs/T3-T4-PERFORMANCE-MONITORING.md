# 🎯 T3-T4 Performance Monitoring Guide

Ce guide explique comment utiliser le système de monitoring de performance mis en place pour supporter la stratégie T3-T4.

## 📋 Contexte Stratégique

### Objectifs T3-T4
- **Android Performance**: P90 35s → 7s sur Home
- **Bundle Size**: Android <15MB, iOS <25MB  
- **Architecture**: Réduction contexts 46 → <10
- **Accessibilité**: Audit Access42 complété fin novembre

### Modules Critiques
- **AuthWrapper** (80 usages) - Priority HIGH
- **LocationWrapper** (30 usages) - Priority MEDIUM
- **useSync** (606 lines) - Priority CRITICAL
- **useCtaWordingAndAction** - Priority MEDIUM

## 🚀 Workflows CI/CD

### 1. Monitoring Automatique sur PR

**Fichier**: `.github/workflows/dev_on_pull_request_performance_monitoring.yml`

**Déclenchement automatique** sur:
- Changes dans `src/features/auth/context/**`
- Changes dans `src/libs/location/**`
- Changes dans `src/**/*Wrapper*` ou `src/**/*Context*`
- Changes dans `package.json`

**Désactivation**: Ajouter le label `skip-performance`

### 2. Enhanced Reassure Tests  

**Fichier**: `.github/workflows/dev_on_pull_request_reassure.yml` (mis à jour)

**Nouveautés**:
- Context T3-T4 dans les rapports
- Détection modules critiques
- Artifacts de performance sauvegardés

### 3. Android Deep Analysis

**Activation**: Ajouter le label `android-performance` ou `[PERF]` dans le titre PR

**Fonctionnalités**:
- Build Android pour analyse bundle
- Profiling performance Android
- Vérification objectif <15MB

## 🛠️ Scripts Disponibles

### Bundle Analysis
```bash
# Analyse complète bundle size
./scripts/analyze_bundle_size.sh

# Android spécifique  
./scripts/android_bundle_analysis.sh
```

### Performance Analysis
```bash
# Profiling Android (investigation P90 35s)
./scripts/android_performance_profile.sh

# Comparaison avec master
./scripts/compare_performance_with_master.sh
```

### Architecture Analysis
```bash
# Complexité architecturale
./scripts/analyze_architecture_complexity.sh
```

### Accessibility Analysis  
```bash
# Impact accessibilité (audit Access42)
./scripts/analyze_accessibility_impact.sh
```

### Rapport Global
```bash
# Génère rapport complet T3-T4
./scripts/generate_performance_report.sh
```

## 📊 Nouveaux Scripts NPM

Ajoutez dans votre `package.json`:

```json
{
  "scripts": {
    "test:unit:performance": "jest --testMatch='**/*performance*.test.{ts,tsx}' --verbose",
    "test:a11y:impact": "./scripts/analyze_accessibility_impact.sh",
    "test:bundle:analysis": "./scripts/analyze_bundle_size.sh", 
    "test:architecture:complexity": "./scripts/analyze_architecture_complexity.sh",
    "performance:android:deep": "./scripts/android_performance_profile.sh",
    "performance:report": "./scripts/generate_performance_report.sh",
    "t3-t4:monitor": "yarn test:bundle:analysis && yarn test:a11y:impact && yarn test:architecture:complexity && yarn performance:report"
  }
}
```

## 🔍 Comment Surveiller vos Refactors T3-T4

### Pour AuthWrapper Migration
1. **Avant**: Run `yarn t3-t4:monitor` pour baseline
2. **Pendant**: Chaque PR testé automatiquement  
3. **Après**: Vérifier réduction complexity + performance

### Pour Investigation Android 35s
1. **Label PR**: `android-performance`
2. **Review**: Bundle analysis + profiling
3. **Target**: Identifier causes P90 35s

### Pour Corrections Accessibilité
1. **Monitoring auto**: Changes détectés sur `src/**`
2. **Progress**: Compliance rate trackée
3. **Deadline**: Fin novembre objective

## 📈 Rapports Générés

### Locations
- `.performance-baseline/` - Métriques performance
- `.bundle-analysis/` - Analyse bundle size
- `.accessibility-analysis/` - Compliance accessibilité
- `.architecture-analysis/` - Complexité modules

### Contenu PR
- 📊 Bundle size analysis avec status vs targets
- ♿ Accessibility compliance rate et issues
- 🏗️ Architecture complexity evolution
- 📱 Android performance profiling (si activé)

## 🎯 KPIs T3-T4 Trackés

### Performance
- ✅ Reassure render count/duration
- ⏱️ TTI metrics (react-native-performance)
- 📱 Android P90 tracking
- 🔄 Bundle size evolution

### Architecture  
- 📊 Context count (46 → <10)
- 🔗 Coupling level (deep imports)
- ⚡ React Query adoption
- 🎣 Custom hooks modularity

### Accessibilité
- ♿ Files with a11y patterns
- 🏷️ Components with labels/roles/hints
- 📈 Compliance rate evolution
- ✅ Access42 audit progress

## ⚠️ Alerts & Thresholds

### Bundle Size
- ❌ Android >15MB = PR blocked
- ❌ iOS >25MB = PR blocked

### Performance
- ⚠️ Render count increase = Warning
- ❌ Significant duration regression = Review required

### Architecture
- 📊 Deep imports increase = Coupling warning
- 🔍 New contexts = Architectural review

## 🤝 Support & Questions

- **Architecture Guild**: Pour patterns et decisions
- **Tech Leads**: Pour priorisation et escalation
- **Lucas**: Pour supervision accessibilité
- **Squad leads**: Pour coordination cross-squad

---

*Ce système de monitoring supporte activement la stratégie T3-T4 collaborative*