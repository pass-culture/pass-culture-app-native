import { LocationMode } from 'libs/location/types'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'
import { queryClient } from 'libs/react-query/queryClient'
import { mockServer } from 'tests/mswServer'

import { setAroundPlaceFromCoords } from './setAroundPlaceFromCoords'

const REVERSE_GEOCODE_URL = 'https://data.geopf.fr/geocodage/reverse'
const coords = { latitude: 48.85, longitude: 2.35 }

const mockReverseGeocodeResponse = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [coords.longitude, coords.latitude] as [number, number],
      },
      properties: {
        type: 'locality' as const,
        label: 'Paris',
      },
    },
  ],
}

const mockEmptyReverseGeocodeResponse = {
  type: 'FeatureCollection' as const,
  features: [],
}

describe('setAroundPlaceFromCoords', () => {
  beforeEach(() => {
    queryClient.clear()
    locationActions.setLocationMode(LocationMode.EVERYWHERE)
    locationActions.setConfiguration(LocationMode.AROUND_PLACE, {
      label: '',
      info: '',
      type: 'locality',
      geolocation: null,
    })
  })

  it('should set around place configuration when address is found', async () => {
    mockServer.universalGet(REVERSE_GEOCODE_URL, mockReverseGeocodeResponse)

    await setAroundPlaceFromCoords(coords)

    expect(locationSelectors.selectLocationMode()).toBe(LocationMode.AROUND_PLACE)
    expect(locationSelectors.selectLocationConfiguration(LocationMode.AROUND_PLACE)).toEqual(
      expect.objectContaining({
        geolocation: coords,
        label: 'Paris',
        type: 'locality',
        info: '',
      })
    )
  })

  it('should do nothing when address is not found', async () => {
    mockServer.universalGet(REVERSE_GEOCODE_URL, mockEmptyReverseGeocodeResponse)

    await setAroundPlaceFromCoords(coords)

    expect(locationSelectors.selectLocationMode()).toBe(LocationMode.EVERYWHERE)
    expect(
      locationSelectors.selectLocationConfiguration(LocationMode.AROUND_PLACE).geolocation
    ).toBeNull()
  })
})
