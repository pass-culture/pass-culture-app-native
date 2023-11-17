import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { LocationType } from 'features/search/enums'
import { SearchState, SearchView } from 'features/search/types'
import { VenueCTA } from 'features/venue/components/VenueCTA/VenueCTA'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import * as useVenueOffersSearchNavigateTo from 'features/venue/helpers/useVenueOffersSearchNavigateTo'
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
  offerTypes: { isDigital: false, isEvent: false, isThing: false },
  priceRange: [0, 300],
  query: '',
  view: SearchView.Landing,
  tags: [],
  timeRange: null,
  locationFilter: {
    locationType: LocationType.VENUE,
    venue: {
      geolocation: { latitude: 48.87004, longitude: 2.3785 },
      info: 'Paris',
      label: 'Le Petit Rintintin 1',
      venueId: 5543,
    },
  },
} as SearchState

jest.spyOn(useVenueOffersSearchNavigateTo, 'useVenueOffersSearchNavigateTo').mockReturnValue({
  screen: 'TabNavigator',
  params: {
    screen: 'Search',
    params: {
      ...defaultParams,
      previousView: SearchView.Results,
      view: SearchView.Results,
    },
  },
  withPush: true,
})

describe('<VenueCTA />', () => {
  it('should navigate to the search page when pressed on', async () => {
    render(<VenueCTA venueId={venueResponseSnap.id} />)

    fireEvent.press(screen.getByText('Rechercher une offre'))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('TabNavigator', {
        params: {
          ...defaultParams,
          locationFilter: {
            locationType: LocationType.VENUE,
            venue: {
              geolocation: { latitude: 48.87004, longitude: 2.3785 },
              info: 'Paris',
              label: 'Le Petit Rintintin 1',
              venueId: 5543,
            },
          },
          view: SearchView.Results,
          previousView: SearchView.Results,
        },
        screen: 'Search',
      })
    })
  })
})
