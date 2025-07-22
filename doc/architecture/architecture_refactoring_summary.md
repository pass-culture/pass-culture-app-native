# Archive Complète - Refonte Architecture Pass Culture App Native

## Contexte du Projet

### Application
- **Nom** : Pass Culture App Native
- **Type** : Application mobile/web React Native + TypeScript
- **Repository** : https://github.com/pass-culture/pass-culture-app-native
- **Âge** : 4+ ans
- **Équipe** : Développeurs frontend, tech lead, engineering manager
- **Technologies** : React Native, TypeScript, React Query, nombreux Context React

### Problèmes Identifiés

#### Performance
- **Page accueil-thématique** : LCP 15s, INP 1s (page très visitée)
- **Bundle size** : Impact des 20+ Context React au démarrage
- **Re-renders** : Cascades causées par les Context providers

#### Maintenabilité
- **Hook Hell** : `useCtaWordingAndAction` complexité cognitive 58
- **Context Hell** : 20+ Context providers au démarrage
- **Logique métier** : Dispersée dans hooks non testables
- **Tests** : Vérifient l'implémentation, pas les comportements métier

#### Configuration Sous-optimale
- **React Query** : `retry: 0` (pas de resilience réseau)
- **Error Boundary** : `useErrorBoundary: true` (erreurs remontent toujours)
- **Transformations data** : Côté client au lieu du backend

## Audit Technique Détaillé

### État Actuel de l'Architecture

#### Gestion d'État Problématique
```
20+ Context React :
- ReactQueryClientProvider, ThemeProvider, SafeAreaProvider
- AuthWrapper, LocationWrapper, SearchWrapper
- FavoritesWrapper, SettingsWrapper
- CulturalSurveyContextProvider, etc.

Problèmes :
- Re-renders massifs lors des modifications
- Couplage fort entre composants
- Tests complexes (mocks multiples requis)
- Performance dégradée
```

#### Complexité des Hooks
```
useCtaWordingAndAction.ts :
- Complexité cognitive : 58 (critique)
- Hook appelant de multiples hooks
- Logique métier non isolée
- Tests fragiles
```

#### Composants Boutons/Liens
```
Hiérarchie complexe :
ButtonPrimary → AppButton → TouchableOpacity
InternalTouchableLink → TouchableLink → TouchableOpacity
- Duplication de code
- Propriété 'as' problématique pour le typage
- Nommage descriptif vs sémantique
```

### Métriques de Performance Actuelles
- **Coverage tests** : 90% (mais teste l'implémentation)
- **Sentry - accueil-thématique** : Top pages lentes
- **LCP** : 10-15s sur pages critiques
- **INP** : 1s (freeze interface)
- **Erreurs réseau** : Top 1 erreurs Sentry (retry: 0)

## Solutions Architecturales Proposées

### Vision Cible

#### Séparation État App/Server
```
Server State (React Query) :
- Tous les appels API : backend, firebase, algolia, contentful
- Cache automatique, retry, offline support
- Selectors pour transformations data
- Configuration optimisée

App State (Zustand) :
- États locaux utilisateur (localisation, préférences)
- Stores unitaires par responsabilité
- Performance optimisée (pas de re-renders excessifs)
- API simple et cohérente
```

#### Architecture Composants
```
Pages :
- Accès navigation (URL params)
- Appel queries principales
- Délégation aux containers

Containers :
- Connexion aux stores (Zustand/React Query)
- Logique métier dans fonctions pures
- Tests comportementaux

Presentational Components :
- Props uniquement
- Fonctions pures
- Réutilisables
- Tests unitaires simples
```

#### Navigation Stateless
```
URL comme source de vérité :
- Toutes les pages accessibles par URL
- Paramètres URL déterminent l'état
- Deeplinks fonctionnels
- Tests E2E simplifiés
```

### Technologies Sélectionnées

#### Zustand (App State)
- **Taille** : <1kB gzippé
- **Performance** : Pas de re-renders excessifs
- **API** : Simple, pas de boilerplate
- **TypeScript** : Support natif
- **Middleware** : DevTools, persistence, etc.

#### React Query (Server State)
- **Standard industrie** pour état serveur
- **Cache intelligent** : Déduplication, invalidation
- **Resilience** : Retry automatique, error handling
- **Offline** : Support natif
- **Selectors** : Transformations optimisées

#### Fonctions Pures (Logique Métier)
- **Testabilité** : Tests unitaires simples
- **Réutilisabilité** : Pas de couplage React
- **Maintenabilité** : Logique isolée et claire
- **Performance** : Pas d'effets de bord

## Approches de Migration Analysées

### Approche 1 : Couches Horizontales (Proposition Initiale)
```
Phase 1 : Isolation toutes les queries
Phase 2 : Migration tous les contexts → Zustand  
Phase 3 : Séparation tous les composants
Phase 4 : Refonte navigation complète

Durée : 6-12 mois
```

**Avantages :**
- Architecture cohérente finale
- Pas de cohabitation complexe
- Standards unifiés

**Inconvénients :**
- Pas de feedback rapide (valeur en fin)
- Risque Big Bang déguisé
- Hypothèses non validées rapidement
- Équipe démotivée (pas de résultats visibles)

### Approche 2 : Slices Verticaux (Recommandation EM)
```
Slice 1 : Page accueil-thématique (LCP 15s → 3s)
Slice 2 : Parcours réservation (useCtaWordingAndAction)
Slice 3 : Module recherche (useSync.ts)
Etc.

Durée par slice : 2-4 semaines
```

**Avantages :**
- Valeur business immédiate
- Feedback rapide et validation
- Motivation équipe (succès réguliers)
- Pivot possible selon apprentissages

**Inconvénients :**
- Risque incohérence entre modules
- Cohabitation ancien/nouveau complexe
- Duplication temporaire de patterns

### Approche 3 : Strangler Fig Pattern
```
Nouvelle architecture complète en parallèle
Feature flags pour migration progressive
Duplication assumée temporairement
```

**Avantages :**
- Architecture cohérente garantie
- Pas de régression sur legacy
- Migration contrôlée

**Inconvénients :**
- Investissement initial énorme
- Duplication de code importante
- Pas de feedback avant migration

### Approche 4 : Hybrid - Fondations puis Slices
```
Phase 1 (4-6 semaines) : Fondations
- Config React Query optimisée
- Premiers stores Zustand
- Standards et outils développeurs

Phase 2 : Slices sur fondations
- Modules par priorité business
- Architecture cohérente assurée
```

**Avantages :**
- Équilibre feedback/cohérence
- Risques techniques maîtrisés
- Fondations solides pour l'équipe

**Inconvénients :**
- Délai avant premiers bénéfices
- Investissement initial nécessaire

## Critères de Décision

### Facteurs Techniques
- **Couplages cachés** : Complexité réelle des interdépendances
- **Maturité équipe** : Niveau React Query/Zustand
- **Infrastructure CI/CD** : Capacité à gérer la complexité
- **Tests existants** : Qualité et couverture comportementale

### Facteurs Business
- **Priorités produit** : Performance vs nouvelles features
- **Tolérance régressions** : Acceptation des risques temporaires
- **Budget tech debt** : Ressources allouées au refactoring
- **Pression délais** : Urgence des livraisons

### Facteurs Équipe
- **Niveau technique** : Senior vs mixte
- **Turn-over** : Stabilité de l'équipe
- **Motivation** : Appétence pour le refactoring
- **Formation** : Capacité d'apprentissage nouvelles techno

## Métriques de Succès

### Performance
- **LCP** : <3s sur toutes les pages critiques
- **INP** : <200ms (pas de freeze interface)
- **Bundle size** : Réduction attendue avec suppression contexts
- **Erreurs réseau** : -70% avec retry policy optimisée

### Développeur Experience
- **Vélocité équipe** : Temps cycle features
- **Coverage comportementale** : Tests métier vs implémentation
- **Complexité cognitive** : <15 sur fonctions critiques
- **Time to onboard** : Nouveaux développeurs

### Business Impact
- **Taux conversion** : Pages performance améliorées
- **Taux erreur production** : Réduction bugs
- **Satisfaction utilisateur** : UX metrics
- **Time to market** : Nouvelles features

## Recommandations Finales

### Approche Optimale Recommandée : Hybrid Modéré

```
Sprint 1-2 : Quick Wins + Fondations Légères
- Config React Query (retry, error handling)
- Migration 2-3 contexts simples → Zustand
- Standards stricts nouvelles features
- Formation équipe outils

Sprint 3+ : Slices Business Critiques
- Page accueil-thématique (impact immédiat)
- Validation patterns avant généralisation
- Modules par priorité business/performance
- Ajustements selon apprentissages
```

### Critères d'Arrêt/Pivot
- **Sprint 2** : Évaluation adoption équipe nouveaux outils
- **Sprint 4** : Métriques performance première slice
- **Sprint 6** : Validation cohérence architecture
- **Sprint 8** : ROI vs effort restant

### Plan de Gestion Risques
- **Formation équipe** : Sessions Zustand/React Query
- **Rollback strategy** : Feature flags par module
- **Monitoring renforcé** : Alerts performance/erreurs
- **Communication stakeholders** : Updates réguliers ROI

## Livrables et Templates

### Standards de Code
```typescript
// Store Zustand type
interface LocationStore {
  latitude: number | null
  longitude: number | null
  setLocation: (lat: number, lng: number) => void
}

// Query avec selector
const useArtistsQuery = (options?: UseQueryOptions) =>
  useQuery({
    queryKey: ['artists'],
    queryFn: fetchArtists,
    ...options
  })

// Fonction métier pure
const calculateDiscountPrice = (price: number, discount: number): number =>
  Math.round(price * (1 - discount / 100))

// Component structure
const ArtistPage = () => {
  const { artistId } = useRoute().params
  return <ArtistContainer artistId={artistId} />
}

const ArtistContainer = ({ artistId }: Props) => {
  const { data: artist } = useArtistQuery(artistId)
  const { setFavorite } = useFavoritesStore()
  
  return (
    <ArtistCard 
      name={artist.name}
      onFavorite={() => setFavorite(artistId)}
    />
  )
}
```

### Checklist Migration
- [ ] Tests comportementaux en place
- [ ] Métriques before/after définies
- [ ] Rollback strategy validée
- [ ] Formation équipe effectuée
- [ ] Standards documentés
- [ ] Monitoring configuré

Cette archive fournit une base complète pour tout IA ou équipe reprenant le contexte de refonte architecturale.