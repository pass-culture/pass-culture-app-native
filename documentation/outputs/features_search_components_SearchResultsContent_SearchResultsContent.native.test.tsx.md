SearchResultsContent
 Category filter
- should display category filter button
- should open the categories filter modal when pressing the category button


 Price filter
- should display price filter button
- should open the prices filter modal when pressing the prices filter button


 When user is logged in and is benificiary with credit
- should display Duo filter button
- should open the duo filter modal when pressing the duo filter button


 when user is logged in and beneficiary with no credit
- should not display Duo filter button


 when user is not logged in
- should not display Duo offer button


 when user is not a beneficiary
- should not display Duo offer button


 Offer Duo filter


 should not display geolocation incitation button
- when position is not null
- when a category filter is selected and position is null
- when position is null and no results search


 Venue filter
- should open the venue modal when pressing the venue filter button
- should call set search state on press "Rechercher" in venue modal
- should display "Lieu culturel" in venue filter if no venue is selected
- should display venueButtonLabel in venue filter if a venue is selected
- should display "Lieu culturel" in venue filter if location type is AROUND_ME
- should display "Lieu culturel" in venue filter if location type is EVERYWHERE


 Dates and hours filter
- should display dates and hours filter button
- should open the type filter modal when pressing the type filter button


 Accessibility filter
- should display accessibility filter button
- should open accessibility filters modal when accessibilityFiltersButton is pressed


 when search returns no results
- should render NoSearchResults component
- should render NoSearchResults component with query
- should render NoSearchResults when location is not everywhere
- should navigate to SearchFilter when location is everywhere
- should navigate to SearchResults when location is not EVERYWHERE
- should log ExtendSearchRadiusClicked when `Élargir la zone de recherche` cta is pressed
- should not log NoSearchResult when there is not search query execution
- should log NoSearchResult only one time when there is search query execution, nbHits = 0 and several re-render
- should log NoSearchResult with search result when there is search query execution and nbHits = 0


 should display geolocation incitation button
- when position is null
- when position is null and query is not an offer not present


 Offer unavailable message
- should display when query is an unavailable offer
- should not display when query is an available offer


 Main filter button
- should display filter button with the number of active filters


 when feature flag map in search deactivated
- should not display tabs


 and user location selected is everywhere
- should open venue map location modal when pressing map tab
- should not display venue map when pressing map tab


 when feature flag map in search activated
- should display tabs
- should log consult venue map when pressing map tab
- should reset selected venue in store when pressing map tab
- should display empty state view when there is no search result
- should not open venue map location modal when pressing map tab and user location selected is not everywhere
- should display venue map when pressing map tab if user location selected is not everywhere


 When calendar filter feature flag activated
- should display Dates in button filter
- should open calendar modal


 Artists section
- should display artists playlist when there are artists
- should not display artists playlist when there are not artists
- should trigger consult artist log when pressing artists playlist item


 SearchResultsContent component
- should render correctly
- should trigger onEndReached
- should open geolocation activation incitation modal when pressing geolocation incitation button
- should not log PerformSearch when there is not search query execution
- should log PerformSearch only one time when there is search query execution and several re-render
- should log PerformSearch with search result when there is search query execution
- should log PerformSearch with accessibilityFilter when there is search query execution
- should log open geolocation activation incitation modal when pressing geolocation incitation button

