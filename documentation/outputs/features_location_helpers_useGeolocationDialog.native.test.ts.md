useGeolocationDialog
 When shouldOpenDirectlySettings is false
- should call dismiss modal function
- should open geoloc permission modal when current modal closed


 When permission is NEVER_ASK_AGAIN
- should reset place selection
- should select everywhere mode
- should open settings when shouldOpenDirectlySettings is true
- should not call dismiss modal function when shouldDirectlyValidate is true


 useGeolocationDialogs
- should reset place selection when permission state is GRANTED and shouldDirectlyValidate is true
- should select around me mode when permission state is GRANTED and shouldDirectlyValidate is true
- should call requestGeolocPermission when permission is DENIED

