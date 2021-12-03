import mockdate from 'mockdate'

import { api } from 'api/api'
import { analytics } from 'libs/analytics'
import { act, cleanup, fireEvent } from 'tests/utils'

import { offerId, renderOfferBodyPage } from './renderOfferPageTestUtil'

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
          description: "comparé à l'offre public",
          title: 'Le tarif est trop élevé',
        },
      },
    },
  })),
}))

describe('<OfferBody />', () => {
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
    expect(wrapper.queryByText('Accessibilité')).toBeFalsy()
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
    expect(wrapper.queryByText('Modalités de retrait')).toBeFalsy()
  })

  it('should not show withdrawalDetails', async () => {
    const wrapper = await renderOfferBodyPage({ withdrawalDetails: undefined })
    expect(wrapper.queryByText('Modalités de retrait')).toBeFalsy()
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
    expect(wrapper.queryByText("Voir l'itinéraire")).toBeFalsy()
    expect(wrapper.queryByText('Distance')).toBeFalsy()
  })

  it('should request /native/v1/offers/reports if user is logged in', async () => {
    await renderOfferBodyPage()
    expect(api.getnativev1offersreports).toHaveBeenCalled()
  })

  it('should not request /native/v1/offers/reports if user is not logged in', async () => {
    await renderOfferBodyPage(undefined, undefined, { isLoggedIn: false })
    expect(api.getnativev1offersreports).not.toHaveBeenCalled()
  })

  it('should log itinerary analytics', async () => {
    const wrapper = await renderOfferBodyPage()
    act(() => {
      fireEvent.press(wrapper.getByText("Voir l'itinéraire"))
    })
    expect(analytics.logConsultItinerary).toHaveBeenCalledWith({ offerId, from: 'offer' })
  })
})
