import { NavigationContainer } from '@react-navigation/native'
import { act, fireEvent, render } from '@testing-library/react-native'
import { rest } from 'msw/'
import React from 'react'
import { UseQueryResult } from 'react-query'
import { ReactTestInstance } from 'react-test-renderer'
import waitForExpect from 'wait-for-expect'

import { OfferResponse, UserProfileResponse } from 'api/gen'
import { RootStack } from 'features/navigation/RootNavigator'
import { logConsultAccessibility, logConsultWithdrawal, logConsultWholeOffer } from 'libs/analytics'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises } from 'tests/utils'

import { offerResponseSnap } from '../api/snaps/offerResponseSnap'
import { dehumanizeId } from '../services/dehumanizeId'

import { Offer } from './Offer'

jest.mock('libs/geolocation')

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
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
  it('should show withdrawalDetails', async () => {
    let wrapper = await renderOfferPage({ withdrawalDetails: 'How to withdraw' })
    expect(wrapper.queryByText('Modalités de retrait')).toBeTruthy()

    wrapper = await renderOfferPage({ withdrawalDetails: undefined })
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

  describe('Analytics', () => {
    beforeAll(() => jest.useFakeTimers())
    const trigger = (component: ReactTestInstance) => {
      act(() => {
        fireEvent.press(component)
        jest.advanceTimersByTime(300)
      })
    }

    it('should log ConsultAccesibilityModalities once when opening accessibility modalities', async () => {
      const { getByText } = await renderOfferPage()

      trigger(getByText('Accessibilité'))
      expect(logConsultAccessibility).toHaveBeenCalledTimes(1)
      expect(logConsultAccessibility).toHaveBeenCalledWith(offerId)

      trigger(getByText('Accessibilité'))
      trigger(getByText('Accessibilité'))
      expect(logConsultAccessibility).toHaveBeenCalledTimes(1)
    })
    it('should log ConsultWithdrawalModalities once when opening accessibility modalities', async () => {
      const { getByText } = await renderOfferPage()

      trigger(getByText('Modalités de retrait'))
      expect(logConsultWithdrawal).toHaveBeenCalledTimes(1)
      expect(logConsultWithdrawal).toHaveBeenCalledWith(offerId)

      trigger(getByText('Modalités de retrait'))
      trigger(getByText('Modalités de retrait'))
      expect(logConsultWithdrawal).toHaveBeenCalledTimes(1)
    })

    const nativeEventMiddle = {
      layoutMeasurement: { height: 1000 },
      contentOffset: { y: 400 }, // how far did we scroll
      contentSize: { height: 1600 },
    }
    const nativeEventBottom = {
      layoutMeasurement: { height: 1000 },
      contentOffset: { y: 900 },
      contentSize: { height: 1600 },
    }

    it('should trigger logEvent "ConsultAllOffer" when reaching the end', async () => {
      const offerPage = await renderOfferPage()
      const scrollView = offerPage.getByTestId('offer-container')

      await act(async () => {
        await scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
        // await flushAllPromises()
      })
      expect(logConsultWholeOffer).not.toHaveBeenCalled()

      await act(async () => {
        await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
      })

      expect(logConsultWholeOffer).toHaveBeenCalledWith(offerId)
    })

    it('should trigger logEvent "ConsultAllOffer" only once', async () => {
      const offerPage = await renderOfferPage()
      const scrollView = offerPage.getByTestId('offer-container')
      await act(async () => {
        // 1st scroll to bottom => trigger
        await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
      })
      expect(logConsultWholeOffer).toHaveBeenCalledWith(offerId)

      // @ts-ignore: logConsultWholeOffer is the mock function but is seen as the real function
      logConsultWholeOffer.mockClear()

      await act(async () => {
        // 2nd scroll to bottom => NOT trigger
        await scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
        await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
      })

      expect(logConsultWholeOffer).not.toHaveBeenCalled()
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

const humanizedOfferId = 'AHD3A'
const offerId = dehumanizeId(humanizedOfferId)

async function renderOfferPage(extraOffer?: Partial<Omit<OfferResponse, 'id'>>) {
  server.use(
    rest.get<OfferResponse>(env.API_BASE_URL + `/native/v1/offer/${offerId}`, (req, res, ctx) =>
      res.once(ctx.status(200), ctx.json({ ...offerResponseSnap, ...extraOffer }))
    )
  )

  const wrapper = render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Offer">
          <RootStack.Screen
            name="Offer"
            component={Offer}
            initialParams={{ id: humanizedOfferId }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    )
  )

  await act(async () => {
    await flushAllPromises()
  })

  await waitForExpect(() => {
    expect(wrapper.queryByTestId('offer-container')).toBeTruthy()
  })

  return wrapper
}
