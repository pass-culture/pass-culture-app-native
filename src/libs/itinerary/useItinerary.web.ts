// eslint-disable-next-line no-restricted-imports
import { isIOS as isWebOnIOS } from 'react-device-detect'

import { Coordinates } from 'api/gen'
import { openUrl } from 'features/navigation/helpers'

export const useItinerary = () => {
  // To accomodate the API of useOpenItinerary, we have to pass
  // availableApps as a non-empty array.
  // Indeed, in web, we know for sure we always have the option
  // to open the web version of Google maps.
  return { availableApps: ['google_maps'], navigateTo }
}

function navigateTo(coordinates: Required<Coordinates>) {
  const { latitude: lat, longitude: lon } = coordinates
  const googleMapsPath = `maps.google.com/maps?daddr=${lat},${lon}`
  if (isWebOnIOS) {
    /* on iOS, the device will try to open the link first in Apple Maps, then in Google Maps */
    openUrl('maps://' + googleMapsPath)
  } else {
    openUrl('https://' + googleMapsPath)
  }
}
