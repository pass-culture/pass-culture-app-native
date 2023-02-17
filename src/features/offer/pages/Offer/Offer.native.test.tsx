import { rest } from 'msw'
import waitForExpect from 'wait-for-expect'

import { mockedBookingApi } from '__mocks__/fixtures/booking'
import { BookingsResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { offerId, renderOfferPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import { beneficiaryUser } from 'fixtures/user'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { SearchHit } from 'libs/search'
import { server } from 'tests/server'
import { act, fireEvent, screen } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

let mockSearchHits: SearchHit[] = []
jest.mock('features/offer/api/useSimilarOffers', () => ({
  useSimilarOffers: jest.fn(() => mockSearchHits),
}))

describe('<Offer />', () => {
  // fake timers are needed to avoid warning (because we use useTrackOfferSeenDuration)
  // See https://github.com/facebook/jest/issues/6434
  beforeEach(() => {
    jest.useFakeTimers()
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
  })
  afterEach(() => jest.useRealTimers())

  it('animates on scroll', async () => {
    const { getByTestId } = renderOfferPage()
    expect(getByTestId('offerHeaderName').props.style.opacity).toBe(0)
    const scrollContainer = getByTestId('offer-container')
    await act(async () => await fireEvent.scroll(scrollContainer, scrollEvent))
    expect(getByTestId('offerHeaderName').props.style.opacity).toBe(1)
  })

  it('should display authentication modal when clicking on "Réserver l’offre"', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
      user: undefined,
    })

    const { getByText } = renderOfferPage()

    const bookingOfferButton = getByText('Réserver l’offre')
    fireEvent.press(bookingOfferButton)

    expect(getByText('Identifie-toi pour réserver l’offre')).toBeTruthy()
  })

  it('should log analaytics when display authentication modal', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    }))

    const { getByText } = renderOfferPage()

    const bookingOfferButton = getByText('Réserver l’offre')
    fireEvent.press(bookingOfferButton)

    expect(analytics.logConsultAuthenticationModal).toHaveBeenNthCalledWith(1, offerId)
  })

  describe('with similar offers', () => {
    beforeAll(() => {
      mockSearchHits = mockedAlgoliaResponse.hits
    })

    it('should log analytics event logPlaylistVerticalScroll when scrolling vertical and reaching the bottom', async () => {
      const { getByTestId } = await renderOfferPage()
      const scrollView = getByTestId('offer-container')

      fireEvent.scroll(scrollView, nativeEventBottom)

      expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledTimes(1)
    })

    it('should not log analytics event logPlaylistVerticalScroll when scrolling vertical and not reaching the bottom', async () => {
      const { getByTestId } = await renderOfferPage()
      const scrollView = getByTestId('offer-container')

      fireEvent.scroll(scrollView, nativeEventTop)

      expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledTimes(0)
    })

    it('should log logPlaylistVerticalScroll with the event param fromOfferId & offerId', async () => {
      const fromOfferId = 1
      const offerId = 116656
      const { getByTestId } = await renderOfferPage(fromOfferId)
      const scrollView = getByTestId('offer-container')

      fireEvent.scroll(scrollView, nativeEventBottom)

      expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledWith(fromOfferId, offerId)
    })
  })

  it('should open booking modale when login after booking attempt', async () => {
    const newLocal = {
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
      user: beneficiaryUser,
    }
    // Multiple renders force us to mock auth context as loggedIn user in this test
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue(newLocal)
    const fromOfferId = 1
    const { queryByText } = renderOfferPage(fromOfferId, undefined, true)

    await waitForExpect(async () => {
      expect(queryByText('Mes options')).toBeTruthy()
    })
  })

  it('should display reservation impossible when user has already booked the offer', async () => {
    const newLocal = {
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
      user: beneficiaryUser,
    }
    // Multiple renders force us to mock auth context as loggedIn user in this test
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue(newLocal)

    const expectedResponse: BookingsResponse = {
      ended_bookings: [
        {
          ...mockedBookingApi,
          stock: {
            ...mockedBookingApi.stock,
            offer: { ...mockedBookingApi.stock.offer, id: offerId },
          },
          dateUsed: '2023-02-14T10:10:08.800599Z',
        },
      ],
      hasBookingsAfter18: false,
      ongoing_bookings: [],
    }

    server.use(
      rest.get(env.API_BASE_URL + '/native/v1/bookings', async (_, res, ctx) =>
        res(ctx.status(200), ctx.json(expectedResponse))
      )
    )

    renderOfferPage(mockedBookingApi.id)

    fireEvent.press(screen.getByText('Voir les disponibilités'))

    expect(await screen.findByText('Réservation impossible')).toBeTruthy()
  })
})

const scrollEvent = {
  nativeEvent: {
    contentOffset: { y: 200 },
    layoutMeasurement: { height: 1000 },
    contentSize: { height: 1600 },
  },
}

const nativeEventBottom = {
  nativeEvent: {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 900 },
    contentSize: { height: 1600 },
  },
}

const nativeEventTop = {
  nativeEvent: {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 100 },
    contentSize: { height: 1600 },
  },
}
