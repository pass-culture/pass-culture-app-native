# RFC001 — Réarchitecture de la page Offre

> **Statut : Proposition (à débattre)**
> Auteur : Xavier De Koninck · Date : 2026-05-20 · Relecteurs : équipe app-native
>
> Ce document est un **RFC** (Request For Comments) : il sert de support de débat. Il **n'écrit pas de code applicatif** et **n'installe aucune dépendance**. Une fois les décisions tranchées en équipe, elles seront figées dans des **ADR** (voir l'annexe).

---

## 0. Note sur les ADR existants

Ce RFC prend volontairement de la distance avec les décisions d'architecture déjà écrites (`doc/decision-records/`). L'objectif est de **repartir d'une feuille blanche** sur la structuration de la page Offre, de comparer les approches possibles sans a priori, puis de **réécrire les ADR** à partir des conclusions retenues ici. Les ADR à dériver sont listés en [annexe](#annexe--adr-à-dériver-de-ce-rfc).

Deux contraintes sont en revanche **posées d'emblée** (non négociées dans ce RFC) :

- **Zustand** est le modèle pour l'**état local** (UI, navigation interne à la page, sélections).
- **React Query** est le modèle pour l'**état serveur** (offre, réservations, favoris, etc.).

---

## 1. Contexte & problème

La page Offre (`src/features/offer`) est le point d'entrée le plus visité du parcours de réservation. Elle a grossi par accrétion et concentre aujourd'hui une dette d'architecture qui ralentit chaque évolution et rend les tests difficiles.

### 1.1 Audit chiffré de l'existant

| Symptôme | Mesure | Fichier |
|---|---|---|
| Composant conteneur monolithique | **546 lignes**, **21 hooks/queries**, **70+ imports** | `components/OfferContent/OfferContentBase.tsx` |
| Moteur de décision du CTA | **511 lignes**, **30+ branches** conditionnelles, logique + data-fetching + analytics mêlés | `helpers/useCtaWordingAndAction/useCtaWordingAndAction.ts` |
| Prop-drilling | **24+ props** sur la chaîne `Offer → OfferContent → OfferContentBase → OfferBody` | `pages/Offer/Offer.tsx`, `components/OfferBody/OfferBody.tsx` |
| Queries sans transformation | **10 queries sur 12 sans selector** dédié | `queries/` |
| Composant agrégateur | `OfferBody` **1056 lignes** ; `OfferVenueBlock` **947 lignes** ; `MoviesScreeningCalendar` **1373 lignes** sur 11 fichiers | `components/` |
| État local fragmenté | `useState` / `useModal` dispersés (page Offre : 4 états ; `OfferCTAProvider` : 3 `useState`) | `pages/`, `components/` |

### 1.2 Symptômes qualitatifs

- **Logique métier non testable sans React.** Exemple : `useHasEnoughCredit` mêle calcul de crédit par devise, accès `useAuthContext` et query de taux de change. On ne peut pas tester la règle « a-t-il assez de crédit ? » sans monter un arbre React + des mocks de queries.
- **Logique métier dans des callbacks de mutation.** Exemple : `onSuccess` de `useAddFavoriteMutation` contient une règle « offre coming-soon ? » + un mapping de params analytics.
- **Aucune frontière claire** entre accès données / règles métier / présentation : un même fichier importe `api/gen`, `features/*`, `queries/*`, `ui/*`.
- **Couplage en cascade** : changer une donnée en haut impose de modifier toute la chaîne de props.

### 1.3 Un point de départ encourageant : `offerRefacto`

Un répertoire `src/features/offerRefacto` amorce déjà un meilleur découpage, qui sert de **socle** à ce RFC :

- découpage en **3 fichiers** par composant : `Component.tsx` (orchestrateur) → `useComponent.ts` (construit un **ViewModel** typé) → `ComponentView.tsx` (présentation **pure**) ;
- des `helpers/offerX.ts` qui sont des **fonctions pures** composables (ex. `offerCTASelection.ts`, `offerPrice.ts`) ;
- une stratégie de tests alignée (helper pur / hook via `renderHook` / vue).

Le présent RFC consiste largement à **nommer, généraliser et compléter** cette direction sous forme de couches **logiques** (sans introduire de nouveaux dossiers, cf. §5).

### 1.4 Conventions projet déjà disponibles (à réutiliser)

| Brique | Convention existante | Emplacement |
|---|---|---|
| État local (Zustand) | Wrapper maison `createStore({ name, defaultState, actions, selectors, options })`, persistance optionnelle via `AsyncStorage`, sélecteurs `select*` auto-convertis en hooks `use*` | `src/libs/store/createStore.ts` |
| État serveur (React Query) | `use{Entity}Query` / `use{Entity}Mutation`, clés centralisées `QueryKeys`, `select` pour transformer | `src/queries/`, `src/libs/queryKeys.ts` |
| Adapters | `{input}To{output}.ts` : DTO API → type domaine | `src/features/*/adapters/` |
| FP « vanilla » | `lodash`, `date-fns`, discriminated unions TS ; **pas** de lib FP dédiée | `package.json` |
| Validation | **`yup`** (`^0.32.11`) via `react-hook-form` | `package.json` |

---

## 2. Objectifs, non-objectifs et contraintes

### 2.1 Objectifs

1. **Testabilité du domaine sans React** : les règles métier (CTA, prix, éligibilité, crédit) doivent être des fonctions pures testables en isolation.
2. **Séparation des préoccupations** : présentation, orchestration, données et règles métier dans des couches distinctes.
3. **Réduction du couplage et du prop-drilling**.
4. **Cohérence avec le projet** : réutiliser le vocabulaire de dossiers déjà en place (`helpers`, `hooks`, `queries`, `store`, `adapters`, `components`, `pages`) plutôt que d'introduire des noms de couches étrangers.
5. **Programmation fonctionnelle** comme style par défaut du domaine (fonctions pures, immutabilité, composition).

### 2.2 Non-objectifs

- Réécrire le design system ou les composants UI génériques (`ui/`).
- Changer la lib d'état serveur ou local (RQ et Zustand sont **posés**).
- Migrer d'autres pages dans le cadre de ce RFC (mais le pattern doit être généralisable).

### 2.3 Contraintes

- **Zustand** = état local ; **React Query** = état serveur.
- TypeScript strict, React Native (+ cibles web/native).
- Pas de régression fonctionnelle ni d'analytics.

---

## 3. Principes directeurs

Quel que soit le pattern retenu, ces principes guident la décision :

- **Dependency rule, exprimée comme une règle d'imports** : on ne crée **pas** de nouveaux dossiers de couches. On projette les couches sur les dossiers **déjà conventionnels** du projet (`helpers`, `hooks`, `queries`, `store`, `adapters`, `components`, `pages`) et on contraint la **direction des dépendances par les imports** (idéalement via `no-restricted-imports`) :
  - `helpers/` (cœur pur) **n'importe ni React, ni `queries/`, ni `store/`, ni la navigation** ;
  - `hooks/` (orchestration) peut importer `helpers/`, `queries/`, `store/` ;
  - `components/`, `pages/` (présentation) ne contiennent **aucune règle métier**.
- **Functional core / imperative shell** : un **cœur fonctionnel** pur (décisions, calculs) dans `helpers/`, entouré d'une **coquille impérative** mince (`hooks/`, effets, I/O).
- **Humble object** pour la présentation : les composants de rendu sont « bêtes » ; toute la logique est extraite dans des unités testables.
- **Screaming architecture** : c'est `features/offer/` qui raconte le métier ; à l'intérieur, on conserve le vocabulaire technique habituel du projet.
- **Test ce qui décide** : la valeur de test se concentre sur le cœur pur (`helpers/`) et les hooks d'orchestration.

> Règle empirique : *si un dossier de feature peut être supprimé sans casser les autres features, l'architecture est saine.*

> **Point clé** : « clean architecture » ici = **direction de dépendances**, **pas** des noms de dossiers. On garde les dossiers maison (cf. §5).

---

## 4. Comparaison « feuille blanche » des patterns candidats

Quatre approches structurantes ont été envisagées.

### 4.1 MVVM (Model–View–ViewModel) côté React

Chaque composant = **View pure** + **ViewModel** (un hook qui assemble données + état + handlers et expose un objet prêt à afficher). C'est exactement ce qu'amorce `offerRefacto` (`useOfferHeader → OfferHeaderViewModel → OfferHeaderView`).

- ➕ Naturel en React (le hook EST le ViewModel) ; testable via `renderHook` ; supprime le prop-drilling (la View ne reçoit qu'un ViewModel) ; déjà amorcé dans le code.
- ➖ Ne dit **rien** sur l'isolation des règles métier : un ViewModel peut redevenir un monolithe (cf. `useCtaWordingAndAction`). MVVM **organise la présentation**, pas le domaine.

### 4.2 Hexagonal / Ports & Adapters

Le domaine est au centre, isolé derrière des **ports** (interfaces) ; RQ, Zustand, la navigation sont des **adapters** branchés sur ces ports.

- ➕ Isolation maximale du domaine ; règles métier 100 % pures et testables ; remplaçabilité des dépendances ; cadre conceptuel solide pour la *dependency rule*.
- ➖ Le formalisme « ports » complet (interfaces + injection) est **lourd** pour une app front où RQ/Zustand sont déjà des abstractions. Risque de sur-ingénierie si appliqué à la lettre.

### 4.3 Redux-like / store central (Redux Toolkit, XState)

Centraliser l'état de la page (et parfois la logique) dans un store global ou une machine à états.

- ➕ Flux d'état explicite ; bon pour des machines d'états complexes (un *state chart* du CTA serait élégant).
- ➖ **Redondant** avec les contraintes posées : RQ gère déjà le cache serveur, Zustand l'état local. Ajouter Redux/XState créerait une 3ᵉ source de vérité et un nouveau paradigme à apprendre. Va à l'encontre du pragmatisme actuel.

### 4.4 Feature-Sliced Design (FSD)

Méthodologie de découpage en couches standardisées (`shared / entities / features / widgets / pages`).

- ➕ Découpage normé et scalable à l'échelle de l'app.
- ➖ Impose un vocabulaire global et une réorganisation **transverse** ; hors périmètre (ce RFC cible la page Offre, pas toute l'app). Réintroductible plus tard si l'équipe le souhaite.

### 4.5 Tableau de synthèse

| Critère | MVVM | Hexagonal | Redux-like | FSD |
|---|:--:|:--:|:--:|:--:|
| Testabilité du **domaine** sans React | △ | ✅ | △ | △ |
| Adéquation **FP / cœur pur** | △ | ✅ | ➖ | △ |
| Supprime le **prop-drilling** | ✅ | △ | ✅ | △ |
| Compatible **RQ + Zustand** (sans 3ᵉ source) | ✅ | ✅ | ➖ | ✅ |
| **Courbe d'apprentissage** (faible = mieux) | ✅ | △ | ➖ | ➖ |
| Proximité avec `offerRefacto` existant | ✅ | △ | ➖ | ➖ |
| Périmètre = **page Offre** (pas toute l'app) | ✅ | ✅ | ✅ | ➖ |

**Lecture** : MVVM excelle en présentation mais **ne protège pas le domaine** (un « ViewModel » peut redevenir un monolithe — cf. `useOfferCTAs`, 224 l. dans `offerRefacto`) ; Hexagonal protège le domaine mais est lourd en présentation. Aucun, seul, ne couvre tout.

> **Point clé du débat** : la valeur ne vient **pas** du pattern de présentation. Elle vient de **l'isolation d'un domaine pur** et de la **frontière nette serveur/local**. Le découpage de la présentation est une **convention secondaire**, à appliquer **avec jugement**, pas comme un dogme (voir §5.3).

---

## 5. Proposition retenue : cœur fonctionnel obligatoire, présentation pragmatique

La proposition s'articule en deux niveaux d'engagement, volontairement distincts :

- **Le socle, non négociable** : un **domaine pur** (fonctions sans React/I/O) + une **frontière nette React Query (serveur) / Zustand (local)** + la **dependency rule**. C'est ce qui résout réellement les problèmes du §1 (testabilité, couplage, logique dans React).
- **La présentation, sur jugement** : le découpage « hook + View pure » (inspiré de MVVM) est une **convention recommandée mais conditionnelle** (§5.3), pas une règle universelle. On refuse explicitement d'imposer 3 fichiers par composant partout.

On emprunte donc à **Hexagonal** l'isolation du domaine (le socle), et à **MVVM** une simple *idée* de présentation (le hook produit un objet render-ready), sans en faire une cérémonie systématique.

### 5.1 Les couches (concepts) projetées sur les dossiers maison

Les « couches » ci-dessous sont des **concepts**, pas des dossiers. Elles se projettent sur le vocabulaire **déjà utilisé** par toutes les features :

```
                 ┌─────────────────────────────────────────────┐
   dépendances   │  Presentation   composants *View purs       │  → components/  pages/
       ───►      │                 (humble objects)            │
                 ├─────────────────────────────────────────────┤
                 │  Application    hooks d'orchestration        │  → hooks/
                 │                 (RQ + Zustand + cœur pur)    │
                 ├─────────────────────────────────────────────┤
                 │  Cœur pur       fonctions pures + types      │  → helpers/  types.ts
                 │                 ZÉRO React / I/O / navigation│
                 ├─────────────────────────────────────────────┤
                 │  Infrastructure I/O, persistance, mapping    │  → queries/  store/  adapters/  api/
                 └─────────────────────────────────────────────┘
```

**Sens des dépendances** : `components`/`pages` → `hooks` → `helpers`. Les dossiers d'infrastructure (`queries`, `store`, `adapters`) **fournissent** les données ; `helpers/` (cœur pur) ne dépend de **personne**.

### 5.2 Rôle de chaque couche et placement de Zustand / React Query

| Couche (concept) | Dossier maison | Contenu | React ? | Exemples concrets |
|---|---|---|:--:|---|
| **Cœur pur** | `helpers/`, `types.ts` | Types métier + fonctions **pures** | ❌ | `resolveOfferCTA(state): CtaDecision`, `getOfferPrice(stocks)`, `hasEnoughCredit(...)`, `getOfferMetadata(offer)` |
| **Application** | `hooks/` | Hooks d'orchestration : lisent l'état serveur (**React Query**) et local (**Zustand**), appellent le cœur pur, renvoient un objet render-ready | ✅ | `useOfferCTAViewModel`, `useOfferHeaderViewModel` |
| **Infrastructure** | `queries/`, `store/`, `adapters/`, `api/` | **React Query** (`use*Query`/`use*Mutation`, `QueryKeys`, `select`), **stores Zustand** (`createStore`), **adapters** API→domaine | ✅ (côté RQ/Zustand) | `useOfferQuery`, `offerLocalStore`, `offerResponseToOffer` |
| **Presentation** | `components/`, `pages/` | Composants de rendu (`*View` purs en style B), consomment un objet render-ready | ✅ (rendu) | `OfferCTAsView`, `OfferHeaderView` |

> **Où vit la logique ?** Les **décisions** (quel CTA, quel prix, éligibilité) vivent dans `helpers/`, pur. L'**orchestration** (déclencher une query, lire un store, brancher un handler) vit dans `hooks/`. L'**accès** vit dans `queries/`, `store/`, `adapters/`. Le **rendu** vit dans `components/` / `pages/`.

> ⚠️ Le seul invariant **strictement obligatoire** est le **cœur pur** (`helpers/` sans React/I/O) + la **frontière RQ/Zustand** (`queries/` vs `store/`). La façon de découper `hooks/` et la présentation relève de conventions (§5.3), pas de dogme.

### 5.3 Présentation : deux styles acceptables (split conditionnel)

On **n'impose pas** le triptyque `Component.tsx` / `useComponent.ts` / `ComponentView.tsx` partout. Le découpage en fichiers séparés est de la cérémonie : il n'a de valeur que dans certains cas. Deux styles cohabitent :

**Style A — composant simple (par défaut)** : un seul fichier composant + un hook mince. La logique métier est déjà dans le Domain ; le hook se contente d'orchestrer. Pas de `*View` séparé.

```tsx
// components/OfferTitle/OfferTitle.tsx  — suffit dans 80 % des cas
export const OfferTitle = ({ offerId }: Props) => {
  const vm = useOfferTitle(offerId)   // hook mince -> objet render-ready
  return <Text>{vm.title}</Text>
}
```

**Style B — hook + View(s) séparée(s)** : on extrait `ComponentView` **uniquement** quand au moins un de ces critères est rempli :
1. **Divergence cross-platform** : le rendu diffère `native` / `web` → un hook partagé + `View.native.tsx` / `View.web.tsx`. **C'est l'argument le plus fort dans ce codebase** (cf. `App.web.tsx`, tests `.native`/`.web`).
2. **UI à forte ramification** : beaucoup de branches conditionnelles de rendu justifient une View testable par fixtures.
3. **Réutilisation** de la même View avec des sources de données différentes.

> Règle : **commencer en style A**, passer en style B **quand un critère le justifie** — jamais « par défaut ». On évite ainsi la multiplication de fichiers `*View` à faible valeur.

#### Orchestration recommandée : le ViewModel composé (« variante C »)

Le découpage de fichiers (A/B) est un axe ; **comment orchestrer** en est un autre. Trois approches ont été comparées sur un POC (slice CTA, cf. `src/features/offerCtaPoc/POC-FINDINGS.md`) :

- **A — ViewModel monolithique** : un hook fait tout. Centralise bien mais risque de regrossir (syndrome `useOfferCTAs`, 224 l. dans `offerRefacto`).
- **B — hooks use-case dans le composant** : `useCtaDecision`, `useBookingModal`… composés directement dans le JSX. Léger, mais la **glu** (`onPress` qui décide *quel* modal ouvrir) **revient dans le composant** → redevient non-testable sans rendu quand la coordination grossit.
- **C — ViewModel composé (recommandé)** : un hook ViewModel qui **compose les petits hooks use-case** et expose un objet render-ready à une View pure. On obtient la granularité testable de B **et** le point d'assemblage unique de A.

**Recommandation** : pour un composant à coordination non triviale (le CTA en tête), **variante C**. Pour une feuille triviale (titre, tag), un composant simple suffit (style A, sans View séparée).

> **Invariant, quelle que soit la variante** : la **glu de décision vit dans un hook**, jamais dans le JSX. C'est le critère qui tranche entre B (glu dans le composant) et C (glu dans le hook).

Le POC valide aussi le **socle** : décision CTA extraite en cœur pur testable **sans mock** (≈61 l. vs 511 l. aujourd'hui), frontière React Query / Zustand nette.

### 5.4 Arborescence cible (page Offre) — vocabulaire maison

On **conserve les dossiers déjà utilisés** par les ~40 features (`components`, `pages`, `helpers`, `hooks`, `queries`, `store`, `adapters`, `api`, `fixtures`). La nouveauté n'est **pas** un nouveau découpage de dossiers, mais une **discipline de contenu et d'imports** (§3).

```
src/features/offer/
├── helpers/                     # COEUR PUR — testable sans React (≈ "domain")
│   ├── cta/
│   │   ├── resolveOfferCTA.ts            # décision pure (remplace la logique de useCtaWordingAndAction)
│   │   └── ctaContent.ts                 # type CTA → wording/action
│   ├── offerPrice.ts
│   ├── hasEnoughCredit.ts                # règle pure ; devises/taux injectés en argument
│   └── ...
├── types.ts                     # types métier (CtaType, CtaDecision, ...)
├── hooks/                       # APPLICATION — orchestration (≈ "ViewModel"/use-case)
│   ├── useOfferCTAViewModel.ts
│   └── useOfferHeaderViewModel.ts
├── queries/                     # INFRA serveur — React Query
│   ├── useOfferQuery.ts
│   └── selectors/...
├── store/                       # INFRA local — Zustand (createStore)
│   └── offerLocalStore.ts                # modales, artistes sélectionnés, scroll...
├── adapters/                    # INFRA mapping — API → type métier
│   └── offerResponseToOffer.ts
├── components/                  # PRESENTATION — composants (style A) ou Component+*View (style B)
│   ├── OfferCTAs/{OfferCTAs.tsx, OfferCTAsView.tsx}   # style B (cf. §5.3)
│   └── OfferTitle/OfferTitle.tsx                       # style A
└── pages/
    └── Offer/Offer.tsx                   # assemble les hooks d'orchestration
```

> Aucun dossier `domain/`, `application/`, `infrastructure/`, `ui/` : ces concepts existent mais se **lisent dans les dossiers maison** ci-dessus. La séparation est garantie par les **règles d'imports** (§3), pas par les noms de dossiers.

> **`select` de React Query = adapter, pas décision.** Le `select` d'une query (et les `queries/selectors/`) sert à **reshape/narrow** la réponse serveur vers le type métier (ex. `useOfferQuery({ select: offerResponseToOffer })`) — c'est de l'infrastructure. Il ne porte **jamais** une décision métier : `select` ne voit qu'**une** query, alors qu'une décision (le CTA) combine offre + bookings + crédit + auth + état local. Cette recombinaison se fait dans le `hooks/` applicatif et appelle le cœur pur. Mettre la décision dans `select` la couplerait à React Query et casserait sa testabilité (validé sur le POC).

### 5.5 Correspondance « concern actuel → dossier cible »

| Concern actuel | Aujourd'hui | Dossier cible |
|---|---|---|
| Décision du CTA | `useCtaWordingAndAction` (511 l.) | `helpers/cta/resolveOfferCTA` (pur) + `hooks/useOfferCTAViewModel` |
| Assez de crédit ? | `useHasEnoughCredit` | `helpers/hasEnoughCredit` (pur) ; taux/devise injectés depuis `hooks/` |
| Modales (réaction, artistes, club) | `useState`/`useModal` épars | `store/offerLocalStore` (Zustand), consommé dans `hooks/` |
| Artistes sélectionnés, scroll, opacité | `useState` dans composants | `store/` (Zustand) |
| Favoris (add/remove + analytics) | callbacks dans `OfferContentBase` | `queries/` (mutations RQ) ; règle « coming-soon » → `helpers/` |
| Offre, sous-catégories, réservations | queries éparses | `queries/` (+ `select`/selectors) |
| Rendu | composants monolithiques | `components/` (`*View` purs en style B) |

### 5.6 État local : conventions Zustand pour la page

On réutilise `createStore` (`src/libs/store/createStore.ts`). Un store **local à la page** regroupe l'état UI aujourd'hui dispersé :

```ts
// store/offerLocalStore.ts  (illustratif)
type OfferLocalState = {
  visibleModal: 'none' | 'reaction' | 'artists' | 'clubWriters'
  selectedArtists: OfferArtist[]
}
export const offerLocalStore = createStore<OfferLocalState, Actions, Selectors>({
  name: 'offer-local',
  defaultState: { visibleModal: 'none', selectedArtists: [] },
  actions: (set) => ({
    openModal: (modal) => set((s) => ({ ...s, visibleModal: modal })),
    closeModal: () => set((s) => ({ ...s, visibleModal: 'none' })),
    selectArtists: (selectedArtists) => set((s) => ({ ...s, selectedArtists })),
  }),
  selectors: {
    selectVisibleModal: () => (s) => s.visibleModal,
  },
})
```

> Convention : pas de `persist` pour de l'état éphémère de page ; le store est **local au feature** (`features/offer/store/`), pas global.

---

## 6. Exemple appliqué : la logique CTA (avant / après)

Le CTA est le **point chaud** : `useCtaWordingAndAction` (511 lignes) mêle aujourd'hui décision métier, 3 queries, 1 mutation, parsing de route, analytics et expiration de crédit.

### 6.1 Avant (simplifié)

```ts
// helpers/useCtaWordingAndAction/useCtaWordingAndAction.ts — ~511 lignes
export const useCtaWordingAndAction = (params) => {
  const storedProfileInfos = useStoredProfileInfos()
  const { isLoggedIn, user } = useAuthContext()
  const hasEnoughCredit = useHasEnoughCredit(offer)              // hook + query
  const { data: endedBooking } = useEndedBookingFromOfferIdQueryV2(...)
  const route = useRoute(...)
  // ...parsing params, expiration deposit, mutation bookOffer, analytics...
  // puis 412 lignes de getCtaWordingAndAction(...) avec 30+ if/return
}
```

Impossible à tester sans React + mocks ; logique non réutilisable.

### 6.2 Après — cœur pur (`helpers/`, déjà esquissé dans `offerRefacto`)

La décision devient une **composition de petites fonctions pures**, sans React ni I/O — exactement le style de `offerRefacto/helpers/offerCTASelection.ts` :

```ts
// helpers/cta/resolveOfferCTA.ts  (pur, testable en isolation)
export const resolveOfferCTA = ({
  context, hasEnoughCredit, isLoggedIn, subcategory, isEndedUsedBooking, user,
}: ResolveOfferCTAInput): CtaDecision => {
  if (!isLoggedIn) return ctaContent(externalUrl ? 'EXTERNAL_URL' : 'AUTHENTICATION', context)

  const cta =
    getExternalUrlCTA(offer, hasEnoughCredit, user) ??
    getFreeOfferCTA(offer, subcategory, user, alreadyBookedOfferId) ??
    getEligibilityBookingCTA(offer, user, isEndedUsedBooking, alreadyBookedOfferId) ??
    getRestrictedOfferCTA(offer, isUnderageBeneficiary, isCurrentOrFormerBeneficiary(user)) ??
    getExpirationSoldOutCTA(offer, user) ??
    (hasEnoughCredit ? bookType(subcategory) : 'INSUFFICIENT_CREDIT')

  return ctaContent(cta, context)
}
```

### 6.3 Après — orchestration mince (`hooks/`)

```ts
// hooks/useOfferCTAViewModel.ts
export const useOfferCTAViewModel = (params): OfferCTAsViewModel | undefined => {
  const { user, isLoggedIn } = useAuthContext()
  const credit = useHasEnoughCredit(params.offer)               // infra (RQ)
  const endedBooking = useEndedBookingFromOfferIdQueryV2(...)    // infra (RQ)
  const bookOffer = useBookOfferMutation()                      // infra (RQ)

  const decision = resolveOfferCTA({ ...params, isLoggedIn, user, hasEnoughCredit: credit.ok })  // domain pur

  return toCTAsViewModel(decision, { bookOffer, ... })          // adaptation -> ViewModel
}
```

> En pratique, ce hook **compose des hooks use-case** (`useHasEnoughCredit`, `useBookingModal`…) plutôt que de tout faire lui-même : c'est la **variante C** (§5.3). La glu reste ici, jamais dans le composant.

### 6.4 Après — Presentation

Le CTA est un bon candidat au **style B** (§5.3) : forte ramification de rendu **et** divergence native/web. On extrait donc une View pure :

```tsx
// components/OfferCTAs/OfferCTAsView.tsx — zéro logique métier
export const OfferCTAsView = ({ viewModel }: { viewModel: OfferCTAsViewModel }) => { /* rendu */ }
```

Pour un composant simple (ex. `OfferTitle`), on resterait en **style A** (un seul fichier), sans View séparée.

**Gain principal — et c'est le cœur de la proposition** : la règle « quel CTA ? » est testable par tables d'entrées/sorties, **sans monter React ni mocker des queries**. C'est déjà ce que démontre `offerRefacto/helpers/offerCTASelection.test.ts`. Le découpage de la View, lui, n'est qu'un bonus contextuel.

---

## 7. Faut-il ajouter une librairie ? (avantages / inconvénients / différence concrète)

Question posée : une lib apporte-t-elle vraiment quelque chose ? Analyse honnête, lib par lib. **`zod` est écarté** : `yup` est déjà présent et couvre la validation aux frontières.

### 7.1 `ts-pattern` — pattern matching exhaustif

La décision CTA est un **mapping `CtaType` (16 variantes) → contenu** et une **cascade de conditions**. En vanilla TS, on l'écrit en `switch`/`if` ou via `??`. `ts-pattern` apporte le **matching exhaustif vérifié par le compilateur**.

**Différence concrète** — le mapping `type → wording/action` :

```ts
// AVANT (vanilla) : switch ; aucune garantie qu'un nouveau CtaType soit traité
function ctaContent(type: CtaType, ctx: CTAContext): CtaDecision {
  switch (type) {
    case 'AUTHENTICATION':     return { wording: 'Réserver', onPress: ctx.openAuth }
    case 'BOOK_OFFER':         return { wording: 'Réserver', onPress: ctx.book }
    // ... 14 autres cas ...
    default:                   return {}   // ⚠️ avale les oublis silencieusement
  }
}
```

```ts
// APRÈS (ts-pattern) : .exhaustive() => ERREUR DE COMPILATION si un CtaType est ajouté sans cas
import { match } from 'ts-pattern'
const ctaContent = (type: CtaType, ctx: CTAContext): CtaDecision =>
  match(type)
    .with('AUTHENTICATION', () => ({ wording: 'Réserver', onPress: ctx.openAuth }))
    .with('BOOK_OFFER',     () => ({ wording: 'Réserver', onPress: ctx.book }))
    // ... 14 autres cas ...
    .exhaustive()           // ✅ le compilateur garantit la complétude
```

- ➕ **Exhaustivité garantie** (un nouveau CTA non géré = échec de compilation, pas un bug runtime) ; lecture déclarative ; idéal sur les 16 variantes de CTA.
- ➖ +1 dépendance (~12 kB), +1 concept à apprendre. Sur des `switch` simples, le gain est marginal.
- **Verdict** : **recommandé** ciblé sur le domaine CTA (et tout futur état discriminé). C'est le meilleur rapport valeur/coût des trois, car il attaque directement le point chaud. `switch (type) { ... default: assertNever(type) }` reste une alternative vanilla acceptable (exhaustivité via `assertNever`), mais plus verbeuse.

### 7.2 `neverthrow` — type `Result<Ok, Err>`

Modéliser les actions (réserver, ajouter aux favoris) comme `Result` plutôt que par exceptions.

```ts
// AVANT : succès/échec implicite, gestion d'erreur dispersée
const book = async () => { try { await bookOffer(...) } catch (e) { /* ? */ } }
// APRÈS : flux d'erreur typé et composable
const book = (): ResultAsync<BookingConfirmed, BookingError> => ...
```

- ➕ Erreurs **dans le type** (le compilateur force à les traiter) ; composition fonctionnelle (`.map`, `.andThen`).
- ➖ React Query gère **déjà** `isError`/`error` et les retries ; introduire `Result` en parallèle crée **deux modèles d'erreur**. Bénéfice surtout dans le domaine pur, qui produit aujourd'hui peu d'erreurs (les décisions CTA renvoient un état, pas une erreur).
- **Verdict** : **non recommandé pour l'instant.** À reconsidérer si le domaine se met à porter des validations faillibles riches. À documenter comme « option ouverte ».

### 7.3 `zod`

- **Écarté** : `yup` (déjà présent) couvre la validation. Les types serveur viennent de l'API générée (`api/gen`), pas d'un parsing à inférer.

### 7.4 Recommandation de synthèse

| Lib | Cible | Recommandation |
|---|---|---|
| **ts-pattern** | Domaine CTA + états discriminés | ✅ **Adopter** (ciblé), ou `assertNever` en vanilla si l'équipe préfère 0 dépendance |
| **neverthrow** | Erreurs du domaine | ⏸️ **Pas maintenant** (redondant avec RQ) |
| **zod** | Validation | ❌ **Non** (`yup` déjà là) |

> Aucune installation n'est faite par ce RFC : ce sont des **recommandations à trancher en équipe**.

---

## 8. Stratégie de migration : big-bang

Approche retenue : **réécrire la page Offre d'un coup** sur la nouvelle architecture, puis basculer.

### 8.1 Découpage du chantier (ordre conseillé)

1. **`helpers/` d'abord** (cœur pur) : extraire les fonctions pures (CTA, prix, crédit, éligibilité, metadata) avec leurs tests unitaires. Socle déjà largement présent dans `offerRefacto/helpers/`.
2. **`queries/` + `store/` + `adapters/`** (infra) : consolider les queries (+ `select`/selectors là où la transfo est dans les composants aujourd'hui) et le `offerLocalStore` Zustand.
3. **`hooks/`** (orchestration) : écrire les hooks qui assemblent `helpers/` + infra.
4. **`components/` + `pages/`** (présentation) : composants alimentés par les hooks (style A par défaut, `*View` en style B).
5. **Bascule** : `pages/Offer` assemble les hooks ; suppression de l'ancienne page une fois la **parité fonctionnelle** atteinte.

### 8.2 Stratégie de tests (pyramide)

- **Domaine** : tests unitaires purs par tables (entrées → sortie). Couverture élevée visée car peu coûteux.
- **Application** : `renderHook` sur les ViewModels avec queries/stores mockés.
- **Presentation** : tests de rendu sur les `*View` à partir de fixtures de ViewModel.
- **Bout-en-bout** : conserver/adapter les tests existants `OfferPage.native.test.tsx` / `.web.test.tsx` comme **filet de parité**.

### 8.3 Risques & mitigations

| Risque | Mitigation |
|---|---|
| Régression fonctionnelle (parcours de réservation critique) | **Parité** validée par tests bout-en-bout existants + QA dédiée avant bascule |
| Perte d'événements analytics | Inventaire des `analytics.*` actuels → checklist de re-câblage |
| Durée du chantier / gel des features sur la page | Cadrer un périmètre figé ; communiquer un *code freeze* partiel sur `features/offer` pendant la bascule |
| Big-bang difficile à reviewer | Découper la **PR** par dossier (`helpers/` → `queries`+`store`+`adapters` → `hooks/` → `components`+`pages`) même si la bascule finale est unique |

> **Alternative non retenue** (pour mémoire) : *strangler* progressif derrière un feature flag (composant par composant), dans la lignée de `offerRefacto`. Plus sûr mais plus long et impose une cohabitation prolongée des deux arbres.

---

## 9. Conséquences & trade-offs

**Bénéfices attendus**
- Règles métier testables en isolation, sans React.
- Fin du prop-drilling (les Views consomment un ViewModel).
- Composants de rendu courts et lisibles.
- Réutilisabilité des fonctions domaine hors de la page.

**Coûts**
- Plus de fichiers / un peu de *boilerplate* (séparation Component/Hook/View).
- Montée en compétence de l'équipe sur les couches et le style FP.
- Effort initial du big-bang.

---

## 10. Questions ouvertes (à débattre)

1. **Présentation — quel modèle ?** (débat principal) Le POC recommande la **variante C** (ViewModel composé de hooks use-case + View pure) pour les composants à coordination, et le **split View conditionnel** (style A par défaut, style B au besoin), avec l'invariant « la glu vit dans un hook » (§5.3). L'équipe valide-t-elle C comme cible, ou préfère-t-elle A (ViewModel monolithique) ou B (hooks use-case inline) ?
2. **`ts-pattern` : oui/non ?** Adopter la lib, ou rester en vanilla avec `assertNever` ?
3. **Granularité des stores Zustand** : un store local par page, ou des slices plus fines (modales / sélection / scroll) ?
4. **Frontière `hooks/` ↔ `queries/`** : un hook d'orchestration (`hooks/`) consomme-t-il les hooks RQ de `queries/`, ou peut-il appeler `useQuery` directement ? (proposition : passer par `queries/`).
5. **Faire respecter la dependency rule** : met-on en place des règles `no-restricted-imports` (ex. interdire `react`/`queries`/`store` dans `helpers/`) pour garantir la séparation, plutôt que de compter sur la discipline ? (Le nommage des dossiers, lui, est tranché : on garde le **vocabulaire maison**, pas de `domain/application/infrastructure/ui`.)
6. **`offerRefacto`** : on le promeut comme base de la nouvelle `features/offer`, ou on repart d'un dossier neuf — sachant qu'il sur-investit aujourd'hui dans le découpage de fichiers ?
7. **Périmètre** : ce pattern devient-il le standard des autres pages à terme (porte d'entrée vers FSD) ?
8. **Frontière client / serveur** (§11) : ouvre-t-on avec l'équipe back le déplacement de certaines décisions (CTA/bookabilité, solvabilité) côté serveur, ou garde-t-on tout client pour cette refonte ?

---

## 11. (Optionnel) Frontière client / serveur

> **Section optionnelle, à débattre avec l'équipe back.** Elle ne conditionne pas la refonte d'archi (§5) : on peut tout réarchitecturer côté client sans toucher au backend. Mais plusieurs règles métier de la page Offre sont **reconstruites côté client à partir de champs bruts**, alors que le backend en est déjà l'autorité. Les déplacer **réduirait d'autant le cœur pur client** (`helpers/`) et le point chaud du CTA.

### 11.1 Critère de tri

Une logique gagne à passer **côté serveur** si elle coche au moins un de ces points :

1. **Autorité / sécurité** : le serveur revalide de toute façon (à la réservation) ; le client ne fait que **dupliquer** la règle.
2. **Cohérence multi-clients** : web + native (+ futurs clients) doivent décider à l'identique ; aujourd'hui chacun réimplémente le même arbre.
3. **Volatilité métier** : la règle change avec la politique (éligibilité, plafonds, devises) → sinon chaque changement impose une **release mobile**.
4. **Données sensibles côté client** : taux de change, barèmes de crédit par domaine de dépense.

### 11.2 Candidats (avec preuve dans le code)

| Logique actuelle | Fichier | Pourquoi côté serveur | Verdict |
|---|---|---|---|
| **Décision du CTA / « bookabilité »** (arbre 30+ branches sur `eligibility`, `statusType`, `domainsCredit`, `depositExpirationDate`, `isForbiddenToUnderage`, `isEducational`, `isSoldOut`, `isExpired`, `bookedOffers`…) | `useCtaWordingAndAction` | Autorité + cohérence multi-clients + volatilité | ✅ **Fort** — le serveur renvoie un **état décisionnel**, le client garde le mapping état→wording/i18n |
| **Solvabilité + conversion de devises** (euro ↔ franc pacifique via taux settings) | `useHasEnoughCredit` | Autorité + données sensibles (taux) ; le client ne devrait pas convertir des devises pour décider d'une réservation | ✅ **Fort** — flag `hasEnoughCredit` calculé serveur, ou intégré à l'état CTA |
| **Complétude de profil** (`firstName/lastName/postalCode/city/activityId`) et mappings `eligibility`/`statusType` | `getIsProfileIncomplete`, `offerCTASelection` | Règle de politique, volatile, connue du backend | 🟡 **Moyen** — à exposer comme statut serveur |
| **Prix applicable pour l'utilisateur** (`Math.min` des stocks, « gratuit selon statut ») | `getOfferPrice`, `getIsFreeOffer` | Le *formatage* reste client, mais le *prix pertinent* dépend du contexte utilisateur | 🟠 **Faible / discutable** |

**Forme cible côté serveur** (illustratif) :
```jsonc
"callToAction": {
  "type": "INSUFFICIENT_CREDIT",   // enum partagé
  "reason": "credit",              // pour l'affichage / le tracking
  "bookableFrom": null
}
```
Le client traduit ce `type` en wording/icône/navigation — **rien de plus**.

### 11.3 Ce qui doit rester côté client

- **Présentation pure** : i18n/wording, formatage de dates, métadonnées d'affichage, dimensions de carrousel, scroll/opacité, tags.
- **Navigation & analytics**, état UI (modales, sélections).
- Le **mapping** « réponse serveur → ViewModel ».

### 11.4 Contreparties (à ne pas masquer)

- **Latence / couplage** : une décision serveur ajoute un aller-retour et un **contrat d'API à versionner**.
- **Offline / optimistic UI** : plus difficile si la décision dépend du serveur.
- **Charge backend & coordination** : potentiellement un sujet de **BFF** ; nécessite l'accord de l'équipe back.

### 11.5 Lien avec la refonte d'archi

Plus le backend porte les **décisions**, plus le `helpers/` client **rétrécit** et tend vers du simple *mapping*. À l'inverse, si on garde tout côté client, `helpers/cta` reste volumineux — mais au moins **pur et testable** (§5). Les deux chantiers sont **indépendants** : on peut faire la refonte client d'abord, puis déplacer des décisions serveur ensuite, sans rejouer l'archi.

---

## Annexe — ADR à dériver de ce RFC

Une fois ce RFC tranché, écrire les ADR suivants (`doc/decision-records/`, format Nygard, cf. `DR001`) :

1. **Dependency rule par les imports** : couches logiques (cœur pur / orchestration / infra / présentation) projetées sur les **dossiers maison** (`helpers`/`hooks`/`queries`+`store`+`adapters`/`components`+`pages`), pas de dossiers de couches ; séparation garantie par `no-restricted-imports`.
2. **État local : Zustand** via `createStore`, store local au feature.
3. **État serveur : React Query** (conventions `use*Query`/`use*Mutation`, `QueryKeys`, `select`/selectors).
4. **Cœur fonctionnel & pattern matching** (domaine pur ; décision `ts-pattern` vs `assertNever`).
5. **Convention de présentation** : **ViewModel composé de hooks use-case (variante C)** + split View **conditionnel** (style A par défaut, style B sur critères) ; invariant « la glu vit dans un hook ». Validé par le POC `offerCtaPoc`.
6. **Stratégie de migration big-bang** + critères de parité.
7. *(Optionnel, avec l'équipe back)* **Frontière client / serveur** : décisions (CTA/bookabilité, solvabilité) calculées serveur vs client (§11).
