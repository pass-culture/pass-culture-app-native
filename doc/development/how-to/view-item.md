# ViewItem

Un événement Firebase `ViewItem` par item visible, envoyé tout de suite. Avant, les items d'une playlist étaient bufferisés puis envoyés en un événement au blur de la page (`usePageTracking`, `TrackingManager`, `AppLifecycleManager`).

Fonction : `src/libs/analytics/helpers/logViewItem.ts`. Déclencheur : `ObservedPlaylist` appelle `onItemViewed` pour chaque item de `changed` avec `isViewable`, seulement si la playlist est dans le viewport. Rejeu des derniers items au focus et au retour dans le viewport.

## Paramètres

| champ | obligatoire | valeur |
| --- | --- | --- |
| `origin` | oui | `home` \| `search` \| `offer` \| `artist` \| `venue` \| `venueMap` |
| `playlistIndex` | oui | rang de la playlist sur la page, à partir de 0 |
| `index` | oui | rang de l'item dans la playlist |
| `type` | oui | `offer` \| `venue` \| `artist` |
| `id` | oui | id de l'item vu |
| `event_timestamp` | oui | ISO au moment du log, y compris à chaque réapparition |
| `playlistId` | oui | id Contentful du module, ou clé interne (`playlist.type`, `venue_offers_list`, titre GTL, etc.) |
| `originId` | oui | id de la page : home Contentful, `searchId`, id de l'offre, de l'artiste, du lieu. Sur la carte, id du lieu sélectionné |
| `callId` | non | id d'appel reco, seulement s'il est présent |

La recherche ne logue pas tant que `searchId` n'existe pas. `callId` vient du module reco, du module d'offres hybride, et des playlists similaires d'une offre. `null` n'est pas envoyé.

## Où

| surface | fichier | origin | playlistId | originId |
| --- | --- | --- | --- | --- |
| Home offres | `OffersModule` | `home` | id Contentful | `homeEntryId`. `callId` si module hybride |
| Home reco | `RecommendationModule` | `home` | id Contentful | `homeEntryId`. `callId` si présent |
| Home lieux | `VenuesModule` | `home` | id Contentful | `homeEntryId` |
| Home / page artiste | `ArtistPlaylistModule` | `home` ou `artist` | id Contentful | `homeEntryId` ou `artistId` |
| Offre | `OfferPlaylistList` | `offer` | `playlist.type` | id de l'offre de la page. `callId` si présent |
| Artiste, playlists catégorie | `ArtistCategoryPlaylist` | `artist` | `entryId` | id de l'artiste |
| Lieu, toutes les offres | `VenueOffersList` | `venue` | `venue_offers_list` | id du lieu. `playlistIndex` 0 |
| Lieu, artistes | `VenueOffersList` | `venue` | `venue_artists_carousel` | id du lieu. `playlistIndex` 1 |
| Lieu, GTL | `VenueOffersList` | `venue` | `playlist.title` | id du lieu |
| Carte | `VenueMapOfferPlaylist` | `venueMap` | `venue_map` | id du lieu sélectionné |
| Recherche, grille d'offres | `SearchResultsContent` | `search` | `searchResults` | `searchId`. `playlistIndex` 0, ou 1 si playlist lieux |
| Recherche, lieux | `SearchListHeader`, `VenuesPlaylistContainer` | `search` | `searchResultsVenuePlaylist` | `searchId` |
| Recherche thématique, lieux | `ThematicSearch` | `search` | `thematicSearchVenuePlaylist` | `searchId` |
| Recherche thématique, offres | `ThematicSearchPlaylistList`, `BookPlaylists` | `search` | `playlist.title` | `searchId` |

## Écarts avec l'ancien payload

L'ancien événement groupait une playlist au blur : `origin`, `viewedAt`, `moduleId`, `itemType`, `index`, `items_0…n`, `searchId`, `entryId`, `callId`, `homeEntryId`.

| avant | maintenant |
| --- | --- |
| un événement par playlist, au blur | un événement par item, à chaque apparition |
| `viewedAt` | `event_timestamp`, heure du log |
| `moduleId` | `playlistId` |
| `itemType` | `type` |
| `index` du module, index d'item dans `items_N` | `playlistIndex` et `index` |
| `homeEntryId`, `searchId`, `entryId` | `originId` |
| `callId` seulement sur la reco home, souvent vide | `callId` dès qu'il est présent |
| `artistId` | jamais envoyé. L'id de la page artiste est `originId` |

## Retiré

`src/shared/tracking/` (`usePageTracking`, `TrackingManager`, `AppLifecycleManager`, `TrackingLogger`, `useViewableItemsTracker`) et `src/shared/analytics/logViewItem.ts`.

Le buffer servait à n'envoyer qu'au blur, avec les items concaténés. Chaque écran remontait `onViewableItemsChanged` jusqu'à la page. Le log est maintenant local à la playlist, donc cette chaîne ne sert plus.

`logEventAnalytics.logViewItem` (objet analytics, ancien format groupé) est encore déclaré. Aucun appel.
