import mockdate from 'mockdate'
import React from 'react'

import {
  OfferResponseV2,
  OffersStocksResponse,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { MoviesScreeningCalendar } from 'features/offer/components/MoviesScreeningCalendar/MoviesScreeningCalendar'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { offersStocksResponseSnap } from 'features/offer/fixtures/offersStocksResponse'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { screen, render, act } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategory')

const mockTimeStamp = '2024-05-08T12:50:00Z'
const mockDate = new Date(mockTimeStamp)
const mockName = 'Sailor et Lula'

const VenueOffersResponseMatchingFixture = [
  {
    _geoloc: { lat: 47.8898, lng: -2.83593 },
    objectID: '2051',
    offer: {
      dates: [mockDate.getTime(), mockDate.getTime()],
      isDigital: false,
      isDuo: true,
      name: 'Sailor et Lula',
      prices: [570, 570],
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      thumbUrl:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/AQBA',
    },
    venue: {},
  },
]

const venueOffersMock = { hits: VenueOffersResponseMatchingFixture, nbHits: 1 }
const mockedOfferStockResponse = { offers: [offersStocksResponseSnap.offers[0]] }

describe('MoviesScreeningCalendar', () => {
  beforeEach(() => {
    mockdate.set(mockDate)
    mockServer.postApi<OffersStocksResponse>(`/v1/offers/stocks`, mockedOfferStockResponse)
    mockServer.getApi<OfferResponseV2>(`/v2/offer/2051`, {
      ...offerResponseSnap,
      id: 2051,
      name: mockName,
      stocks: [
        {
          id: 118929,
          beginningDatetime: mockTimeStamp,
          price: 500,
          isBookable: true,
          isExpired: false,
          isForbiddenToUnderage: false,
          isSoldOut: false,
          features: [],
        },
        {
          id: 118928,
          beginningDatetime: mockTimeStamp,
          price: 500,
          isBookable: true,
          isExpired: false,
          isForbiddenToUnderage: false,
          isSoldOut: false,
          features: [],
        },
      ],
    })
    mockServer.getApi<SubcategoriesResponseModelv2>(`/v1/subcategories/v2`, PLACEHOLDER_DATA)
  })

  it('should render MoviesScreeningCalendar correctly on mobile', async () => {
    renderMoviesScreeningCalendar({ isDesktopViewport: false, venueOffers: venueOffersMock })

    await screen.findAllByText('Mer.')
    await screen.findByText('8')
    await screen.findAllByText('Mai')

    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  it('should render MoviesScreeningCalendar correctly on desktop', async () => {
    renderMoviesScreeningCalendar({ isDesktopViewport: true, venueOffers: venueOffersMock })

    await screen.findByLabelText('Mercredi 8 Mai')
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  it('should display a movie title if Venue has stock on date', async () => {
    renderMoviesScreeningCalendar({ isDesktopViewport: true, venueOffers: venueOffersMock })

    await screen.findByLabelText('Mercredi 8 Mai')
    await act(async () => {})

    expect(screen.getByText(mockName)).toBeOnTheScreen()
  })

  it('should not display a movie title if movie has no screening on selected date', async () => {
    mockdate.set(new Date('2024-05-09T12:50:00Z'))
    renderMoviesScreeningCalendar({ isDesktopViewport: true, venueOffers: venueOffersMock })

    await screen.findByLabelText('Jeudi 9 Mai')
    await act(async () => {})

    expect(screen.queryByText(mockName)).not.toBeOnTheScreen()
  })
})

const renderMoviesScreeningCalendar = ({
  isDesktopViewport = false,
  venueOffers,
}: {
  isDesktopViewport?: boolean
  venueOffers: VenueOffers
}) => {
  render(reactQueryProviderHOC(<MoviesScreeningCalendar venueOffers={venueOffers} />), {
    theme: { isDesktopViewport },
  })
}
