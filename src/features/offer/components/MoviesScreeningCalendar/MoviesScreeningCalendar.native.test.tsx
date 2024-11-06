import mockdate from 'mockdate'
import React, { createRef } from 'react'
import { ScrollView } from 'react-native'

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
import { act, render, screen } from 'tests/utils'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'

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

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

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

    await act(async () => {})

    expect((await screen.findAllByText('Mer.'))[0]).toBeOnTheScreen()
    expect(screen.getByText('8')).toBeOnTheScreen()
    expect(screen.getAllByText('Mai')[0]).toBeOnTheScreen()
  })

  it('should render MoviesScreeningCalendar correctly on desktop', async () => {
    renderMoviesScreeningCalendar({ isDesktopViewport: true, venueOffers: venueOffersMock })

    await act(async () => {})

    expect((await screen.findAllByText('Mercredi'))[0]).toBeOnTheScreen()
    expect(screen.getByText('8')).toBeOnTheScreen()
    expect(screen.getAllByText('Mai')[0]).toBeOnTheScreen()
  })
})

const renderMoviesScreeningCalendar = ({
  isDesktopViewport = false,
  venueOffers,
}: {
  isDesktopViewport?: boolean
  venueOffers: VenueOffers
}) => {
  render(
    reactQueryProviderHOC(
      <AnchorProvider scrollViewRef={createRef<ScrollView>()} handleCheckScrollY={() => 0}>
        <MoviesScreeningCalendar venueOffers={venueOffers} />
      </AnchorProvider>
    ),
    {
      theme: { isDesktopViewport },
    }
  )
}
