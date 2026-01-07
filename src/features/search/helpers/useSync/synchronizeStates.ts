import { isEqual } from 'lodash'

import { SearchState } from 'features/search/types'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'

export const hasUrlParams = (pendingParams: Record<string, unknown>, searchState: SearchState) =>
  !!Object.keys(pendingParams).length &&
  Object.keys(pendingParams).every((key) => {
    const urlValue = pendingParams[key]
    const stateValue = searchState[key as keyof SearchState]

    return urlValue == null || (Array.isArray(urlValue) && urlValue.length === 0)
      ? true
      : isEqual(stateValue, urlValue)
  })

export const syncLocationFromParams = (
  locationFilter: SearchState['locationFilter'],
  handlers: {
    setPlace: (place: SuggestedPlace | null) => void
    setSelectedPlace: (place: SuggestedPlace | null) => void
    setSelectedLocationMode: (mode: LocationMode) => void
    setCanSwitchToAroundMe: (value: boolean) => void
  }
) => {
  switch (locationFilter.locationType) {
    case LocationMode.AROUND_PLACE:
      handlers.setPlace(locationFilter.place)
      handlers.setSelectedPlace(locationFilter.place)
      handlers.setSelectedLocationMode(LocationMode.AROUND_PLACE)
      break
    case LocationMode.EVERYWHERE:
      handlers.setSelectedLocationMode(LocationMode.EVERYWHERE)
      break
    case LocationMode.AROUND_ME:
      // Flag to trigger AROUND_ME once geoloc is available
      handlers.setCanSwitchToAroundMe(true)
      break
  }
}
