import { addressFromCoordsQueryOptions } from 'libs/location/queries/addressFromCoordsQueryOptions'
import { LocationMode } from 'libs/location/types'
import { locationActions } from 'libs/locationV2/location.store'
import { queryClient } from 'libs/react-query/queryClient'

export const setAroundPlaceFromCoords = async (coords: { latitude: number; longitude: number }) => {
  const address = await queryClient.fetchQuery(
    addressFromCoordsQueryOptions(coords.latitude, coords.longitude)
  )
  if (address) {
    locationActions.setConfiguration(LocationMode.AROUND_PLACE, {
      geolocation: coords,
      label: address.label,
      type: address.type,
      info: '',
    })
    locationActions.setLocationMode(LocationMode.AROUND_PLACE)
  } else {
    locationActions.setLocationMode(LocationMode.EVERYWHERE)
  }
}
