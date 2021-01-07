import { act, fireEvent } from '@testing-library/react-native'
import { UseQueryResult } from 'react-query'

import { UserProfileResponse } from 'api/gen'

import { renderOfferPage } from './renderOfferPage'

jest.mock('libs/geolocation')

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('features/offer/services/useItinerary', () => ({
  useItinerary: jest.fn(() => ({ availableApps: ['waze'], navigateTo: jest.fn() })),
}))

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(
    () =>
      ({
        isLoading: false,
        data: { email: 'email2@domain.ext', firstName: 'Jean', isBeneficiary: true },
      } as UseQueryResult<UserProfileResponse>)
  ),
}))

describe('<Offer />', () => {
  it('should match snapshot for physical offer', async () => {
    const { toJSON } = await renderOfferPage({ isDigital: false })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should match snapshot for digital offer', async () => {
    const { toJSON } = await renderOfferPage({ isDigital: true, isDuo: false })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should show accessibilityDetails', async () => {
    let wrapper = await renderOfferPage()
    expect(wrapper.queryByText('Accessibilité')).toBeTruthy()

    wrapper = await renderOfferPage({ accessibility: { visualDisability: false } })
    expect(wrapper.queryByText('Accessibilité')).toBeTruthy()

    wrapper = await renderOfferPage({ accessibility: {} })
    expect(wrapper.queryByText('Accessibilité')).toBeFalsy()
  })
  it('should show withdrawalDetails', async () => {
    const wrapper = await renderOfferPage({ withdrawalDetails: 'How to withdraw' })
    expect(wrapper.queryByText('Modalités de retrait')).toBeTruthy()
  })
  it('should not show withdrawalDetails', async () => {
    const wrapper = await renderOfferPage({ withdrawalDetails: undefined })
    expect(wrapper.queryByText('Modalités de retrait')).toBeFalsy()
  })

  it('animates on scroll', async () => {
    const { getByTestId } = await renderOfferPage()
    expect(getByTestId('offerHeaderName').props.style.opacity).toBe(0)
    const scrollContainer = getByTestId('offer-container')
    await act(async () => await fireEvent.scroll(scrollContainer, scrollEvent))
    expect(getByTestId('offerHeaderName').props.style.opacity).toBe(1)
  })

  it('should not show distance and go to button', async () => {
    const wrapper = await renderOfferPage({
      venue: {
        id: 1664,
        address: '2 RUE LAMENNAIS',
        city: 'PARIS 8',
        offerer: { name: 'PATHE BEAUGRENELLE' },
        name: 'PATHE BEAUGRENELLE',
        postalCode: '75008',
        publicName: undefined,
        coordinates: {},
      },
    })
    expect(wrapper.queryByText("Voir l'itinéraire")).toBeFalsy()
    expect(wrapper.queryByText('Distance')).toBeFalsy()
  })
})

const scrollEvent = {
  nativeEvent: {
    contentOffset: { y: 200 },
    layoutMeasurement: { height: 1000 },
    contentSize: { height: 1600 },
  },
}
