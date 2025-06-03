VenueMapLocationModal
 PlaceRadius
- should display default radius if it wasn't set previously
- should display default radius even if an AroundMeRadius was set previously


 AroundMeRadius
- should display default radius if it wasn't set previously
- should display default radius even if a PlaceRadius was set previously


 VenueMapLocationModal
- should render correctly if modal visible
- should trigger logEvent "logUserSetLocation" on onSubmit
- should hide modal on close modal button press
- should highlight geolocation button if geolocation is enabled
- should hide "Géolocalisation désactivée" if geolocation is enabled
- should navigate to venue map on submit when we choose a location and shouldOpenMapInTab is not true
- should trigger ConsultVenueMap log on submit when we choose a location, shouldOpenMapInTab is not true and openedFrom defined
- should reset selected venue in store on submit when we choose a location
- should not navigate to venue map on submit when we choose a location and shouldOpenMapInTab is true
- should set temp location mode when submit if setTempLocationMode defined
- should request geolocation if geolocation is denied and the geolocation button pressed
- should show geolocation modal if geolocation is never_ask_again on closing the modal after a geolocation button press

