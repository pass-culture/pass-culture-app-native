import mockdate from 'mockdate'
import React, { createRef } from 'react'
import { ScrollView } from 'react-native'

import {
  Bookability,
  CategoryIdEnum,
  MovieScreenings,
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoryIdEnum,
} from 'api/gen'
import * as MovieCalendarContextV2 from 'features/offer/components/MoviesScreeningCalendarV2/MovieCalendarContextV2'
import { MovieCalendarProviderV2 } from 'features/offer/components/MoviesScreeningCalendarV2/MovieCalendarContextV2'
import { MovieOfferTileV2 } from 'features/offer/components/MoviesScreeningCalendarV2/MovieOfferTileV2'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const MOCK_DATE = '2026-09-02'
const MOCK_DATES = [
  '2026-09-02',
  '2026-09-03',
  '2026-09-04',
  '2026-09-05',
  '2026-09-06',
  '2026-09-08',
  '2026-09-09',
  '2026-09-10',
  '2026-09-11',
  '2026-09-12',
  '2026-09-13',
  '2026-09-14',
  '2026-09-15',
  '2026-09-16',
  '2026-09-17',
]

const mockMovieScreenings = {
  duration: 116,
  genres: [],
  last30DaysBookings: 0,
  movieName: 'Harry Potter',
  offerId: 113,
  thumbUrl: null,
  dayScreenings: [
    {
      beginningDatetime: '2026-09-02T14:47:09.705+02:00',
      bookability: Bookability.BOOKABLE,
      features: ['VO'],
      price: 10.1,
      stockId: 112,
    },
  ],
  nextScreening: {
    beginningDatetime: '2026-09-02T14:47:09.705+02:00',
    bookability: Bookability.BOOKABLE,
    features: ['VO'],
    price: 10.1,
    stockId: 112,
  },
}

const mockDisplayCalendar = jest.fn()
const mockGoToDate = jest.fn()
jest.spyOn(MovieCalendarContextV2, 'useMovieCalendarV2').mockReturnValue({
  selectedDate: MOCK_DATE,
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

describe('MovieOfferTileV2', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setFeatureFlags()
    mockdate.set(MOCK_DATE)
  })

  afterEach(() => {
    mockdate.reset()
  })

  describe('with screening on selected date', () => {
    it('should render offer component', async () => {
      renderMovieOfferTile({ movieScreenings: mockMovieScreenings, venueId: 1 })

      expect(await screen.findByText('Harry Potter')).toBeOnTheScreen()
    })
  })

  it('should send log ConsultOffer event when on venue page and user clicks on an eventCard', async () => {
    renderMovieOfferTile({ movieScreenings: mockMovieScreenings, venueId: 12 })
    const eventCard = await screen.findByLabelText('14h47 - VO - 10,10 €')
    await user.press(eventCard)

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        offerId: '113',
        from: 'venue',
        venueId: 12,
      })
    )
  })

  describe('without screening on selected date', () => {
    it('should not render offer component', () => {
      renderMovieOfferTile({
        movieScreenings: { ...mockMovieScreenings, dayScreenings: [] },
        venueId: 12,
      })

      expect(screen.queryByText('Harry Potter')).not.toBeOnTheScreen()
    })
  })
})

const renderMovieOfferTile = ({
  movieScreenings,
  venueId,
  isDesktopViewport = false,
}: {
  movieScreenings: MovieScreenings
  venueId: number
  isDesktopViewport?: boolean
}) => {
  render(
    reactQueryProviderHOC(
      <AnchorProvider scrollViewRef={createRef<ScrollView>()} handleCheckScrollY={() => 0}>
        <MovieCalendarProviderV2 initialDates={MOCK_DATES}>
          <MovieOfferTileV2 movieScreenings={movieScreenings} venueId={venueId} isLast={false} />
        </MovieCalendarProviderV2>
      </AnchorProvider>
    ),
    {
      theme: { isDesktopViewport },
    }
  )
}
