import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { SearchState } from 'features/search/types'
import { VenueCTA } from 'features/venue/components/VenueCTA/VenueCTA'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { SearchNavConfig } from 'features/venue/types'
import { analytics } from 'libs/analytics/provider'
import { LocationMode } from 'libs/location/types'
import { render, screen, userEvent, waitFor } from 'tests/utils'

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

const searchNavConfigMock: SearchNavConfig = {
  screen: 'TabNavigator',
  params: {
    screen: 'SearchStackNavigator',
    params: {
      screen: 'SearchResults',
      params: defaultParams,
    },
  },
  withPush: true,
}

jest.mock('libs/firebase/analytics/analytics')

jest.useFakeTimers()
const user = userEvent.setup()

describe('<VenueCTA />', () => {
  it('should navigate to the search page when pressed on', async () => {
    render(<VenueCTA searchNavConfig={searchNavConfigMock} onBeforeNavigate={jest.fn()} />)

    await user.press(await screen.findByText('Rechercher une offre'))

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
    render(
      <VenueCTA
        searchNavConfig={searchNavConfigMock}
        onBeforeNavigate={() => analytics.logVenueSeeAllOffersClicked(venueDataTest.id)}
      />
    )

    await user.press(await screen.findByText('Rechercher une offre'))

    expect(analytics.logVenueSeeAllOffersClicked).toHaveBeenCalledWith(venueDataTest.id)
  })
})
