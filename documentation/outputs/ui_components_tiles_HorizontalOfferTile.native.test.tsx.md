HorizontalOfferTile
 When pressing an offer without object id
- should not navigate to the offer
- should not log analytics event


 When offer is a `SEANCE_CINE`
- should format releaseDate when release date is after now
- should format dates when no releaseDate is given


 user has chosen FranceEntière
- should not show distance


 user has chosen FranceEntière but has geolocation activated
- should show distance


 onSearchResults


 user has chosen FranceEntière but has geolocation activated
- should not show distance


 user has chosen geolocation
- should show distance


 user has an unprecise location (type municipality or locality)
- should not show distance


 user has a precise location (type housenumber or street)
- should show distance


 distances


 HorizontalOfferTile component
- should navigate to the offer when pressing an offer
- should log analytics event when pressing an offer
- should notify Algolia when pressing an offer

