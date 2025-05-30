# DR003 - Queries

## Audit Folders

### Cheatcodes

- useSomeOfferIdQuery
- useFeatureFlagAllQuery
- useVenue => CheatcodesScreenAccesLibre

## App State

- useDeviceInfo => dans un hook pas stocké sur un Store
- storage !! => stockage persisté de l'app
- BookingWrapper => voir ce qu'on fait avec le contexte de booking & useBookingContext
- useReviewInAppInformation => app state persisté à regarder
- setFirebaseParams
- usePersistCookieConsentMutation => c'est une mutation qui appelle le storage
- useCookies
- startTrackingAcceptedCookies et server state ?
- startTracking
- setMarketingParams => peut etre ?
- useDeviceInfo

## De-hookification

- useBookingOffer => à supprimer
- useBookingStock => hook de hook
- useRotatingText => challenger l'animation du loader (on imagine que c'est pour les billeteries externes)
- reducer dans features/bookOffer, mimique Redux
- useCookiesChoiceByCategory => ça commence par "use" mais ça n'appelle aucun hook
- useUserHasBookingsQuery => select
- src/features/favorites/hooks/useFavorite.ts => select + à déplacer dans les select communs
- src/features/home/queries/useVideoOffersQuery => extraire query + déplacer les logiques dans des selects + tester + simplifier la logique
- src/features/home/queries/useGetOffersDataQuery => extraire query + déplacer les logiques dans des selects + tester

### Devrait utiliser react-query

- getCookiesLastUpdate => useIsCookiesListUpToDate est plus complexe que nécessaire

## Propositions

### Queries invalidées au changement de localisation

Tester un POC de mise en place d'une logique pour l'invalidation des queries au changement de la localisation.

Le message du dessus a été ajouté plus tot, ces fichiers pourraient aussi en profiter :

- src/features/home/api/useGetVenuesData.ts
- src/features/home/api/useVideoCarouselData.ts
