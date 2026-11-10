import React from 'react'

import { OffersStocksResponseV2 } from 'api/gen/api'
import { MovieCalendarProvider } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { OfferCineContent } from 'features/offer/components/OfferCine/OfferCineContent'
import { offersStocksResponseSnap } from 'features/offer/fixtures/offersStocksResponse'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { LocationMode, Position } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { getDates } from 'shared/date/getDates'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

jest.mock('features/offer/helpers/useGetVenueByDay/useGetVenuesByDay')
jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/network/NetInfoWrapper')

const mockUserLocation: Position = { latitude: 48.90374, longitude: 2.48171 }

jest.mock('ui/components/anchor/AnchorContext', () => ({
  useScrollToAnchor: jest.fn,
  useRegisterAnchor: jest.fn,
}))

const defaultOffersStocksFromOfferQuery = {
  isLoading: false,
  data: mockBuilder.offersStocksResponseV2({}),
}
const mockuseOffersStocksFromOfferQuery = jest.fn(() => defaultOffersStocksFromOfferQuery)
jest.mock('features/offer/queries/useOffersStocksFromOfferQuery', () => ({
  useOffersStocksFromOfferQuery: () => mockuseOffersStocksFromOfferQuery(),
}))

const mockedMovieOffers = [
  ...offersStocksResponseSnap.offers.map((offer) => ({
    offer: { ...offer, id: offer.id },
    isUpcoming: false,
  })),
  ...offersStocksResponseSnap.offers.map((offer) => ({
    offer: { ...offer, id: offer.id + 111 },
    isUpcoming: false,
  })),
]

const mockedMovieOffersLongResult = [
  ...mockedMovieOffers,
  ...offersStocksResponseSnap.offers.map((offer) => ({
    offer: { ...offer, id: offer.id + 999 },
    isUpcoming: false,
  })),
]

const mockUseGetVenuesByDay = jest.fn(() => ({
  movieOffers: mockedMovieOffers,
  hasStocksOnlyAfter15Days: false,
}))

jest.mock('features/offer/helpers/useGetVenueByDay/useGetVenuesByDay', () => ({
  useGetVenuesByDay: () => mockUseGetVenuesByDay(),
}))

jest.mock('features/offer/helpers/getDaysWithNoScreenings', () => ({
  getDaysWithNoScreenings: jest.fn(),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
const mockOffer = mockBuilder.offerResponseV2({})

jest.useFakeTimers()

describe('OfferCineContent', () => {
  beforeAll(() => {
    setFeatureFlags()
  })

  beforeEach(() => {
    useLocationV2.setState(defaultLocationState)
    locationActions.setLocationMode(LocationMode.AROUND_ME)
    locationActions.setGeolocPosition(mockUserLocation)
  })

  it('should display skeleton when data is loading', async () => {
    mockuseOffersStocksFromOfferQuery
      .mockReturnValueOnce({
        ...defaultOffersStocksFromOfferQuery,
        isLoading: true,
      })
      .mockReturnValueOnce({
        ...defaultOffersStocksFromOfferQuery,
        isLoading: true,
      })
    renderOfferCineContent()

    expect(await screen.findAllByTestId('cine-block-skeleton')).toBeDefined()
  })

  it('should not display skeleton when data is loaded', async () => {
    mockuseOffersStocksFromOfferQuery.mockReturnValueOnce({
      ...defaultOffersStocksFromOfferQuery,
      isLoading: false,
    })
    renderOfferCineContent()

    expect(screen.queryByTestId('cine-block-skeleton')).not.toBeOnTheScreen()
  })

  it('should display Button "Afficher plus de cinémas" when there is more cinemas', async () => {
    renderOfferCineContent()

    expect(await screen.findByText('Afficher plus de cinémas')).toBeOnTheScreen()
  })

  it('should display "Afficher plus de cinémas" when button is clicked and more movie Offers', async () => {
    mockUseGetVenuesByDay
      .mockReturnValueOnce({
        movieOffers: mockedMovieOffersLongResult,
        hasStocksOnlyAfter15Days: false,
      })
      .mockReturnValueOnce({
        movieOffers: mockedMovieOffersLongResult,
        hasStocksOnlyAfter15Days: false,
      })
      .mockReturnValueOnce({
        movieOffers: mockedMovieOffersLongResult,
        hasStocksOnlyAfter15Days: false,
      })
    renderOfferCineContent()

    const moreButton = await screen.findByText('Afficher plus de cinémas')
    await user.press(moreButton)

    await act(async () => {})

    expect(await screen.findByText('Afficher plus de cinémas')).toBeOnTheScreen()
  })

  it('should not display more cinema when Button "Afficher plus de cinémas" is clicked and end of movie Offers', async () => {
    renderOfferCineContent()

    const moreButton = await screen.findByText('Afficher plus de cinémas')
    await user.press(moreButton)

    await act(async () => {})

    expect(screen.queryByText('Afficher plus de cinémas')).not.toBeOnTheScreen()
  })

  it('should display special event banner when offer has special event screenings', async () => {
    const hookContent = {
      data: {
        offers: [
          {
            ...defaultOffersStocksFromOfferQuery.data.offers[0],
            stocks: [
              {
                ...defaultOffersStocksFromOfferQuery.data.offers[0]?.stocks[0],
                features: ['PLEIN_AIR'],
              },
            ],
          },
        ],
      } as OffersStocksResponseV2,
      isLoading: false,
    }
    mockuseOffersStocksFromOfferQuery
      .mockReturnValueOnce(hookContent)
      .mockReturnValueOnce(hookContent)
    const calendarStartDate = new Date(
      defaultOffersStocksFromOfferQuery.data.offers[0]?.stocks[0]?.beginningDatetime ?? '2024-05-08'
    )
    calendarStartDate.setHours(calendarStartDate.getHours() - 1)
    renderOfferCineContent({ initialDates: getDates(calendarStartDate, 15) })

    await act(async () => {})

    expect(
      await screen.findByText('Des séances spéciales sont disponibles pour ce film')
    ).toBeOnTheScreen()
  })

  it('should not display special event banner if offer has had special event screenings in the past', async () => {
    const hookContent = {
      data: {
        offers: [
          {
            ...defaultOffersStocksFromOfferQuery.data.offers[0],
            stocks: [
              {
                ...defaultOffersStocksFromOfferQuery.data.offers[0]?.stocks[0],
                features: ['PLEIN_AIR'],
              },
            ],
          },
        ],
      } as OffersStocksResponseV2,
      isLoading: false,
    }
    mockuseOffersStocksFromOfferQuery
      .mockReturnValueOnce(hookContent)
      .mockReturnValueOnce(hookContent)

    renderOfferCineContent({ initialDates: getDates(new Date(), 15) })

    await act(async () => {})

    expect(
      screen.queryByText('Des séances spéciales sont disponibles pour ce film')
    ).not.toBeOnTheScreen()
  })
})

it('should not display special event banner if offer have special event screenings beyond calendar range', async () => {
  const hookContent = {
    data: {
      offers: [
        {
          ...defaultOffersStocksFromOfferQuery.data.offers[0],
          stocks: [
            {
              ...defaultOffersStocksFromOfferQuery.data.offers[0]?.stocks[0],
              features: ['PLEIN_AIR'],
            },
          ],
        },
      ],
    } as OffersStocksResponseV2,
    isLoading: false,
  }
  mockuseOffersStocksFromOfferQuery
    .mockReturnValueOnce(hookContent)
    .mockReturnValueOnce(hookContent)
  const calendarStartDate = new Date(
    defaultOffersStocksFromOfferQuery.data.offers[0]?.stocks[0]?.beginningDatetime ?? '2023-05-08'
  )
  calendarStartDate.setFullYear(calendarStartDate.getFullYear() - 1)
  renderOfferCineContent({ initialDates: getDates(calendarStartDate, 15) })

  await act(async () => {})

  expect(
    screen.queryByText('Des séances spéciales sont disponibles pour ce film')
  ).not.toBeOnTheScreen()
})

const renderOfferCineContent = ({ initialDates = undefined }: { initialDates?: Date[] } = {}) => {
  return render(
    reactQueryProviderHOC(
      <MovieCalendarProvider initialDates={initialDates}>
        <OfferCineContent onSeeVenuePress={jest.fn()} offer={mockOffer} />
      </MovieCalendarProvider>
    )
  )
}
