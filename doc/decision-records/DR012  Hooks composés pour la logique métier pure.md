# DR012 : Extraire la logique métier dans des fonctions pures

> Statut : Adopté

## Décision

La logique métier complexe et les calculs d'états dérivés doivent être implémentés dans des **fonctions pures** (des fonctions qui, pour une même entrée, produisent toujours la même sortie, sans effets de bord).

Les **hooks** servent ensuite de "connecteurs" pour utiliser ces fonctions pures au sein de l'écosystème React, notamment avec `useMemo` pour les calculs dérivés ou dans des hooks personnalisés.

## Contexte

Actuellement, la logique métier est souvent mélangée au sein des `Context Wrappers` ou directement dans les composants. Le titre précédent de cet ADR ("Hooks composés pour la logique métier pure") était ambigu et pouvait encourager à placer de la logique directement dans les hooks, ce qui nuit à la testabilité.

## Alternatives considérées

- **Laisser la logique dans les composants ou les hooks :** Rejeté car cela conduit à des composants volumineux, rend les tests unitaires de la logique difficiles (nécessite un environnement React) et viole le principe de responsabilité unique.
- **Utiliser des classes de service :** Rejeté car l'approche par fonctions pures est plus simple et plus idiomatique dans un écosystème fonctionnel comme React.

## Justification

- **Testabilité Extrême :** Une fonction pure est l'unité de code la plus simple à tester. On peut la tester en isolation totale, sans avoir besoin de l'environnement React (`react-testing-library`) ou de mocks complexes.
- **Lisibilité :** La logique métier est clairement séparée de la logique de l'interface (React). Un développeur peut comprendre le calcul métier sans avoir à déchiffrer la syntaxe des hooks.
- **Réutilisabilité :** Une fonction pure peut être utilisée n'importe où dans l'application, pas seulement dans des composants React.

## Exemple de principe (Avant/Après)

**Avant (Logique dans le hook - ce qu'il faut éviter) :**

```typescript
// ❌ Anti-pattern : Logique complexe dans le hook
function useFormattedPrice(offer) {
  const price = useMemo(() => {
    // Logique de calcul complexe...
    let finalPrice = offer.price;
    if (offer.isDigital) { finalPrice *= 1.2; } // TVA
    if (offer.hasDiscount) { finalPrice *= 0.9; } // Réduction
    return `${finalPrice.toFixed(2)} €`;
  }, [offer]);
  return price;
}
```

**Après (Logique dans une fonction pure - la bonne pratique) :**

```typescript
// ✅ Bonne pratique : La logique est dans une fonction pure et testable

/** Calcule le prix final d'une offre. */
export function calculateFinalPrice(offer) {
  let finalPrice = offer.price;
  if (offer.isDigital) { finalPrice *= 1.2; } // TVA
  if (offer.hasDiscount) { finalPrice *= 0.9; } // Réduction
  return `${finalPrice.toFixed(2)} €`;
}

// Le hook devient un simple connecteur qui optimise le calcul avec useMemo.
function useFormattedPrice(offer) {
  const price = useMemo(() => calculateFinalPrice(offer), [offer]);
  return price;
}
```

### Exemples concrets du code

# Le bon exemple : `getRegionFromPosition`

- **La fonction pure :** Dans `src/features/venueMap/helpers/getRegionFromPosition/getRegionFromPosition.ts`, la fonction `getRegionFromPosition` effectue des calculs trigonométriques pour déterminer une région de carte. Elle ne fait que calculer et retourner une valeur.
- **Le hook connecteur :** Dans `src/features/venueMap/pages/VenueMap/VenueMap.tsx`, un `useMemo` appelle cette fonction pure pour s'assurer que le calcul n'est ré-exécuté que si les dépendances changent.

```typescript
// Le hook se contente de connecter la fonction pure à la vie du composant.
const region = useMemo(() => getRegionFromPosition(location, ratio), [ratio, location]);
```

# Exemple : Calcul d'un état dérivé de données serveur (`countUpcomingEvents`)

Cet exemple montre comment une donnée issue de React Query (état serveur) est ensuite traitée par une fonction pure (conformément à DR012) pour produire un état client dérivé.

**Avant (anti-pattern selon DR012) :**

```typescript
// ❌ Anti-pattern : Logique de calcul complexe directement dans le composant
function ArtistPage({ artistId }) {
  const { data: artist } = useArtistQuery(artistId); // Donnée serveur

  const numberOfUpcomingEvents = useMemo(() => {
    if (!artist?.events) return 0;
    const now = new Date();
    return artist.events.filter(event => new Date(event.date) > now).length;
  }, [artist]);

  // ...
}
```

**Après (bonne pratique, respectant DR012) :**

```typescript
// ✅ Bonne pratique : La logique de calcul est dans une fonction pure (DR012)

// Fichier : src/features/artist/helpers/countUpcomingEvents.ts (Fonction pure)
export function countUpcomingEvents(events: Event[]): number {
  if (!events) return 0;
  const now = new Date();
  return events.filter(event => new Date(event.date) > now).length;
}

// Fichier : src/features/artist/hooks/useNumberOfUpcomingEvents.ts (Hook personnalisé)
import { useMemo } from 'react';
import { countUpcomingEvents } from 'features/artist/helpers/countUpcomingEvents';
import { Artist } from 'api/gen'; // Assumant le type Artist

export function useNumberOfUpcomingEvents(artist: Artist | undefined): number {
  const numberOfUpcomingEvents = useMemo(() => {
    return countUpcomingEvents(artist?.events || []);
  }, [artist]);
  return numberOfUpcomingEvents;
}

// Fichier : ArtistPage.tsx (Utilisation du hook personnalisé)
import { useArtistQuery } from 'features/artist/queries/useArtistQuery';
import { useNumberOfUpcomingEvents } from 'features/artist/hooks/useNumberOfUpcomingEvents'; // Import du hook personnalisé

function ArtistPage({ artistId }) {
  const { data: artist } = useArtistQuery(artistId);

  // Utilisation du hook personnalisé pour obtenir le nombre d'événements.
  const numberOfUpcomingEvents = useNumberOfUpcomingEvents(artist);

  // ...
}
```

# L'anti-pattern (et sa correction) : le tri des favoris

- **L'anti-pattern :** Dans `src/features/favorites/components/FavoritesResults.tsx`, la logique de tri est dans une fonction `applySortBy` qui n'est pas pure car elle mute directement le tableau qu'elle reçoit (`list.sort(...)`).

- **La solution :**
    1. On crée une fonction pure `getSortedFavorites` dans un fichier `helpers` qui travaille sur une **copie** du tableau (`[...list]`) pour ne pas muter l'original.
    2. Le `useMemo` dans le composant appelle maintenant cette fonction pure, rendant la logique de tri prédictible et sûre.

```typescript
// ✅ Le hook appelle la nouvelle fonction pure et testable.
const sortedFavorites = useMemo(() => {
  if (!data?.favorites) return [];
  return getSortedFavorites(data.favorites, favoritesState.sortBy, position);
}, [data?.favorites, favoritesState.sortBy, position]);
```
