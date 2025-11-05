import React, { createRef } from 'react'
import { ScrollView } from 'react-native'

import { OffersStocksResponseV2, SubcategoriesResponseModelv2, SubcategoryIdEnum } from 'api/gen'
import * as MovieCalendarContext from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { offersStocksResponseSnap } from 'features/offer/fixtures/offersStocksResponse'
import { VenueMovies } from 'features/venue/components/VenueOffers/VenueMovies'
import { VenueOffers } from 'features/venue/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'

jest.mock('libs/firebase/analytics/analytics')

const MOCK_TIMESTAMP = '2024-05-08T12:50:00Z'
const MOCK_DATE = new Date(MOCK_TIMESTAMP)

jest.spyOn(MovieCalendarContext, 'useMovieCalendar').mockReturnValue({
  selectedDate: MOCK_DATE,
  goToDate: jest.fn(),
  displayCalendar: jest.fn(),
  dates: [],
  disableDates: jest.fn(),
  displayDates: jest.fn(),
})

const VENUE_MOVIE_OFFERS_HIT = {
  _geoloc: { lat: 47.8898, lng: -2.83593 },
  objectID: offersStocksResponseSnap.offers[0].id.toString(),
  offer: {
    dates: [MOCK_DATE.getTime(), MOCK_DATE.getTime()],
    isDigital: false,
    isDuo: true,
    name: 'Harry potter',
    prices: [7],
    subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
    thumbUrl:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/AQBA',
  },
  venue: {},
}

const VENUE_OFFERS_HIT = {
  _geoloc: { lat: 47.8898, lng: -2.83593 },
  objectID: '1234',
  offer: {
    dates: [MOCK_DATE.getTime(), MOCK_DATE.getTime()],
    isDigital: false,
    isDuo: true,
    name: 'Partition de Harry potter',
    prices: [7],
    subcategoryId: SubcategoryIdEnum.PARTITION,
    thumbUrl:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/AQBA',
  },
  venue: {},
}

const VENUE_OFFERS_MOCK = { hits: [VENUE_MOVIE_OFFERS_HIT, VENUE_OFFERS_HIT], nbHits: 2 }

jest.useFakeTimers()

describe('VenueMovies', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockServer.postApi<OffersStocksResponseV2>(`/v2/offers/stocks`, offersStocksResponseSnap)
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  afterAll(() => jest.useRealTimers())

  const venueOffers = { ...VENUE_OFFERS_MOCK, hits: [...VENUE_OFFERS_MOCK.hits] }

  it('should render movies offers', async () => {
    renderVenueMovies({ venueOffers })

    await screen.findByText('Les films à l’affiche')

    expect(await screen.findByText(VENUE_MOVIE_OFFERS_HIT.offer.name)).toBeOnTheScreen()
  })

  it('should render non movies offers', async () => {
    renderVenueMovies({ venueOffers })

    await screen.findByLabelText('Les autres offres')

    expect(await screen.findByText(VENUE_OFFERS_HIT.offer.name)).toBeOnTheScreen()
  })
})

const renderVenueMovies = ({ venueOffers }: { venueOffers: VenueOffers }) => {
  render(
    reactQueryProviderHOC(
      <OfferCTAProvider>
        <AnchorProvider scrollViewRef={createRef<ScrollView>()} handleCheckScrollY={() => 0}>
          <VenueMovies venueOffers={venueOffers} />
        </AnchorProvider>
      </OfferCTAProvider>
    )
  )
}
