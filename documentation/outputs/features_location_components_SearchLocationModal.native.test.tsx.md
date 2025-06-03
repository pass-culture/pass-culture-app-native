SearchLocationModal
 PlaceRadius
- should display default radius if it wasn't set previously
- should call searchContext dispatch with mockRadiusPlace when pressing "Valider la localisation"
- should display default radius even if an AroundMeRadius was set previously


 AroundMeRadius
- should display default radius if it wasn't set previously
- should call searchContext dispatch with mockAroundMeRadius when pressing "Valider la localisation"
- should display default radius even if a PlaceRadius was set previously


 SearchLocationModal
- should render correctly if modal visible
- should trigger logEvent "logUserSetLocation" on onSubmit
- should hide modal on close modal button press
- should highlight geolocation button if geolocation is enabled
- should hide Géolocalisation désactivée if geolocation is enabled
- should request geolocation if geolocation is denied and the geolocation button pressed
- should show geolocation modal if geolocation is never_ask_again on closing the modal after a geolocation button press

