getLocationSubmit
 When on onSubmit with location mode is AROUND_PLACE
- should call setSelectedLocationMode with AROUND_PLACE
- should call setPlaceGlobally with the selected place
- should call setTempAroundMeRadius with the default radius
- should call dispatch with SET_LOCATION_PLACE with the selected place when dispatch defined
- should not call dispatch with SET_LOCATION_PLACE with the selected place when dispatch not defined
- should call logUserSetLocation


 When on onSubmit with location mode is AROUND_ME
- should call setPlaceGlobally with null
- should call setAroundMeRadius with the selected radius
- should call setTempAroundPlaceRadius with the default radius
- should call dispatch with SET_LOCATION_AROUND_ME with the selected radius when dispatch defined
- should not call dispatch with SET_LOCATION_AROUND_ME with the selected radius when dispatch not defined


 When on onSubmit with location mode is EVERYWHERE
- should call setPlaceGlobally with null
- should call dispatch with SET_LOCATION_EVERYWHERE  when dispatch defined
- should not call dispatch with SET_LOCATION_EVERYWHERE  when dispatch not defined


 getLocationSubmit
- should call dismissModal on onClose

