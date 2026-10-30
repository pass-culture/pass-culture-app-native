import { Linking } from 'react-native'

import { LOCATION_CHANGED_BY_DEEPLINK_MESSAGE } from 'features/search/helpers/applyDeeplinkLocationFilter'
import {
  applyLocationFromSearchDeeplink,
  subscribeToSearchDeeplinkLocation,
} from 'features/search/helpers/subscribeToSearchDeeplinkLocation'
import { LocationMode } from 'libs/location/types'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'
import * as snackBarStoreModule from 'ui/designSystem/Snackbar/snackBar.store'

const mockShowSuccessSnackBar = jest.spyOn(snackBarStoreModule, 'showSuccessSnackBar')

const searchResultsUrl = (locationFilter: { locationType: LocationMode }) =>
  `passculture:///recherche/resultats?locationFilter=${encodeURIComponent(JSON.stringify(locationFilter))}`

describe('subscribeToSearchDeeplinkLocation', () => {
  beforeEach(() => {
    mockShowSuccessSnackBar.mockClear()
    locationActions.setLocationMode(LocationMode.EVERYWHERE)
    locationActions.setPlace(null)
  })

  it('should switch the location when a search deeplink is received while the app is open', async () => {
    locationActions.setLocationMode(LocationMode.AROUND_ME)

    await applyLocationFromSearchDeeplink(
      searchResultsUrl({ locationType: LocationMode.EVERYWHERE })
    )

    expect(locationSelectors.selectLocationMode()).toBe(LocationMode.EVERYWHERE)
    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith(LOCATION_CHANGED_BY_DEEPLINK_MESSAGE)
  })

  it('should ignore a url that does not open search results', async () => {
    locationActions.setLocationMode(LocationMode.AROUND_ME)

    await applyLocationFromSearchDeeplink('passculture:///offre/777')

    expect(locationSelectors.selectLocationMode()).toBe(LocationMode.AROUND_ME)
    expect(mockShowSuccessSnackBar).not.toHaveBeenCalled()
  })

  it('should apply the location from the linking listener and unsubscribe', async () => {
    locationActions.setLocationMode(LocationMode.AROUND_ME)
    const listeners: Array<(event: { url: string }) => void> = []
    const remove = jest.fn()
    const addEventListenerSpy = jest
      .spyOn(Linking, 'addEventListener')
      .mockImplementation((_type, listener) => {
        listeners.push(listener as (event: { url: string }) => void)
        return { remove } as unknown as ReturnType<typeof Linking.addEventListener>
      })

    try {
      const unsubscribe = subscribeToSearchDeeplinkLocation()

      listeners[0]?.({
        url: searchResultsUrl({ locationType: LocationMode.EVERYWHERE }),
      })
      await Promise.resolve()
      await Promise.resolve()

      expect(listeners).toHaveLength(1)
      expect(locationSelectors.selectLocationMode()).toBe(LocationMode.EVERYWHERE)
      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith(LOCATION_CHANGED_BY_DEEPLINK_MESSAGE)

      unsubscribe()

      expect(remove).toHaveBeenCalledTimes(1)
    } finally {
      addEventListenerSpy.mockRestore()
    }
  })
})
