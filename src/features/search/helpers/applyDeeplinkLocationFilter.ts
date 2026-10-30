import { LocationFilter } from 'features/search/types'
import { LocationMode } from 'libs/location/types'
import { locationStore } from 'libs/locationV2/location.store'
import { showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

export const LOCATION_CHANGED_BY_DEEPLINK_MESSAGE =
  'Tes paramètres de localisation ont été changés pour afficher les résultats de cette recherche.'

/*
  The location modal reads the location store. EVERYWHERE and AROUND_PLACE from the URL
  are written there. AROUND_ME is not: that mode comes from the geolocation flow.
*/
export const applyDeeplinkLocationFilter = (locationFilter: LocationFilter) => {
  if (locationFilter.locationType === LocationMode.AROUND_ME) return

  const hasLocationChanged = isLocationDifferentFromStore(locationFilter)

  locationStore.actions.setLocationMode(locationFilter.locationType)
  if (locationFilter.locationType === LocationMode.AROUND_PLACE) {
    locationStore.actions.setPlace(locationFilter.place)
    locationStore.actions.setAroundPlaceRadius(locationFilter.aroundRadius)
  }

  if (hasLocationChanged) showSuccessSnackBar(LOCATION_CHANGED_BY_DEEPLINK_MESSAGE)
}

const isLocationDifferentFromStore = (locationFilter: LocationFilter) => {
  const { locationMode, configuration } = locationStore.selectors.selectState()
  if (locationMode !== locationFilter.locationType) return true

  if (locationFilter.locationType === LocationMode.AROUND_PLACE) {
    const { label, radius } = configuration[LocationMode.AROUND_PLACE]
    return label !== locationFilter.place.label || radius !== locationFilter.aroundRadius
  }

  return false
}
