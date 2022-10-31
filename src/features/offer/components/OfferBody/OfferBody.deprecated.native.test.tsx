import mockdate from 'mockdate'

import { api } from 'api/api'
import {
  offerId,
  renderOfferBodyPage,
} from 'features/offer/pages/__tests__/renderOfferPageTestUtil'
import { analytics } from 'libs/firebase/analytics'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { act, cleanup, fireEvent } from 'tests/utils'

jest.mock('api/api')
jest.mock('features/offer/api/useOffer')
jest.mock('features/offer/services/useReasonsForReporting', () => ({
  useReasonsForReporting: jest.fn(() => ({
    data: {
      reasons: {
        IMPROPER: {
          description: 'La date ne correspond pas, mauvaise description...',
          title: 'La description est non conforme',
        },
        INAPPROPRIATE: {
          description: 'violence, incitation à la haine, nudité...',
          title: 'Le contenu est inapproprié',
        },
        OTHER: {
          description: '',
          title: 'Autre',
        },
        PRICE_TOO_HIGH: {
          description: 'comparé à l’offre public',
          title: 'Le tarif est trop élevé',
        },
      },
    },
  })),
}))

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

describe('<OfferBody />', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

  beforeAll(() => {
    mockdate.set(new Date(2021, 0, 1))
  })

  afterEach(cleanup)

  it('should match snapshot for physical offer', async () => {
    const { toJSON } = await renderOfferBodyPage({ isDigital: false })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should match snapshot for digital offer', async () => {
    const { toJSON } = await renderOfferBodyPage({ isDigital: true, isDuo: false })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should show venue banner in where section', async () => {
    const venue = await renderOfferBodyPage({ isDigital: false })
    expect(venue.queryByTestId('VenueBannerComponent')).toBeTruthy()
  })

  it('should show accessibilityDetails', async () => {
    let wrapper = await renderOfferBodyPage()
    expect(wrapper.queryByText('Accessibilité')).toBeTruthy()

    wrapper = await renderOfferBodyPage({ accessibility: { visualDisability: false } })
    expect(wrapper.queryByText('Accessibilité')).toBeTruthy()

    wrapper = await renderOfferBodyPage({ accessibility: {} })
    expect(wrapper.queryByText('Accessibilité')).toBeNull()
  })

  it('should show withdrawalDetails', async () => {
    const wrapper = await renderOfferBodyPage(
      { withdrawalDetails: 'How to withdraw' },
      { isBeneficiary: true }
    )
    expect(wrapper.queryByText('Modalités de retrait')).toBeTruthy()
  })

  it('should show withdrawalDetails for non beneficiary user', async () => {
    const wrapper = await renderOfferBodyPage(
      { withdrawalDetails: 'How to withdraw' },
      { isBeneficiary: false }
    )
    expect(wrapper.queryByText('Modalités de retrait')).toBeNull()
  })

  it('should not show withdrawalDetails', async () => {
    const wrapper = await renderOfferBodyPage({ withdrawalDetails: undefined })
    expect(wrapper.queryByText('Modalités de retrait')).toBeNull()
  })

  it('should not show distance when no address and go to button', async () => {
    const wrapper = await renderOfferBodyPage({
      venue: {
        id: 1664,
        address: undefined,
        city: 'PARIS 8',
        offerer: { name: 'PATHE BEAUGRENELLE' },
        name: 'PATHE BEAUGRENELLE',
        postalCode: '75008',
        publicName: undefined,
        coordinates: {},
        isPermanent: true,
      },
    })
    expect(wrapper.queryByText("Voir l'itinéraire")).toBeNull()
    expect(wrapper.queryByText('Distance')).toBeNull()
  })

  it('should request /native/v1/offers/reports if user is logged in and connected', async () => {
    await renderOfferBodyPage()
    expect(api.getnativev1offersreports).toBeCalled()
  })

  it('should not request /native/v1/offers/reports if user is logged in and not connected', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
    await renderOfferBodyPage()
    expect(api.getnativev1offersreports).not.toBeCalled()
  })

  it('should not request /native/v1/offers/reports if user is not logged in and connected', async () => {
    await renderOfferBodyPage(undefined, undefined, { isLoggedIn: false })
    expect(api.getnativev1offersreports).not.toBeCalled()
  })

  it('should log itinerary analytics', async () => {
    const wrapper = await renderOfferBodyPage()
    act(() => {
      fireEvent.press(wrapper.getByText('Voir l’itinéraire'))
    })
    expect(analytics.logConsultItinerary).toBeCalledWith({ offerId, from: 'offer' })
  })
})
