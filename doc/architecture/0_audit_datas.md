# Plan Architecture Consolidé - Audit Technique Pass Culture

## 🎯 **Quantification Contextes - 28 createContext identifiés**

### **Distribution par usage (analyse useContext/useTheme/useAuth)**

| Context Type | Utilisations | Priorité Migration | Stratégie |
|--------------|-------------|-------------------|-----------|
| **useTheme** | ~180 usages | **P0** | ✅ Garder (styled-components) |
| **useAuthContext** | ~80 usages | **P1** | 🔄 Migrer vers react-query |
| **useContext(autres)** | ~20 usages ⚠️ *ESTIMATION* | **P2** | 🔄 Évaluer cas par cas |

**Calcul impact** : 28 contextes créés ≠ 28 providers actifs
- **App.tsx** : 22 providers (au runtime)
- **Feature contexts** : 6 contextes locaux (MovieCalendar, etc.)

### **Contextes prioritaires pour Phase 2 - SUPPOSITION Pierre**
⚠️ **HYPOTHÈSE** basée sur fréquence usage + complexité audit Bruno :
1. **AuthWrapper** (80 usages confirmés) → react-query migration
2. **LocationWrapper** (usage search intégré) → Zustand  
3. **SearchWrapper** (audit mentionne useSync complexe) → URL source vérité
4. **SettingsWrapper** (audit suggère react-query) → react-query

**❌ À CONFIRMER** avec analyse impact business réelle

---

## 🔧 **Correction Framework & Tooling**

### **DevTools Context → State Management**
❌ **Erreur** : "Redux DevTools vs React DevTools"
✅ **Correct** : 
- **Zustand** : Redux DevTools integration natives
- **React Query** : React Query DevTools dédiées
- **Context** : React DevTools context inspection (complexe)

### **SonarQube Complexity Analysis**
**Cloud SonarQube access** :
```bash
# Via SonarQube API
curl -u token: "https://sonarcloud.io/api/measures/component?component=pass-culture_pass-culture-app-native&metricKeys=complexity,cognitive_complexity"

# Ou local analysis
npx sonar-scanner -Dsonar.projectKey=local-analysis -Dsonar.sources=src/
```

### **Estimation Scale - Sprints vs Jours**
**❌ Sprints** : Variable selon équipe (1-3 semaines)
**✅ Jours/personne** : Plus précis pour planning

| Effort | Jours | Équivalent | Exemples |
|---------|-------|------------|----------|
| **XS** | 1-2j | Config change | React Query config |
| **S** | 3-5j | Component refactor | Settings → react-query |
| **M** | 8-12j | Feature migration | SearchWrapper partial |
| **L** | 15-25j | Architecture change | Auth → react-query |
| **XL** | 30+j | Core refactor | useSync elimination |

---

## 🐛 **Bug Correlation - Analyse Sentry**

### **Commands Correction & Extension**

**97 commits context/provider** → Bon indicateur maintenance burden

**Sentry correlation stratégies** :
```bash
# Top errors par module
sentry-cli issues list --query="level:error" --format=json | jq '.[].metadata.filename' | sort | uniq -c | sort -rn

# Errors context-related
sentry-cli issues list --query="SearchWrapper OR useSync OR AuthContext" --period="3mo"

# Stack trace analysis
sentry-cli issues list --query="level:error" --format=json | jq '.[].stacktrace.frames[].filename' | grep "Context\|Provider" | sort | uniq -c
```

### **Modules Critiques - SUPPOSITION basée audit Bruno**
⚠️ **SUPPOSITION** : Pas de données Sentry réelles analysées
Hypothèse basée sur :
- Audit Bruno mentionne "SearchWrapper + useSync = source bugs"
- AuthContext refresh token = historique problèmes
- LocationWrapper = permissions mobile complexes

**❌ À VALIDER** avec vraies données Sentry :
1. **features/search/** (supposé: SearchWrapper + useSync)
2. **features/auth/** (supposé: AuthContext refresh token)  
3. **features/location/** (supposé: LocationWrapper permissions)

---

## 🔍 **Legacy Files Analysis - Top 10 Volumineux**

### **153 fichiers >200 lignes - Top 10**
```bash
# Top 10 plus gros fichiers
find src/features/ -name "*.ts*" -exec wc -l {} \; | sort -rn | head -10

# Avec noms de fichiers
find src/features/ -name "*.ts*" -exec wc -l {} \; | sort -rn | head -10 | awk '{print $2 " (" $1 " lignes)"}'
```

### **Risk Matrix Estimation - MÉTHODO THÉORIQUE**
⚠️ **SUPPOSITION** : Corrélation size/complexity/dependencies
| Métrique | Impact | Tool | Status |
|----------|--------|------|--------|
| **Size >500 lignes** | Maintenabilité ⚠️ | `wc -l` | ✅ MESURABLE |
| **Complexity >15** | Bug risk 🔴 | SonarQube API | ❌ À IMPLÉMENTER |
| **Dependencies >10** | Change impact 🔴 | `madge --json` | ❌ À IMPLÉMENTER |

---

## 📊 **Dependabot Analysis Correction**

### **2723 commits = Query trop large**
**Correction query** :
```bash
# Dependabot seulement
git log --grep="dependabot" --since="6 months ago" --oneline | wc -l

# Séparation par type
git log --grep="^build(deps)" --since="6 months ago" --oneline | wc -l  # Dependencies
git log --grep="^feat\|^fix" --grep="upgrade" --since="6 months ago" --oneline | wc -l  # Features
```

### **Expo Migration ROI Analysis - ESTIMATION HYPOTHÉTIQUE**
⚠️ **SUPPOSITION** : Pas de mesure précise effort actuel

**Current effort/month** ⚠️ *ESTIMÉ* :
- Dependabot : ~15 PRs/mois (*à confirmer avec query corrigée*)
- Manual updates : ~5 RN ecosystem updates (*basé expérience générale*)
- Breaking changes : ~2 major updates/trimestre (*hypothèse industrie*)

**Expo comparison** ⚠️ *THÉORIQUE* :
- SDK updates : 1 major/trimestre (*doc Expo*)
- Managed dependencies : ~80% automatisé (*claim Expo*)
- **ROI estimé** : -60% effort maintenance (*SUPPOSITION à valider*)

---

## 🎯 **Phases Consolidées - Plan Architecture**

### **Phase 1: Non-Breaking Foundation (T3 - 2 mois)**
**Quick wins identifiés** :

| Action | Effort | ROI Immédiat | Owner |
|--------|--------|--------------|-------|
| **React Query config fix** | 1j | Network resilience | Squad Activation |
| **Bundle analyzer setup** | 2j | Performance baseline | Squad Découverte |
| **ESLint context rules** | 2j | Prevent context proliferation | Tech Lead |
| **Performance dashboard** | 5j | Monitoring Vision 2025 | Squad Conversion |

### **Phase 2: Core Refactor (T4-T1 - 4 mois)**
**Priority par usage + impact** ⚠️ *Effort = ESTIMATION Pierre* :

| Context | Usages | Migration | Effort | Business Impact |
|---------|--------|-----------|--------|-----------------|
| **AuthWrapper** | 80 ✅ *CONFIRMÉ* | → react-query | L (20j) ⚠️ *ESTIMÉ* | 🔴 Critical (auth flows) |
| **LocationWrapper** | ~30 ⚠️ *SUPPOSÉ* | → Zustand | M (12j) ⚠️ *ESTIMÉ* | 🟡 High (search/home) |
| **SettingsWrapper** | ~15 ⚠️ *SUPPOSÉ* | → react-query | S (5j) ⚠️ *ESTIMÉ* | 🟢 Medium (UX config) |

### **Phase 3: Feature-Driven (T1-T2 2026 - 6 mois)**
**Vertical slices** ⚠️ *Tous efforts = ESTIMATIONS Pierre* :

| Feature | Contexts Impacted | Effort | Business Value |
|---------|-------------------|--------|----------------|
| **Search Refactor** | SearchWrapper, useSync | XL (40j) ⚠️ *ESTIMÉ* | 🔴 Critical UX |
| **Home Performance** | Multiple contexts ⚠️ *À DÉFINIR* | L (25j) ⚠️ *ESTIMÉ* | 🟡 Performance Vision 2025 |
| **Offer CTA** | useCtaWordingAndAction | M (15j) ⚠️ *ESTIMÉ* | 🟢 Business logic clarity |

---

## 📈 **Success Metrics & Monitoring**

### **Baseline Established**
- **Contexts count** : 28 createContext, 22 providers App.tsx
- **Performance** : P95 ~4s (target <2s)
- **Maintenance** : 97 context-related commits historique
- **Bundle** : ~2.8MB (target <2MB)

### **Migration Tracking**
```typescript
// ESA Dashboard integration
const architectureMigrationMetrics = {
  contextsCount: 28, // Target: 8-10
  authMigrationProgress: 0, // Target: 100%
  performanceP95: 4000, // Target: <2000ms
  bundleSize: 2.8, // Target: <2MB
}
```

### **Phase Gates**
- **Phase 1 Complete** : Bundle analyzer + React Query resilience
- **Phase 2 Complete** : Auth/Location/Settings → new patterns
- **Phase 3 Complete** : Search refactor + performance targets

---

## 🔄 **Next Actions Immédiates**

### **Cette semaine**
1. **Top 10 legacy files** : Exécuter command corrigée
2. **SonarQube API** : Setup complexity analysis automatisée
3. **Dependabot analysis** : Query correction pour effort réel
4. **Context prioritization** : Finaliser ordre Phase 2

### **Mardi présentation**
- Plan 3 phases avec métriques baselines
- ROI estimé par phase (bundle, performance, maintenance)
- Timeline réaliste avec quick wins T3

---

*Plan consolidé Pierre Canthelou - Basé sur audit Bruno + analyse quantitative réelle*