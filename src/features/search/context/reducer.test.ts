import mockdate from 'mockdate'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { Action, initialSearchState, searchReducer } from 'features/search/context/reducer'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'

const Today = new Date(2020, 10, 1)

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

describe('Search reducer', () => {
  beforeAll(() => {
    mockdate.set(Today)
  })

  const state = initialSearchState

  it('should handle SET_STATE', () => {
    const parameters = {
      geolocation: { latitude: 48.8557, longitude: 2.3469 },
      offerCategories: [
        SearchGroupNameEnumv2.CINEMA,
        SearchGroupNameEnumv2.MUSIQUE,
        SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
        SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
      ],
      tags: [],
    }
    const action: Action = { type: 'SET_STATE', payload: { ...initialSearchState, ...parameters } }

    expect(searchReducer(state, action)).toStrictEqual({
      ...initialSearchState,
      ...parameters,
    })
  })

  it('should handle SET_LOCATION_AROUND_ME', () => {
    const newState = searchReducer(state, { type: 'SET_LOCATION_AROUND_ME' })

    expect(newState.locationFilter.locationType).toEqual(LocationMode.AROUND_ME)
  })

  it('should handle SET_LOCATION_EVERYWHERE', () => {
    const newState = searchReducer(
      {
        ...state,
        locationFilter: {
          aroundRadius: 20,
          locationType: LocationMode.AROUND_PLACE,
          place: Kourou,
        },
      },
      { type: 'SET_LOCATION_EVERYWHERE' }
    )

    expect(newState.locationFilter.locationType).toEqual(LocationMode.EVERYWHERE)
  })

  it('should handle SET_LOCATION_PLACE', () => {
    const newState = searchReducer(state, {
      type: 'SET_LOCATION_PLACE',
      payload: { place: Kourou },
    })

    expect(newState.locationFilter).toStrictEqual({
      locationType: LocationMode.AROUND_PLACE,
      place: Kourou,
      aroundRadius: 100,
    })
  })
})
