import { useAuthContext } from 'features/auth/AuthContext'
import { offerId, renderOfferPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import { analytics } from 'libs/firebase/analytics'
import { act, fireEvent } from 'tests/utils'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

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
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
    }))

    const { getByText } = await renderOfferPage()

    const bookingOfferButton = getByText('Réserver l’offre')
    fireEvent.press(bookingOfferButton)

    expect(getByText('Identifie-toi pour réserver l’offre')).toBeTruthy()
  })

  it('should log analaytics when display authentication modal', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
    }))

    const { getByText } = await renderOfferPage()

    const bookingOfferButton = getByText('Réserver l’offre')
    fireEvent.press(bookingOfferButton)

    expect(analytics.logConsultAuthenticationModal).toHaveBeenNthCalledWith(1, offerId)
  })
})

const scrollEvent = {
  nativeEvent: {
    contentOffset: { y: 200 },
    layoutMeasurement: { height: 1000 },
    contentSize: { height: 1600 },
  },
}
