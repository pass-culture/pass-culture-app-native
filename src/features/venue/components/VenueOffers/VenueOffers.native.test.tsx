import mockdate from 'mockdate'
import React from 'react'
import { UseQueryResult } from 'react-query'

import { push } from '__mocks__/@react-navigation/native'
import { SearchView } from 'features/search/types'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueOffers } from 'features/venue/components/VenueOffers/VenueOffers'
import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/firebase/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import { fireEvent, render } from 'tests/utils'

const venueId = venueResponseSnap.id

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('react-query')

jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')
const mockUseVenueOffers = jest.mocked(useVenueOffers)

const mockSubcategories = placeholderData.subcategories
const mockHomepageLabels = placeholderData.homepageLabels
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      homepageLabels: mockHomepageLabels,
    },
  }),
}))

const defaultParams = {
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
    } as UseQueryResult<{ hits: Offer[]; nbHits: number }, unknown>)

    const { queryByText } = render(<VenueOffers venueId={venueId} />)
    expect(queryByText('En voir plus')).toBeNull()
  })

  it(`should set search state when clicking "En voir plus" button`, async () => {
    const { getByText } = render(<VenueOffers venueId={venueId} />)
    await fireEvent.press(getByText('En voir plus'))
    expect(push).toBeCalledWith('TabNavigator', {
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
        view: SearchView.Results,
      },
      screen: 'Search',
    })
  })

  it(`should log analytics event VenueSeeMoreClicked when clicking "En voir plus" button`, () => {
    const { getByText } = render(<VenueOffers venueId={venueId} />)
    fireEvent.press(getByText('En voir plus'))
    expect(analytics.logVenueSeeMoreClicked).toHaveBeenNthCalledWith(1, venueId)
  })

  it(`should log analytics event VenueSeeAllOffersClicked when clicking "Voir toutes les offres" button`, async () => {
    const { getByText } = render(<VenueOffers venueId={venueId} />)
    fireEvent.press(getByText('Voir toutes les offres'))
    expect(analytics.logVenueSeeAllOffersClicked).toHaveBeenNthCalledWith(1, venueId)
  })
})
