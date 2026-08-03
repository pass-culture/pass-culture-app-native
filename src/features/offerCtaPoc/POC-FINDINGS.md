# POC — Validation d'architecture sur le slice CTA

> Dossier isolé `src/features/offerCtaPoc/`. Aucun fichier de `features/offer` ou `offerRefacto` modifié (hors câblage cheatcode dev-only, cf. §6). Slice volontairement borné : `BOOK_OFFER` / `INSUFFICIENT_CREDIT` / `SOLD_OUT_OFFER` / `SEE_BOOKING` / `AUTHENTICATION`.
>
> **État** : ✅ `tsc` propre · ✅ ESLint `--quiet` 0 erreur · ✅ **14 tests** (4 suites) passent.

## 1. Couches (vocabulaire maison du projet)

| Couche (concept) | Dossier | Fichiers |
|---|---|---|
| Cœur pur (domaine) | `helpers/` | `resolveOfferCta.ts` (décision pure), `ctaContent.ts` (type→contenu, `assertNever`) |
| Application | `hooks/` | `useOfferCtaViewModel.ts` (A) ; `useCtaDecision.ts` + `useBookingModal.ts` (B) ; `useOfferCtaViewModelComposed.ts` (C) |
| Infra serveur | `queries/` + `adapters/` | `useOfferCtaDataQuery.ts` (React Query + `select`) ; `offerCtaResponseToData.ts` (DTO API → domaine) |
| Infra local | `store/` | `offerCtaStore.ts` (Zustand via `createStore`) |
| Présentation | `components/` | `variantA/*`, `variantB/*`, `variantC/*` (réutilise la View de A) |
| Types domaine | `types.ts` | `CtaType`, `Offer`, `UserContext`, `CtaDecision`, `OfferCtaData` |

## 2. Kill criteria — résultats

| Critère défini avant le code | Cible | Résultat |
|---|---|---|
| Cœur pur testé **sans React ni mock** | oui | ✅ `resolveOfferCta.test.ts` + `offerCtaResponseToData.test.ts` : 0 mock, 0 import React |
| Décision pure compacte | < ~80 l. | ✅ `resolveOfferCta.ts` + `ctaContent.ts` ≈ **61 l.** (vs **511 l.** aujourd'hui) |
| Hook d'orchestration testable | ≤ 4 mocks | ✅ **0 mock métier** (seul wrapper = provider React Query) |
| Cœur pur dépend de navigation/analytics ? | non | ✅ aucune dépendance : navigation/analytics restent en présentation |

➡️ **Le socle est validé** : cœur pur isolé + frontière React Query (serveur) / Zustand (local) nette.

## 3. A/B/C — ViewModel (A) vs hooks use-case (B) vs hybride (C)

| Critère | A (ViewModel monolithique) | B (use-case inline) | C (ViewModel composé) |
|---|---|---|---|
| Orchestration | 1 hook qui fait tout (`useOfferCtaViewModel`, 40 l.) | hooks composés **dans le composant** (`useCtaDecision` 13 + `useBookingModal` 15) | 1 hook qui **compose** les use-case (`useOfferCtaViewModelComposed`, 31 l.) |
| Présentation | View pure dédiée (`OfferCtasView`, 47 l.) | rendu inline (`OfferCtas`, 56 l.) | **réutilise la View de A** (0 l. neuve) |
| Nb de fichiers neufs | 3 | 3 | 2 (+ View réutilisée) |
| Mocks pour tester | 0 métier | 0 métier | 0 métier |
| Où vit la **glu** (quel modal, etc.) | dans le hook ✅ | **dans le composant** ⚠️ | dans le hook ✅ |
| View pure réutilisable / testable par fixture | ✅ | ➖ inline | ✅ (la même que A) |
| Unités d'orchestration réutilisables ailleurs | ➖ monolithe | ✅ | ✅ |

### Lecture

- **Le cœur pur absorbe les nouveaux états quelle que soit la variante** : ajouter un CTA touche `helpers/`, pas la présentation. C'est le vrai gain, indépendant du débat.
- **B** est plus direct, mais la **glu (`onPress` décide quoi ouvrir) revient dans le composant** → à mesure que le CTA réel grossit (booking / auth / subscription / reminder), cette logique inline redevient non-testable sans rendu.
- **A** isole une View pure et centralise la glu, mais son hook ViewModel risque de regrossir (syndrome `useOfferCTAs` 224 l.).
- **C** prend le **meilleur des deux** : les **petits hooks use-case de B** (testables, réutilisables) **composés** dans un ViewModel, qui alimente la **View pure de A** (ici littéralement réutilisée). La glu reste dans un hook. C'est le seul à ne cocher que des ✅.

### Recommandation

**Pour le CTA (et tout composant à coordination non triviale) : variante C** — ViewModel composé de hooks use-case + View pure. On évite à la fois le monolithe (A) et la dispersion de glu dans le JSX (B).

Cohérent avec le RFC §5.3 : pour un **composant feuille trivial** (un titre, un tag), pas de ViewModel ni de View séparée — un simple composant suffit. La règle invariante, quelle que soit la variante : **la glu de décision vit dans un hook, jamais dans le JSX**.

## 4. React Query : usage de `select` (adapter), pas de décision

La query `useOfferCtaDataQuery` illustre la **bonne frontière** :
- `queryFn` renvoie le **DTO brut** `OfferCtaApiResponse` (champs renommés/imbriqués, `existingBookingOfferId: number | null`), comme un vrai backend ;
- `select: offerCtaResponseToData` **adapte** le DTO en forme domaine `OfferCtaData` (rename `title→name`, `price→priceInCents`, `null→undefined`…), memoïsé par React Query.

**Règle de couche** :

| Étape | Où | Outil |
|---|---|---|
| DTO API → type domaine (reshape/narrow) | `queries/` + `adapters/` (infra) | **`select` de React Query** ✅ |
| Décision métier (quel CTA) à partir de N sources | `helpers/` (domaine), appelé par `hooks/` | **fonction pure**, jamais `select` |

> `select` ne voit qu'**une** query → il ne peut pas porter une décision qui combine offre + bookings + crédit + auth + état local. Cette recombinaison se fait dans le hook applicatif. Mettre la décision dans `select` la couplerait à React Query et casserait le kill-criterion « 0 mock ».

## 5. ts-pattern vs vanilla

`ctaContent.ts` est en **vanilla TS** avec `assertNever` : on a déjà l'**exhaustivité vérifiée à la compilation** (ajouter un `CtaType` sans cas casse le build). Sur ce volume (5 cas), le gain de `ts-pattern` est marginal.

➡️ **Recommandation : ne pas ajouter `ts-pattern` pour l'instant** (cohérent RFC §7). À reconsidérer si la décision réelle (16 `CTAType` + conditions imbriquées) devient illisible en `switch`.

## 6. Tester visuellement (cheatcode, dev-only)

L'écran est **câblé dans le menu cheatcodes** (dev uniquement, zéro impact prod) :
- page : `src/cheatcodes/pages/features/offerCtaPoc/CheatcodesNavigationOfferCtaPoc.tsx`
- route : `CheatcodesNavigationOfferCtaPoc` (chemin `cheatcodes/offer-cta-poc`)
- entrée de menu : « Offer CTA POC 🎯 » (section FEATURES)

**Procédure** :
1. `yarn start:web` (ou `yarn ios` / `yarn android`)
2. ouvrir le menu **Cheatcodes** → **Offer CTA POC 🎯**
3. changer de scénario (Réservable / Crédit insuffisant / Épuisée / Déjà réservée / Non connecté) et vérifier que **A, B et C affichent la même chose** ; le bouton ouvre/ferme la modale.

> Web : accessible directement via l'URL `…/cheatcodes/offer-cta-poc`.

**Tester sans l'app** (suffit pour les conclusions) :
```bash
yarn test:unit src/features/offerCtaPoc   # 14 tests
yarn test:types                           # tsc
yarn test:lint                            # eslint
```

## 7. Journal des modifications (itérations du POC)

| # | Modification | Pourquoi |
|---|---|---|
| 1 | POC initial : cœur pur `helpers/` + frontière RQ/Zustand + variantes **A** et **B** | Valider le socle + comparer ViewModel vs hooks use-case |
| 2 | Suppression du préfixe « Poc » dans les identifiants/fichiers (dossier conservé) | L'isolation vient du dossier, pas du nommage ; facilite la promotion du code |
| 3 | Styling migré en `styled-components/native` + tokens thème ; texte via `Typo.*` | Respect des règles lint maison (`no-color-literals`, `no-restricted-imports`, `no-raw-text`) |
| 4 | Ajout de la variante **C** (hybride) | Reco : ViewModel **composé** de hooks use-case + réutilisation de la View de A |
| 5 | `useOfferCtaPresenter` → **`useOfferCtaViewModelComposed`** | « presenter » introduisait un 3ᵉ terme de pattern (MVP) ; C produit le **même ViewModel** que A |
| 6 | Câblage de l'écran dans le **menu cheatcodes** (route + nav + menu) | Permettre le test **visuel** en dev |
| 7 | Query : `queryFn` renvoie un **DTO API** + **`select`** adapte au domaine (`adapters/offerCtaResponseToData`) | Montrer le **bon usage du selector React Query** (adapter), distinct de la décision métier |

## 8. Conclusion

- Architecture du RFC **validée** sur le point chaud : cœur pur testable sans mock, frontière RQ/Zustand propre, `select` = adapter, décision passée de **511 l.** à **≈61 l.** de logique pure.
- Débat §10 Q1 **tranché côté POC** : **variante C (ViewModel composé de hooks use-case + View pure)** pour les composants à coordination ; composant simple sans split pour les feuilles. Invariant : la glu vit dans un hook, jamais dans le JSX.
- `ts-pattern` : **différé**.
- Ces conclusions débloquent l'écriture des ADR (annexe du RFC).
