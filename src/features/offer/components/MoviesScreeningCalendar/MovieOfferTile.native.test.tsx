import { addDays } from 'date-fns'
import mockdate from 'mockdate'
import React, { createRef } from 'react'
import { ScrollView } from 'react-native'

import {
  CategoryIdEnum,
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { MovieCalendarProvider } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import * as MovieCalendarContext from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { MovieOfferTile } from 'features/offer/components/MoviesScreeningCalendar/MovieOfferTile'
import { NEXT_SCREENING_WORDING } from 'features/offer/components/MoviesScreeningCalendar/NextScreeningButton'
import { MovieOffer } from 'features/offer/components/MoviesScreeningCalendar/types'
import { VenueOffers } from 'features/venue/types'
import { mockAlgoliaResponse } from 'libs/algolia/fetchAlgolia/multipleQueries/__test__/mockAlgoliaResponse'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { getDates } from 'shared/date/getDates'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('libs/firebase/analytics/analytics')
jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const MOCK_TIMESTAMP = '2024-05-08T12:50:00Z'
const MOCK_DATE = new Date(MOCK_TIMESTAMP)

const VENUE_OFFERS_HIT = {
  _geoloc: { lat: 47.8898, lng: -2.83593 },
  objectID: '1234',
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

const VENUE_OFFERS_MOCK = mockAlgoliaResponse([VENUE_OFFERS_HIT])

const MOCK_MOVIE_OFFER = {
  isUpcoming: false,
  nextDate: new Date('2025-02-07T20:30:10Z'),
  offer: mockBuilder.offerResponseV2({
    id: 1,
    stocks: [
      mockBuilder.offerStockResponse({
        beginningDatetime: MOCK_TIMESTAMP,
      }),
    ],
  }),
}

const mockSelectedDate = new Date('2024-05-02')
const mockDisplayCalendar = jest.fn()
const mockGoToDate = jest.fn()
jest.spyOn(MovieCalendarContext, 'useMovieCalendar').mockReturnValue({
  selectedDate: mockSelectedDate,
  goToDate: mockGoToDate,
  displayCalendar: mockDisplayCalendar,
  dates: [],
  disableDates: jest.fn(),
  displayDates: jest.fn(),
})

const mockUseSubcategoriesMapping = jest.fn()
mockUseSubcategoriesMapping.mockReturnValue({
  [SubcategoryIdEnum.SEANCE_CINE]: {
    isEvent: false,
    categoryId: CategoryIdEnum.CINEMA,
    nativeCategoryId: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
  },
})
jest.mock('libs/subcategories/mappings', () => ({
  useSubcategoriesMapping: () => mockUseSubcategoriesMapping(),
}))

const mockUseSearchGroupLabel = jest.fn()
mockUseSearchGroupLabel.mockReturnValue(SearchGroupNameEnumv2.CINEMA)
jest.mock('libs/subcategories/useSearchGroupLabel', () => ({
  useSearchGroupLabel: () => mockUseSearchGroupLabel(),
}))

const mockOnPressOfferCTA = jest.fn()
const mockUseOfferCTAButton = jest.fn()
mockUseOfferCTAButton.mockReturnValue({
  ctaWordingAndAction: {
    onPress: jest.fn(),
    bottomBannerText: 'CTA',
    externalNav: {
      url: '',
    },
    isDisabled: false,
    wording: 'CTA',
    navigateTo: {
      screen: 'Offer',
    },
  },
  showOfferModal: jest.fn(),
  openModalOnNavigation: false,
  onPress: mockOnPressOfferCTA,
  CTAOfferModal: null,
  movieScreeningUserData: {},
})
jest.mock('features/offer/components/OfferCTAButton/useOfferCTAButton', () => ({
  useOfferCTAButton: () => mockUseOfferCTAButton(),
}))

jest.useFakeTimers()
const user = userEvent.setup()

describe('MovieOfferTile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setFeatureFlags()
  })

  describe('with screening on selected date', () => {
    const ID = '4321'
    const movieOffer = { ...MOCK_MOVIE_OFFER, offer: { ...MOCK_MOVIE_OFFER.offer, id: +ID } }
    const venueOffersHit = { ...VENUE_OFFERS_HIT, objectID: ID }
    const venueOffers = mockAlgoliaResponse([VENUE_OFFERS_HIT, venueOffersHit])

    it('should render offer component', async () => {
      renderMovieOfferTile({ movieOffer, venueOffers })

      expect(await screen.findByText(VENUE_OFFERS_HIT.offer.name)).toBeOnTheScreen()
    })
  })

  describe('without screening on selected date', () => {
    const ID = '4321'
    const venueOffersHit = { ...VENUE_OFFERS_HIT, objectID: ID }
    const venueOffers = { ...VENUE_OFFERS_MOCK, hits: [VENUE_OFFERS_HIT, venueOffersHit] }

    it('should not render offer component', () => {
      renderMovieOfferTile({ movieOffer: MOCK_MOVIE_OFFER, venueOffers })

      expect(screen.queryByText(VENUE_OFFERS_HIT.offer.name)).not.toBeOnTheScreen()
    })
  })

  describe('with next screening date', () => {
    beforeEach(() => mockdate.set(MOCK_DATE))

    const TODAY_PLUS_20_DAYS = addDays(MOCK_DATE, 20)
    const TODAY_PLUS_10_DAYS = addDays(MOCK_DATE, 10)

    it('should render next screening button', async () => {
      renderMovieOfferTile({
        movieOffer: MOCK_MOVIE_OFFER,
        venueOffers: VENUE_OFFERS_MOCK,
        nextScreeningDate: TODAY_PLUS_20_DAYS,
      })

      expect(await screen.findByText(NEXT_SCREENING_WORDING)).toBeOnTheScreen()
    })

    it('should open booking modal on press when nextScreeningDate is at least 15 days after today', async () => {
      renderMovieOfferTile({
        movieOffer: MOCK_MOVIE_OFFER,
        venueOffers: VENUE_OFFERS_MOCK,
        nextScreeningDate: TODAY_PLUS_20_DAYS,
      })

      const nextScreeningButton = await screen.findByText(NEXT_SCREENING_WORDING)

      await user.press(nextScreeningButton)

      expect(mockOnPressOfferCTA).toHaveBeenCalledWith()
    })

    it('should trigger calendar scroll on press when nextScreeningDate is within the next 15 days', async () => {
      renderMovieOfferTile({
        movieOffer: MOCK_MOVIE_OFFER,
        venueOffers: VENUE_OFFERS_MOCK,
        nextScreeningDate: TODAY_PLUS_10_DAYS,
      })

      const nextScreeningButton = await screen.findByText(NEXT_SCREENING_WORDING)

      await user.press(nextScreeningButton)

      expect(mockGoToDate).toHaveBeenCalledWith(TODAY_PLUS_10_DAYS)
    })
  })
})

const next15Dates = getDates(new Date(), 15)

const renderMovieOfferTile = ({
  movieOffer,
  venueOffers,
  nextScreeningDate,
  isDesktopViewport = false,
}: {
  movieOffer: MovieOffer
  venueOffers: VenueOffers
  nextScreeningDate?: Date
  isDesktopViewport?: boolean
}) => {
  render(
    reactQueryProviderHOC(
      <AnchorProvider scrollViewRef={createRef<ScrollView>()} handleCheckScrollY={() => 0}>
        <MovieCalendarProvider initialDates={next15Dates}>
          <MovieOfferTile
            movieOffer={movieOffer}
            venueOffers={venueOffers}
            isLast={false}
            nextScreeningDate={nextScreeningDate}
          />
        </MovieCalendarProvider>
      </AnchorProvider>
    ),
    {
      theme: { isDesktopViewport },
    }
  )
}
