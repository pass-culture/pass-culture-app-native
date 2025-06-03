VenueOffers
 Cinema venue
- should display movie screening calendar if at least one offer is a movie screening


 When wipVenueArtistsPlaylist feature flag activated
- should display artists playlist when venue offers have artists
- should trigger ConsultArtist log when pressing artists playlist item
- should not display artists playlist when venue offers have artists


 When wipVenueArtistsPlaylist feature flag deactivated
- should not display artists playlist when venue offers have artists


 Artist playlist


 <VenueOffers />
- should display skeleton if offers are fetching
- should display skeleton if playlists are fetching
- should display placeholder when no offers
- should display "En voir plus" button if they are more hits to see than the one displayed
- should not display gtl playlist when gtl playlist is an empty array

