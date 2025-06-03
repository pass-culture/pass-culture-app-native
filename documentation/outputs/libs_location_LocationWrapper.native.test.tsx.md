LocationWrapper
 requestGeolocPermission()
- should call onSubmit() and onAcceptance() when requestGeolocPermission() returns GRANTED
- should call onSubmit() and onRefusal() when requestGeolocPermission() returns DENIED
- should call onSubmit() and onRefusal() when requestGeolocPermission() returns NEVER_ASK_AGAIN
- should call onSubmit() and onAcceptance() when requestGeolocPermission() returns NEED_ASK_POSITION_DIRECTLY and position is not null
- should call onSubmit() and onRefusal() when requestGeolocPermission() returns NEED_ASK_POSITION_DIRECTLY and position is null


 location_type
- should write UserGeolocation in location_type async storage when geolocation is turned on
- should clear location_type async storage when neither place nor geolocPosition are set


 useLocation()

