OfferFooter
 Content when offer is a movie screening
- should display cineContentCTA when remote config is on


 Content when offer has a publication date in the future
- should display coming soon banner
- should display addToFavorites button when offer has not been added to favorites
- should display removeFromFavorites button when offer has been added to favorites
- should display addReminder button
- should display disableReminder button
- should display signinModal when user presses favorite button but is not logged in
- should add offer to favorites when user is logged in and presses addTofavorite button
- should remove offer from favorites when user is logged in and presses removeFromfavorite button
- should display loader when addToFavorite button is loading
- should display snackbar when addReminder fails
- should show reminder authentication modal when not logged in
- should call addReminder when no existing reminder
- should call deleteReminder when existing reminder


 Content when offer is not a movie screening and does not have a publicationDate in the future
- should display CTA received as props


 Content when offer is not a movie screening, does not have a publicationDate in the future and viewport is desktop
- should return null


 OfferFooter

