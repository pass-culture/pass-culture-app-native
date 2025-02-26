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

## De-hookification

- useBookingOffer => à supprimer
- useBookingStock => hook de hook
- useRotatingText => challenger l'animation du loader (on imagine que c'est pour les billeteries externes)
- reducer dans features/bookOffer, mimique Redux
