import mockdate from 'mockdate'
import React from 'react'

import {
  OfferResponseV2,
  OffersStocksResponseV2,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { MoviesScreeningCalendar } from 'features/offer/components/MoviesScreeningCalendar/MoviesScreeningCalendar'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { offersStocksResponseSnap } from 'features/offer/fixtures/offersStocksResponse'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { screen, render, act } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')
jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)
jest.mock('libs/firebase/analytics/analytics')

const MOCK_TIMESTAMP = '2024-05-08T12:50:00Z'
const MOCK_DATE = new Date(MOCK_TIMESTAMP)
const MOCK_NAME = 'Sailor et Lula'
const ID = 2051
const PRICE = 7

const VenueOffersResponseMatchingFixture = [
  {
    _geoloc: { lat: 47.8898, lng: -2.83593 },
    objectID: ID.toString(),
    offer: {
      dates: [MOCK_DATE.getTime(), MOCK_DATE.getTime()],
      isDigital: false,
      isDuo: true,
      name: MOCK_NAME,
      prices: [PRICE, PRICE],
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
    mockdate.set(MOCK_DATE)
    mockServer.postApi<OffersStocksResponseV2>(`/v2/offers/stocks`, mockedOfferStockResponse)
    mockServer.getApi<OfferResponseV2>(`/v2/offer/${ID}`, {
      ...offerResponseSnap,
      id: ID,
      name: MOCK_NAME,
      stocks: [
        {
          id: 118929,
          beginningDatetime: MOCK_TIMESTAMP,
          price: PRICE,
          isBookable: true,
          isExpired: false,
          isForbiddenToUnderage: false,
          isSoldOut: false,
          features: [],
        },
        {
          id: 118928,
          beginningDatetime: MOCK_TIMESTAMP,
          price: PRICE,
          isBookable: true,
          isExpired: false,
          isForbiddenToUnderage: false,
          isSoldOut: false,
          features: [],
        },
      ],
    })
    mockServer.getApi<SubcategoriesResponseModelv2>(`/v1/subcategories/v2`, subcategoriesDataTest)
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

    await screen.findAllByText('Mercredi')
    await screen.findByText('8')
    await screen.findAllByText('Mai')
    await act(async () => {})

    expect(screen).toMatchSnapshot()
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
