# React-query

## Pourquoi ?

- Lire et écrire des données.
- Cache des données.
- Synchronisation des données.

## Conventions du projet

- Les hooks sont dans `src/features/<feature>/queries/` (une seule feature) ou `src/queries/<feature>/` (partagés), et sont nommés `use<Contenu>Query` / `use<Contenu>Mutation` (voir [DR003](../../decision-records/DR003%20-%20queries.md)). Des règles ESLint custom (`queries-must-be-in-queries-folder`, `queries-only-in-use-query-functions`, `no-queries-outside-query-files`) le vérifient.
- Les clés de query sont dans `src/libs/queryKeys.ts`.
- Le client est configuré dans `src/libs/react-query/queryClient.ts` : `retry: 0`, `throwOnError: true` (les erreurs remontent à l'`ErrorBoundary`) et `refetchOnWindowFocus` désactivé en dev et sur testing.

## Lire des données (GET) ⇒ `useQuery` hook

[Documentation des queries](https://tanstack.com/query/v5/docs/framework/react/guides/queries)

Les queries sont exécutées de manière parallèles par défaut.

### Warning vis à vis du comportement par défaut

- Immédiatement après leur résolution, les results d'une query deviennent "stale" (i.e. invalides) ⇒ configurable individuellement ou globalement via `staleTime`. En conséquences, la query refetch en background :
  - Dés qu'une nouvelle instance est montée.
  - Dés que le réseau est reconnecté (sur mobile, `onlineManager` est branché sur NetInfo dans `src/libs/network/NetInfoWrapper.tsx`).
  - Dés que le focus revient sur la fenêtre (sur mobile, `focusManager` est branché sur `AppState` dans `src/libs/react-query/ReactQueryClientProvider.tsx`).
- Les résultats d'une query inutilisée sont gardés dans le cache pendant 5 minutes ⇒ configurable individuellement ou globalement via `gcTime` (anciennement `cacheTime`).

La doc de TanStack Query présente un exemple détaillé du cycle de vie de plusieurs instances d'une même query, avec les valeurs par défaut de `gcTime` et `staleTime` ⇒ https://tanstack.com/query/v5/docs/framework/react/guides/caching

### L'option `enabled`

Utiliser l'option `enabled` pour :

1. Exécuter une query de manière conditionnelle.
2. Exécuter des queries de manière séquentielle (cas particulier de 1.)

Si `enabled` est `false` :

1. `status` vaut `"pending"` (et `fetchStatus` vaut `"idle"`) si aucune donnée en cache.
2. `status` vaut `"success"` si une donnée est en cache.

### isFetching vs isPending vs isLoading

- `isFetching` : query en train de fetch une donnée, quelque soit l'état du cache.
- `isPending` : aucune donnée en cache (y compris pour une query désactivée).
- `isLoading` : `isPending && isFetching`, aucune donnée en cache et query en train de fetch une donnée.

### initialData

Utiliser l'option `initialData`, qui accepte soit une variable soit une fonction, pour ne pas exécuter le 1er fetch de la query.

Notamment, il est possible d'initialiser une query avec les données cachées d'une autre query : https://tanstack.com/query/v5/docs/framework/react/guides/initial-query-data#initial-data-from-cache.

### Retries

Les retries sont désactivés globalement (`retry: 0` dans `queryClient.ts`).

Si on les réactive sur une query, le délai de retry par défaut est de **1s** et double à chaque essai, sans excéder **30s** (`retryDelay`).

### Partage du résultat d'une query

1er cas : le résultat n'est pas modifié fréquemment.

- On peut précharger la query, par exemple au lancement de l'application, avec `queryClient.prefetchQuery` (voir `src/libs/react-query/usePrefetchQueries.ts`).
- On configure la query avec des valeurs élevées pour `staleTime` et `gcTime`.
- On récupère le résultat en réutilisant le hook de la query (même `queryKey`), ou hors composant via `queryClient.getQueryData(queryKey)`.
- Si le résultat doit être muté, il faut bien prendre garde à invalider la query et/ou modifier les données du cache.

2ème cas : le résultat est fréquemment modifié.

- On configure la query avec des valeurs faibles pour `staleTime` et `gcTime`.
- On recréer des instances de la query (en se basant sur sa `queryKey`) pour récupérer les résultats.
- On est ok avec le fait que les résultats peuvent être refetched en background.

La logique des cas précédents est abstraite dans des hooks `use<Contenu>Query` (voir les conventions plus haut).

## Écrire des données (POST, PUT, PATCH) ⇒ `useMutation` hook

[Documentation des mutations](https://tanstack.com/query/v5/docs/framework/react/guides/mutations)

### Déclencher un refetch (background) de query après une mutation

Appeler `queryClient.invalidateQueries({ queryKey })` (avec `const queryClient = useQueryClient()`) dans un des callbacks de `useMutation`, typiquement `onSuccess`.

### MaJ du résultat d'une query après une mutation sans déclencher de refetch

Appeler `queryClient.setQueryData(queryKey, updater)` dans un des callbacks de `useMutation`, typiquement `onSuccess`.

## Chargement global ⇒ `useIsFetching` hook

Pour déterminer si une query (n'importe laquelle) est en train de récupérer des données.

```tsx
const isGlobalFetching = useIsFetching()
```

## Autres fonctionnalités de React Query (moins utilisées a priori)

### Pagination ⇒ option `placeholderData: keepPreviousData` (`usePaginatedQuery` n'existe plus)

### Scroll infini ⇒ `useInfiniteQuery(...)` hook

### Prefetching ⇒ `queryClient.prefetchQuery(...)`

### Persistance ⇒ option `meta: { persist: true }`

Sur mobile, les queries réussies avec `meta: { persist: true }` sont persistées dans l'AsyncStorage (voir `src/libs/react-query/ReactQueryClientProvider.tsx`).

### Annulation d'une query

## References

- Page d'accueil de React-Query : https://tanstack.com/query/latest
