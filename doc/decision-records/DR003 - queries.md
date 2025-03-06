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

## De-hookification

- useBookingOffer => à supprimer
- useBookingStock => hook de hook
- useRotatingText => challenger l'animation du loader (on imagine que c'est pour les billeteries externes)
- reducer dans features/bookOffer, mimique Redux
- useCookiesChoiceByCategory => ça commence par "use" mais ça n'appelle aucun hook
- useUserHasBookingsQuery => select
- src/features/favorites/hooks/useFavorite.ts => select + à déplacer dans les select communs

### Devrait utiliser react-query

- getCookiesLastUpdate => useIsCookiesListUpToDate est plus complexe que nécessaire
