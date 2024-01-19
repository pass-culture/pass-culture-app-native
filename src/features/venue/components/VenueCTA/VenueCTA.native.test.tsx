import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { SearchState, SearchView } from 'features/search/types'
import { VenueCTA } from 'features/venue/components/VenueCTA/VenueCTA'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
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
  offerIsNew: false,
  isDigital: false,
  priceRange: [0, 300],
  query: '',
  view: SearchView.Landing,
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
      screen: 'Search',
      params: {
        ...defaultParams,
        view: SearchView.Results,
      },
    },
    withPush: true,
  })

describe('<VenueCTA />', () => {
  it('should navigate to the search page when pressed on', async () => {
    render(<VenueCTA venue={venueResponseSnap} />)

    fireEvent.press(screen.getByText('Rechercher une offre'))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('TabNavigator', {
        params: {
          ...defaultParams,
          venue: {
            geolocation: { latitude: 48.87004, longitude: 2.3785 },
            info: 'Paris',
            label: 'Le Petit Rintintin 1',
            venueId: 5543,
          },
          view: SearchView.Results,
        },
        screen: 'Search',
      })
    })
  })

  it('should log event when pressed on', async () => {
    render(<VenueCTA venue={venueResponseSnap} />)

    fireEvent.press(screen.getByText('Rechercher une offre'))

    expect(analytics.logVenueSeeAllOffersClicked).toHaveBeenCalledWith(venueResponseSnap.id)
  })
})
