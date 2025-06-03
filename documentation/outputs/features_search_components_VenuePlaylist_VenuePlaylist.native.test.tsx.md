VenuePlaylist
 When wipVenueMap feature flag activated
- should display Voir sur la carte button when current view is ThematicSearch
- should display number of results when current view is not ThematicSearch
- should set venue types filter when search group associated to venue types when pressing Voir sur la carte button
- should set venue types filter as empty array when search group not associated to venue types when pressing Voir sur la carte button
- should set venue types filter as empty array when no search group specified when pressing Voir sur la carte button
- should open venue map location modal when pressing Voir sur la carte button and user location is not located
- should navigate to venue map when pressing Voir sur la carte button and user is located
- should trigger ConsultVenueMap log when pressing Voir sur la carte button and user is located
- should not trigger ConsultVenueMap log when pressing Voir sur la carte button and user is not located


 Separator
- should display Separator when shouldDisplaySeparator is true
- should not display Separator when shouldDisplaySeparator is false


 <VenuePlaylist />
- should render the title and venues playlist
- should not display Voir sur la carte button when current view is ThematicSearch and wipVenueMap feature flag deactivated

