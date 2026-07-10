import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/context/reducer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { SuggestedPlace } from 'libs/place/types'
import { render, screen, userEvent } from 'tests/utils'

import { CategoriesList } from './CategoriesList'
jest.mock('queries/subcategories/useSubcategoriesQuery')

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

const mockedPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

const setupLocation = ({
  hasGeolocPosition,
  selectedLocationMode,
  place,
}: {
  hasGeolocPosition: boolean
  selectedLocationMode: LocationMode
  place?: SuggestedPlace
}) => {
  useLocationV2.setState(defaultLocationState)
  locationActions.setLocationMode(selectedLocationMode)
  locationActions.setGeolocPosition(hasGeolocPosition ? { latitude: 1, longitude: 1 } : null)
  if (place) {
    locationActions.setPlace(place)
  }
}

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()

jest.useFakeTimers()

describe('CategoriesList', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
  })

  it('should display categories', async () => {
    render(<CategoriesList />)

    expect(await screen.findByText('Cinéma'.toUpperCase())).toBeOnTheScreen()
  })

  it('should dispatch with offerCategory before navigation', async () => {
    render(<CategoriesList />)

    await user.press(screen.getByText('Spectacles'.toUpperCase()))

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: { ...initialSearchState, offerCategories: ['SPECTACLES'], searchId: 'testUuidV4' },
    })
  })

  it('should navigate to search results with search params on press', async () => {
    render(<CategoriesList />)

    await user.press(screen.getByText('Spectacles'.toUpperCase()))

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: {
        params: {
          searchId: 'testUuidV4',
          isFullyDigitalOffersCategory: false,
          offerCategories: ['SPECTACLES'],
        },
        screen: 'SearchResults',
      },
      screen: 'SearchStackNavigator',
    })
  })

  it.each`
    hasGeolocPosition | selectedLocationMode      | place          | FF
    ${true}           | ${LocationMode.AROUND_ME} | ${mockedPlace} | ${[]}
    ${false}          | ${LocationMode.AROUND_ME} | ${mockedPlace} | ${[RemoteStoreFeatureFlags.WIP_VENUE_MAP]}
  `(
    'should not display venue map block',
    async ({ hasGeolocPosition, selectedLocationMode, place, FF }) => {
      setFeatureFlags(FF)
      setupLocation({ hasGeolocPosition, selectedLocationMode, place })
      render(<CategoriesList />)

      expect(screen.queryByText('Explore la carte')).not.toBeOnTheScreen()
    }
  )

  it.each`
    hasGeolocPosition | selectedLocationMode         | place
    ${true}           | ${LocationMode.AROUND_ME}    | ${undefined}
    ${false}          | ${LocationMode.AROUND_PLACE} | ${mockedPlace}
    ${true}           | ${LocationMode.AROUND_PLACE} | ${mockedPlace}
    ${true}           | ${LocationMode.EVERYWHERE}   | ${undefined}
    ${false}          | ${LocationMode.EVERYWHERE}   | ${undefined}
  `(
    'should display venue map block',
    async ({ hasGeolocPosition, selectedLocationMode, place }) => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
      setupLocation({ hasGeolocPosition, selectedLocationMode, place })

      render(<CategoriesList />)

      expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
    }
  )

  it('should navigate to venue map location modal when pressing on venue map block', async () => {
    setupLocation({
      hasGeolocPosition: false,
      selectedLocationMode: LocationMode.EVERYWHERE,
      place: mockedPlace,
    })

    render(<CategoriesList />)

    await user.press(screen.getByText('Explore la carte'))

    expect(navigate).toHaveBeenCalledWith('VenueMapLocationModal', { openedFrom: 'searchLanding' })
  })
})
