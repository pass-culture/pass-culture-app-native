import { useAuthContext } from 'features/auth/context/AuthContext'
import { offerId, renderOfferPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/firebase/analytics'
import { SearchHit } from 'libs/search'
import { act, fireEvent } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

let mockSearchHits: SearchHit[] = []
jest.mock('features/offer/api/useSimilarOffers', () => ({
  useSimilarOffers: jest.fn(() => mockSearchHits),
}))

describe('<Offer />', () => {
  // fake timers are needed to avoid warning (because we use useTrackOfferSeenDuration)
  // See https://github.com/facebook/jest/issues/6434
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('animates on scroll', async () => {
    const { getByTestId } = await renderOfferPage()
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

    const { getByText } = await renderOfferPage()

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

    const { getByText } = await renderOfferPage()

    const bookingOfferButton = getByText('Réserver l’offre')
    fireEvent.press(bookingOfferButton)

    expect(analytics.logConsultAuthenticationModal).toHaveBeenNthCalledWith(1, offerId)
  })

  describe('with similar offers', () => {
    beforeAll(() => {
      mockSearchHits = mockedAlgoliaResponse.hits
    })

    it('should log analytics event logSimilarOfferPlaylistVerticalScroll when scrolling vertical and reaching the bottom', async () => {
      const { getByTestId } = await renderOfferPage()
      const scrollView = getByTestId('offer-container')

      fireEvent.scroll(scrollView, nativeEventBottom)

      expect(analytics.logSimilarOfferPlaylistVerticalScroll).toHaveBeenCalledTimes(1)
    })

    it('should not log analytics event logSimilarOfferPlaylistVerticalScroll when scrolling vertical and not reaching the bottom', async () => {
      const { getByTestId } = await renderOfferPage()
      const scrollView = getByTestId('offer-container')

      fireEvent.scroll(scrollView, nativeEventTop)

      expect(analytics.logSimilarOfferPlaylistVerticalScroll).toHaveBeenCalledTimes(0)
    })

    it('should log logSimilarOfferPlaylistVerticalScroll with the event param fromOfferId', async () => {
      const fromOfferId = 1
      const { getByTestId } = await renderOfferPage(fromOfferId)
      const scrollView = getByTestId('offer-container')

      fireEvent.scroll(scrollView, nativeEventBottom)

      expect(analytics.logSimilarOfferPlaylistVerticalScroll).toHaveBeenCalledWith(1)
    })
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
