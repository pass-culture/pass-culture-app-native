## Plan de migration

### Phase 1: Fondation et Formation (T3 - 2 mois)

**Objectif** : Établir nouvelles fondations sans casser l'existant et former les développeurs aux principes

**Actions prioritaires gérées par Tech Lead ou Guilde Archi :**

- React Query configuration optimisée
- Bundle analyzer setup pour baseline
- ESLint rules anti-prolifération des contextes et autres règles de restriction et d’accompagnement
- Finir les templates et la documentation des nouveaux patterns
- Faire un POC de refactor d’un context pour illsutrer la méthodo

**Pain points adressés :**

- Environment test instable → Setup React Query stable
- Pas de baseline performance → Bundle analyzer + métriques avec la guilde et les autres OKR du trimestre

==:children_crossing: Les leads et la guilde archi, les développeurs séniors, sont là pour accompagner les squads.==

### Phase 2: Core Refactor (T4-T1 - 4 mois en J/Homme) - T4 en squad

**Objectif** : Migrer les contexts les plus utilisés

**Migrations prioritaires :**

- **AuthWrapper** (80 usages) → React Query
- **LocationWrapper** (~30 usages) → Zustand
- **SettingsWrapper** (~15 usages) → React Query

**Pain points adressés :**

- 28 contexts → ~15 contexts (-50%)
- Performance P95 améliorée (auth + location optimisés)
- Maintenance réduite

==:information_desk_person: Il serait possible de diviser le travail par squad et d’en faire des objectifs pour fin T4==

- ==AuthWrapper :arrow_right: Activation==
- ==LocationWrapper :arrow_right: Conversion==
- ==SettingsWrapper :arrow_right: Découverte==

### Phase 3: Feature-Driven (T1-T2 2026 - 6 mois en J/Homme) - T1 en squad

**Objectif** : Refactor complet par slices verticales (feature driven)

**Refactors majeurs :**

- Search complet (SearchWrapper + useSync)
- Home performance optimization
- Offer display 

**Pain points adressés :**

- Contexts count : 15 → <10 (objectif final)
- Performance : P95 <2s atteint
- Bundle size : objectifs Vision 2025 atteints avec 6 mois de « retard » max

==:information_desk_person: Il serait possible de diviser le travail par squad et d’en faire des objectifs pour fin T1==

- ==Home performance optimization :arrow_right: Activation==
- ==Search complet (SearchWrapper + useSync) :arrow_right: Conversion==
- ==Offer CTA simplification :arrow_right: Découverte==