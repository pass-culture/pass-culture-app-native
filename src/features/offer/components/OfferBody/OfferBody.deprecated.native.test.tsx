import mockdate from 'mockdate'

import { api } from 'api/api'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { offerId, renderOfferBodyPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import { analytics } from 'libs/firebase/analytics'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { fireEvent, screen, waitFor } from 'tests/utils'

jest.mock('api/api')
jest.mock('features/auth/context/AuthContext')
jest.mock('features/offer/api/useOffer')
jest.mock('features/offer/helpers/useReasonsForReporting/useReasonsForReporting', () => ({
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

const mockSubcategories = placeholderData.subcategories
const mockSearchGroups = placeholderData.searchGroups
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      searchGroups: mockSearchGroups,
    },
  }),
}))

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

describe('<OfferBody />', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

  beforeAll(() => {
    mockdate.set(new Date(2021, 0, 1))
  })

  it('should match snapshot for physical offer', async () => {
    renderOfferBodyPage({ isDigital: false })
    await screen.findByTestId('offer-container')

    expect(screen).toMatchSnapshot()
  })

  it('should match snapshot for digital offer', async () => {
    renderOfferBodyPage({ isDigital: true, isDuo: false })
    await screen.findByTestId('offer-container')

    expect(screen).toMatchSnapshot()
  })

  it('should show venue banner in where section', async () => {
    renderOfferBodyPage({ isDigital: false })

    expect(await screen.findByTestId(`Lieu ${offerResponseSnap.venue.name}`)).toBeTruthy()
  })

  describe('Accessibility details', () => {
    it('should display accessibility by default', async () => {
      renderOfferBodyPage()

      expect(await screen.findByText('Accessibilité')).toBeTruthy()
    })

    it('should display custom accessibility', async () => {
      renderOfferBodyPage({ accessibility: { visualDisability: false } })

      expect(await screen.findByText('Accessibilité')).toBeTruthy()
    })

    it('should not display when no information about accessibility', async () => {
      renderOfferBodyPage({ accessibility: {} })
      await screen.findByTestId('offer-container')

      expect(screen.queryByText('Accessibilité')).toBeNull()
    })
  })

  describe('withdrawalDetails', () => {
    it('should display for beneficiary user', async () => {
      renderOfferBodyPage({ withdrawalDetails: 'How to withdraw' }, { isBeneficiary: true })

      expect(await screen.findByText('Modalités de retrait')).toBeTruthy()
    })

    it('should not display for non beneficiary user', async () => {
      renderOfferBodyPage({ withdrawalDetails: 'How to withdraw' }, { isBeneficiary: false })
      await screen.findByTestId('offer-container')

      expect(screen.queryByText('Modalités de retrait')).toBeNull()
    })

    it('should not display', async () => {
      renderOfferBodyPage({ withdrawalDetails: undefined })
      await screen.findByTestId('offer-container')

      expect(screen.queryByText('Modalités de retrait')).toBeNull()
    })
  })

  it('should not display distance when no address and go to button', async () => {
    renderOfferBodyPage({
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

    await screen.findByTestId('offer-container')

    expect(screen.queryByText('Voir l’itinéraire')).toBeNull()
    expect(screen.queryByText('Distance')).toBeNull()
  })

  it('should request /native/v1/offers/reports if user is logged in and connected', async () => {
    renderOfferBodyPage()
    await screen.findByTestId('offer-container')

    expect(api.getnativev1offersreports).toHaveBeenCalledTimes(1)
  })

  it('should not request /native/v1/offers/reports if user is logged in and not connected', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
    renderOfferBodyPage()
    await screen.findByTestId('offer-container')

    expect(api.getnativev1offersreports).not.toHaveBeenCalled()
  })

  it('should not request /native/v1/offers/reports if user is not logged in and connected', async () => {
    renderOfferBodyPage(undefined, undefined, { isLoggedIn: false })
    await screen.findByTestId('offer-container')

    expect(api.getnativev1offersreports).not.toBeCalled()
  })

  it('should log itinerary analytics', async () => {
    renderOfferBodyPage()

    fireEvent.press(screen.getByText('Voir l’itinéraire'))

    await waitFor(() => {
      expect(analytics.logConsultItinerary).toBeCalledWith({ offerId, from: 'offer' })
    })
  })
})
