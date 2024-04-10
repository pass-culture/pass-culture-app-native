# React-query

## Pourquoi ?

- Lire et écrire des données.
- Cache des données.
- Synchronisation des données.

## Lire des données (GET) ⇒ `useQuery` hook

[Documentation de useQuery](https://tanstack.com/query/v4/docs/framework/react/reference/useQuery)

Les queries sont exécutées de manière parallèles par défaut.

### Warning vis à vis du comportement par défaut

- Immédiatement après leur résolution, les results d'une query deviennent "stale" (i.e. invalides) ⇒ configurable individuellement ou globalement via `staleTime`. En conséquences, la query refetch en background :
  - Dés qu'une nouvelle instance est montée.
  - Dés que le réseau est reconnecté.
  - Dés que le focus revient sur la fenêtre (quid avec react-native sur mobile ?)
- Les résultats d'une query sont enregistrés dans le cache pendant 5 minutes après la dernière utilisation de cette query ⇒ configurable individuellement ou globalement via `cacheTime`.

La doc de React-Query présente un exemple détaillé du cycle de vie de plusieurs instances d'une même query, avec les valeurs par défaut de `cacheTime` et `staleTime` ⇒ https://react-query.tanstack.com/docs/guides/caching#a-detailed-caching-example

### L'option `enabled`

Utiliser l'option `enabled` pour :

1. Exécuter une query de manière conditionnelle.
2. Exécuter des queries de manière séquentielle (cas particulier de 1.)

Si `enabled` est `false`, le `status` de la query est :

1. `"idle"` si aucune donnée en cache.
2. `"success"` si une donnée est en cache.

### isFetching vs isLoading

- `isFetching` : query en train de fetch une donnée, quelque soit l'état du cache.
- `isLoading` : aucune donnée en cache et query en train de fetch une donnée.

### initialData

Utiliser l'option `initialData`, qui accepte soit une variable soit une fonction, pour ne pas exécuter le 1er fetch de la query.

Notamment, il est possible d'initialiser une query avec les données cachées d'une autre query : https://react-query.tanstack.com/docs/guides/initial-query-data#initial-data-from-cache.

### Retries

Par défaut, le délai de retry d'une query est de **1s** et double à chaque essai, sans excéder **30s**.

Le délai, le nombre de retries, les faits que la query ne retry jamais ou retry de manière infinie sont configurables de manière individuelle ou globale.

### Partage du résultat d'une query

1er cas : le résultat n'est pas modifié fréquemment.

- On déclenche la query de manière manuelle (`enabled = false`), par exemple au lancement de l'application.
- On configure la query avec des valeurs élevées pour `staleTime` et `cacheTime`.
- On récupère le résultat de la query via `cache.getQueryData(key)` .
- Si le résultat doit être muté, il faut bien prendre garde à invalider la query et/ou modifier les données du cache.

2ème cas : le résultat est fréquemment modifié.

- On configure la query avec des valeurs faibles pour `staleTime` et `cacheTime`.
- On recréer des instances de la query (en se basant sur sa `key`) pour récupérer les résultats.
- On est ok avec le fait que les résultats peuvent être refetched en background.

La logique des cas précédents peut être abstraite dans des hooks, par exemple `useGetUser`.

## Écrire des données (POST, PUT, PATCH) ⇒ `useMutation` hook

[Documentation de useMutation](https://tanstack.com/query/v4/docs/framework/react/reference/useMutation)

### Déclencher un refetch (background) de query après une mutation

Appeler `cache.invalidateQueries(key)` dans un des callbacks de `useMutation`, typiquement `onSuccess`.

### MaJ du résultat d'une query après une mutation sans déclencher de refetch

Appeler `cache.setQueryData(key)` dans un des callbacks de `useMutation`, typiquement `onSuccess`.

## Chargement global ⇒ `useIsFetching` hook

Pour déterminer si une query (n'importe laquelle) est en train de récupérer des données.

```tsx
const isGlobalFetching = useIsFetching()
```

## Autres fonctionnalités de React Query (moins utilisées a priori)

### Pagination ⇒ `usePaginatedQuery(...)` hook

### Scroll infini ⇒ `useInfiniteQuery(...)` hook

### Prefetching ⇒ `queryCache.prefetchQuery(...)` hook

### Annulation d'une query

## References

- Page d'accueil de React-Query : https://tanstack.com/query/latest
