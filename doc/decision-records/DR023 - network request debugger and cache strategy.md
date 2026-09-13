# DR023 - Network debugger et stratégie de cache des requêtes backend

> Statut : Proposé

## Decision

Nous décidons de mettre en place une démarche en quatre temps — **Observer → Comprendre → Décider → Agir** — pour reprendre le contrôle des appels réseau vers le backend, complétée d'un volet transversal de **résilience aux erreurs** :

1. **Observer** — Construire un **network debugger** in-app (cheatcode), répliqué de l'analytics debugger existant : capture de 100 % des appels backend au point de passage unique `safeFetch` / `handleGeneratedApiResponse` (`src/api/apiHelpers.ts`), store Zustand avec ring buffer, bulle flottante + modal + écran cheatcode, activé par une variable d'environnement `NETWORK_DEBUGGER_ENABLED` (désactivée en production). Le périmètre est strictement le backend pass Culture : Algolia et Contentful, qui passent par d'autres clients, sont exclus par construction.
2. **Comprendre** — Instrumenter les métriques qui désignent les endpoints les plus mal gérés : nombre d'appels par endpoint (routes normalisées `/offer/:id`), % de réponses strictement identiques à la précédente (hash du body = mesure du « refetch inutile »), rafales/doublons (même endpoint appelé N fois en quelques secondes), taille des payloads, requêtes par écran (corrélation react-navigation), configuration React Query effective (`staleTime`/`gcTime` via `queryClient.getQueryCache()`), taux d'erreur par endpoint. Export JSON de session pour analyse à froid.
3. **Décider** — Définir avec le PM **trois catégories de fraîcheur** avec presets `staleTime`/`gcTime` associés (ordres de grandeur à arbitrer en atelier) :
   | Catégorie | Définition | staleTime | gcTime |
   |---|---|---|---|
   | 1 — Temps réel | une donnée périmée fausse une action en cours | 0–30 s | 5 min |
   | 2 — Fraîche | quelques minutes de retard sont invisibles | 5 min | 30 min |
   | 3 — Stable | change rarement, une heure de délai est sans effet | ≥ 1 h | 24 h |

   Chaque endpoint est classé en posant une question simple au PM (« ces données peuvent-elles dater de X ? »). Une fois la classification faite, basculer le **`staleTime` global par défaut au-dessus de 0** pour que le refetch redevienne un choix explicite.
4. **Agir** — Appliquer les catégories endpoint par endpoint, en commençant par le haut du classement mesuré (candidats pressentis : profil utilisateur rechargé au retour sur la home, rafale de requêtes au lancement, page Offre), et mesurer l'avant/après avec le debugger lui-même.

**Volet transversal — Résister** : anti-spam sur les actions utilisateur (bouton désactivé + loading pendant la mutation en vol via `isPending`, cooldown après échec), retry automatique maîtrisé sur les lectures (1-2 tentatives avec backoff exponentiel + jitter, jamais sur les 4xx), et circuit breaker / mode dégradé (après N erreurs 5xx consécutives : bannière « service perturbé » et suspension temporaire des refetchs et retries).

Objectif chiffré : **diviser par 2 à 3 le nombre de requêtes réelles envoyées au backend** sur les parcours mesurés.

## Context

L'application souffre de plusieurs problèmes liés à la gestion des appels réseau : le backend est surchargé (crash du scaling constaté autour de 130 000 utilisateurs), des requêtes partent trop souvent et sans nécessité, et les erreurs sont mal contenues (une requête en échec laisse le bouton cliquable, les utilisateurs martèlent et amplifient la panne).

L'audit du code confirme les causes côté frontend :

- La configuration React Query globale (`src/libs/react-query/queryClient.ts`) ne définit **aucun `staleTime`** (défaut : 0) → chaque remontage de composant refait une requête réseau ; `refetchOnWindowFocus` est actif en prod/staging et branché sur l'AppState → chaque retour dans l'app relance des refetchs ; de nombreuses queries n'ont aucun `staleTime` explicite (ex. `useOfferQuery`).
- `retry: 0` globalement : les re-appels perçus viennent des refetchs sur montage/focus et du spam utilisateur, pas de retries automatiques.
- **Aucune instrumentation HTTP n'existe** (pas de Flipper/Reactotron, Sentry sans tracing HTTP explicite, Firebase Perf en traces custom uniquement) : nous ne savons pas objectivement quels endpoints sont les plus mal gérés.

Deux atouts rendent la solution peu coûteuse :

- **Point d'interception unique** : tous les appels du client généré passent par `safeFetch` (92 sites d'appel dans `src/api/gen/api.ts`), qui pose déjà un header `request-id` (UUID) corrélable avec les logs backend. Seule exception : EduConnect (fetch brut SAML), hors périmètre initial.
- **Modèle éprouvé** : l'analytics debugger (`src/features/analyticsDebugger/`, PC-42771) fournit l'architecture complète à répliquer (capture en un point, store, bulle, modal, cheatcode, kill switch par env).

## Alternatives considered

- **`react-native-network-logger`** (UI clé en main interceptant tout le trafic XHR/fetch) : rapide à poser, mais capte aussi Algolia/Contentful (filtrage à maintenir), ignore le contexte React Query (`staleTime`, observers, cache) et son UI ne s'intègre pas aux cheatcodes existants.
- **React Query Devtools / plugins DevTools React Native** (type Rozenite) : utiles sur poste de développeur, mais ne répondent pas au besoin « naviguer sur un téléphone en staging et voir les stats » ; complément possible, pas un remplacement.
- **Instrumentation Sentry / Firebase Performance** : donne des agrégats en production mais pas la vue par écran ni la corrélation avec la config React Query, et n'aide pas à décider des `staleTime` endpoint par endpoint.
- **Optimiser sans mesurer** (appliquer directement des `staleTime` au jugé) : risque de casser des parcours qui exigent des données fraîches et impossibilité de prouver les gains ; c'est précisément l'absence de données qui bloque aujourd'hui.

## Justification

- Le wrapper custom sur `safeFetch` garantit le périmètre backend **par construction**, sans dépendance externe, et donne accès au `request-id` existant et au cache React Query — aucune alternative ne combine ces trois points.
- La réplication de l'analytics debugger réutilise une architecture déjà validée par l'équipe (effort et risque minimaux).
- Les catégories de fraîcheur transforment une décision technique diffuse (« quel `staleTime` ? ») en une décision produit simple et déléguable, applicable par un développeur junior sans débat de valeurs.
- La métrique « % de réponses identiques » fournit une preuve objective du gaspillage et un critère de priorisation, au lieu d'intuitions.
- Le volet résilience réduit l'amplification des pannes par les clients (spam de boutons, refetchs pendant un incident), ce qui adresse directement le scénario de crash en montée en charge.

## Consequences

Positives :

- Visibilité objective sur les requêtes backend en staging, partageable (export JSON) et corrélable avec les logs backend via `request-id`.
- Réduction attendue de la charge backend (÷2 à ÷3 sur les parcours mesurés) sans dégradation produit, les fraîcheurs étant validées par le PM.
- Règles de cache simples et documentées, applicables uniformément par toute l'équipe.
- Meilleure tenue de l'app pendant les incidents backend (anti-spam, backoff, mode dégradé).

Négatives / points d'attention :

- Effort initial de construction du debugger et discipline pour classer les endpoints avec le PM.
- La bascule du `staleTime` global par défaut change le comportement de **toutes** les queries : à faire seulement après la classification, avec une recette attentive aux parcours sensibles (réservation, crédit).
- Le debugger doit rester compilé hors production (flag d'env) ; la capture des payloads doit rester opt-in pour éviter de manipuler des données personnelles inutilement.
- EduConnect n'est pas couvert par l'interception initiale (fetch brut) — à tracer explicitement si besoin.

## Actions to be implemented

1. Créer le ticket « Network debugger — socle » : wrapper `safeFetch`, store, bulle + modal généralisés depuis l'analytics debugger, écran cheatcode, flag `NETWORK_DEBUGGER_ENABLED`.
2. Créer le ticket « Network debugger — analyses » : vue par endpoint (compteurs + config React Query), % de réponses identiques, détection de rafales, puis vue par écran, payloads, taux d'erreur, export JSON.
3. Mener des sessions de navigation instrumentées en staging sur les parcours clés (lancement → home → offre → retour home).
4. Organiser l'atelier PM : arbitrer les presets des trois catégories et classer le top 20 des endpoints mesurés.
5. Appliquer les presets par catégorie, puis basculer le `staleTime` global par défaut.
6. Créer le ticket « Anti-spam mutations » (`isPending` + cooldown après échec) et cadrer le circuit breaker / mode dégradé pour les incidents 5xx.
7. Mesurer l'avant/après avec le debugger et communiquer les gains.

## References

- Analytics debugger, modèle d'architecture : `src/features/analyticsDebugger/` (PC-42771, PR #9922)
- Point d'interception : `src/api/apiHelpers.ts` (`safeFetch`, `handleGeneratedApiResponse`)
- Configuration React Query : `src/libs/react-query/queryClient.ts`, `src/libs/react-query/ReactQueryClientProvider.tsx`
- DR003 - Queries (audit préexistant des hooks/queries)
- Document d'analyse détaillé avec priorisation et wireframes (interne, non versionné) : `.context/brainstorming/analyse-appels-reseau-backend.html`
