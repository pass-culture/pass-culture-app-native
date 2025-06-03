SearchListHeader
 venuePlaylistTitle


 When feature flags deactivated
- should display the number of results
- should not display the geolocation button if position is not null
- should display the geolocation incitation button when position is null
- should display paddingBottom when nbHits is greater than 0
- should not display paddingBottom when nbHits is equal to 0
- should render venue items when there are venues
- should render venues nbHits
- should trigger VenuePlaylistDisplayedOnSearchResults log when there are venues and location type is undefined with isLocated param = false
- should not trigger VenuePlaylistDisplayedOnSearchResults log when there are venues and location type is VENUE with isLocated param = true
- should trigger AllTilesSeen log when there are venues
- should not render venue items when there are not venues
- should not render venues nbHits
- should not trigger VenuePlaylistDisplayedOnSearchResults log when there are not venues
- should not trigger AllTilesSeen log when there are not venues
- should not show disability title when NO disabilities are selected
- should show disability title when at least one disability is selected


 When wipVenueMapInSearch feature flag activated
- should not displayed the button "Voir sur la carte"


 <SearchListHeader />
- should display system banner for geolocation incitation

