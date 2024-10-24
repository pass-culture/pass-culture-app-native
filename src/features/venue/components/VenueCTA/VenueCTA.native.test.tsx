import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { SearchState } from 'features/search/types'
import { VenueCTA } from 'features/venue/components/VenueCTA/VenueCTA'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import * as useNavigateToSearchWithVenueOffers from 'features/venue/helpers/useNavigateToSearchWithVenueOffers'
import { analytics } from 'libs/analytics'
import { LocationMode } from 'libs/location/types'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const defaultParams: SearchState = {
  beginningDatetime: undefined,
  date: null,
  endingDatetime: undefined,
  hitsPerPage: 30,
  offerCategories: [],
  offerSubcategories: [],
  offerIsDuo: false,
  offerIsFree: false,
  isDigital: false,
  priceRange: [0, 300],
  query: '',
  tags: [],
  timeRange: null,
  locationFilter: {
    locationType: LocationMode.EVERYWHERE,
  },
  venue: {
    geolocation: { latitude: 48.87004, longitude: 2.3785 },
    info: 'Paris',
    label: 'Le Petit Rintintin 1',
    venueId: 5543,
  },
} as SearchState

jest
  .spyOn(useNavigateToSearchWithVenueOffers, 'useNavigateToSearchWithVenueOffers')
  .mockReturnValue({
    screen: 'TabNavigator',
    params: {
      screen: 'SearchStackNavigator',
      params: {
        screen: 'SearchResults',
        params: defaultParams,
      },
    },
    withPush: true,
  })

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('<VenueCTA />', () => {
  it('should navigate to the search page when pressed on', async () => {
    render(<VenueCTA venue={venueDataTest} />)

    fireEvent.press(screen.getByText('Rechercher une offre'))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('TabNavigator', {
        params: {
          params: {
            ...defaultParams,
            venue: {
              geolocation: { latitude: 48.87004, longitude: 2.3785 },
              info: 'Paris',
              label: 'Le Petit Rintintin 1',
              venueId: 5543,
            },
          },
          screen: 'SearchResults',
        },
        screen: 'SearchStackNavigator',
      })
    })
  })

  it('should log event when pressed on', async () => {
    render(<VenueCTA venue={venueDataTest} />)

    fireEvent.press(screen.getByText('Rechercher une offre'))

    expect(analytics.logVenueSeeAllOffersClicked).toHaveBeenCalledWith(venueDataTest.id)
  })
})
