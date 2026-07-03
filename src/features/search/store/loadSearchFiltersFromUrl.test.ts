import { Linking } from 'react-native'

import { initialSearchState } from 'features/search/context/reducer'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { LocationMode } from 'libs/location/types'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'
import { SuggestedPlace } from 'libs/place/types'

import { loadSearchFiltersFromUrl } from './loadSearchFiltersFromUrl'

const mockGetInitialURL = jest.spyOn(Linking, 'getInitialURL')

// The expect should be on searchStore after SearchWrapper is deleted

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

describe('loadSearchFiltersFromUrl', () => {
  const dispatch = jest.fn()

  beforeEach(() => {
    dispatch.mockClear()
    locationActions.setLocationMode(LocationMode.EVERYWHERE)
  })

  it('should do nothing when initial URL is not SearchResults', async () => {
    mockGetInitialURL.mockResolvedValueOnce(`${WEBAPP_V2_URL}/offre/777`)

    await loadSearchFiltersFromUrl(dispatch)

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('should dispatch search state from SearchResults URL', async () => {
    mockGetInitialURL.mockResolvedValueOnce(
      `${WEBAPP_V2_URL}/recherche/resultats?query=%22cinema%22&offerIsDuo=true`
    )

    await loadSearchFiltersFromUrl(dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: { ...initialSearchState, query: 'cinema', offerIsDuo: true },
    })
  })

  it('should update location store for around place filter', async () => {
    const locationFilter = {
      locationType: LocationMode.AROUND_PLACE,
      place: Kourou,
      aroundRadius: 50,
    }

    mockGetInitialURL.mockResolvedValueOnce(
      `${WEBAPP_V2_URL}/recherche/resultats?locationFilter=${encodeURIComponent(JSON.stringify(locationFilter))}`
    )

    await loadSearchFiltersFromUrl(dispatch)

    expect(locationSelectors.selectLocationMode()).toBe(LocationMode.AROUND_PLACE)
    expect(locationSelectors.selectPlace()).toMatchObject(Kourou)
    expect(locationSelectors.selectLocationConfiguration(LocationMode.AROUND_PLACE).radius).toBe(50)
  })

  it('should not update location store for around me filter', async () => {
    const locationFilter = { locationType: LocationMode.AROUND_ME }

    mockGetInitialURL.mockResolvedValueOnce(
      `${WEBAPP_V2_URL}/recherche/resultats?locationFilter=${encodeURIComponent(JSON.stringify(locationFilter))}`
    )

    await loadSearchFiltersFromUrl(dispatch)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: { ...initialSearchState, locationFilter },
    })
    expect(locationSelectors.selectLocationMode()).toBe(LocationMode.EVERYWHERE)
  })
})
