SearchBox
 shouldRedirectToThematicSearch
- should not update searchState when current route is not searchLanding
- should log HasSearchedCinemaQuery analytic


 Without autocomplete
- should stay on the current view when focusing search input and being on the %s view
- should reset input when user click on reset icon when being focus on the suggestions view
- should reset input when user click on reset icon when being on the search results view when isDesktopViewport


 With autocomplete
- should unfocus from suggestion when being focus on the suggestions and press back button
- should hide suggestions when being focus on suggestions and press back button on landing view
- should reset input when user click on reset icon when being focus on suggestions


 Venue previous route on search results
- should unselect the venue and set the view to Landing when current route is search and previous route is Venue when the user press the back button
- should execute go back when current route is search and previous route is Venue
- should update searchState without offerNativeCategories set to undefined when a query is made from another page than ThematicSearch


 ThematicSearch previous route on search results
- should execute go back when current route is search and previous route is ThematicSearch
- should clear offerNativeCategories and gtls when a previous search was made on searchResults and now a query is made on ThematicSearch


 SearchBox component
- should render SearchBox
- should set search state on submit
- should display error message when query submitted is longer than 150 characters
- should navigate to search results on submit
- should not navigate to searchResults when user clicks on reset icon
- should not show back button when being on the search landing view
- should show back button when being on the search results view
- should show back button when being focus on suggestions
- should show the text typed by the user
- should not execute a search if input is empty
- should show reset button when search input is filled
- should not show reset button when search input is empty
- should reset searchState when user go goBack to Landing
- should execute a search if input is not empty
- should display suggestions when focusing search input and no search executed
- should hide the search filter button when being on the search landing view
- should hide the search filter button when being on the search result view and being focus on the suggestion
- should not display locationSearchWidget when isDesktopViewport = true

