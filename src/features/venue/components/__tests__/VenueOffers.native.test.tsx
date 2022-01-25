import mockdate from 'mockdate'
import React from 'react'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { SearchHit } from 'libs/search'
import { fireEvent, render } from 'tests/utils'

import { VenueOffers } from '../VenueOffers'

const venueId = venueResponseSnap.id

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('react-query')
jest.mock('features/auth/settings')
jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')
const mockUseVenueOffers = mocked(useVenueOffers)

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
const mockStagedDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
  useStagedSearch: () => ({ searchState: mockSearchState, dispatch: mockStagedDispatch }),
}))

const defaultParams = {
  beginningDatetime: null,
  date: null,
  endingDatetime: null,
  hitsPerPage: 10,
  offerCategories: [],
  offerSubcategories: [],
  offerIsDuo: false,
  offerIsFree: false,
  offerIsNew: false,
  offerTypes: { isDigital: false, isEvent: false, isThing: false },
  priceRange: [0, 300],
  query: '',
  showResults: false,
  tags: [],
  timeRange: null,
}

describe('<VenueOffers />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<VenueOffers venueId={venueId} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display "En voir plus" button if nbHits is more than hits.length', () => {
    const { queryByText } = render(<VenueOffers venueId={venueId} />)
    expect(queryByText('En voir plus')).toBeTruthy()
  })

  it(`should not display "En voir plus" button if nbHits is same as hits.length`, () => {
    mockUseVenueOffers.mockReturnValueOnce({
      data: { hits: VenueOffersResponseSnap, nbHits: VenueOffersResponseSnap.length },
    } as UseQueryResult<{ hits: SearchHit[]; nbHits: number }, unknown>)

    const { queryByText } = render(<VenueOffers venueId={venueId} />)
    expect(queryByText('En voir plus')).toBeFalsy()
  })

  it(`should set search state when clicking "En voir plus" button`, () => {
    const { getByText } = render(<VenueOffers venueId={venueId} />)
    fireEvent.press(getByText('En voir plus'))
    expect(navigate).toBeCalledWith('TabNavigator', {
      params: {
        ...defaultParams,
        locationFilter: {
          locationType: 'VENUE',
          venue: {
            geolocation: { latitude: 48.87004, longitude: 2.3785 },
            info: 'Paris',
            label: 'Le Petit Rintintin 1',
            venueId: 5543,
          },
        },
      },
      screen: 'Search',
    })
  })

  it(`should log analytics event VenueSeeMoreClicked when clicking "En voir plus" button`, () => {
    const { getByText } = render(<VenueOffers venueId={venueId} />)
    fireEvent.press(getByText('En voir plus'))
    expect(analytics.logVenueSeeMoreClicked).toHaveBeenNthCalledWith(1, venueId)
  })

  it(`should log analytics event VenueSeeAllOffersClicked when clicking "Voir toutes les offres" button`, () => {
    const { getByText } = render(<VenueOffers venueId={venueId} />)
    fireEvent.press(getByText('Voir toutes les offres'))
    expect(analytics.logVenueSeeAllOffersClicked).toHaveBeenNthCalledWith(1, venueId)
  })
})
