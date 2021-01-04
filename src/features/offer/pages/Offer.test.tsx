import { NavigationContainer } from '@react-navigation/native'
import { act, fireEvent, render } from '@testing-library/react-native'
import { rest } from 'msw/'
import React from 'react'
import { AppState } from 'react-native'
import { QueryClient, UseQueryResult } from 'react-query'
import { ReactTestInstance } from 'react-test-renderer'
import waitForExpect from 'wait-for-expect'

import { OfferResponse, UserProfileResponse } from 'api/gen'
import { mergeOfferData } from 'features/home/atoms/OfferTile'
import { RootStack } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
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
  it('should show accessibilityDetails', async () => {
    let wrapper = await renderOfferPage()
    expect(wrapper.queryByText('Accessibilité')).toBeTruthy()

    wrapper = await renderOfferPage({ accessibility: { visualDisability: false } })
    expect(wrapper.queryByText('Accessibilité')).toBeTruthy()

    wrapper = await renderOfferPage({ accessibility: {} })
    expect(wrapper.queryByText('Accessibilité')).toBeFalsy()
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
    beforeAll(() => {
      jest.useFakeTimers()
    })
    beforeEach(() => {
      jest.clearAllMocks()
    })

    const trigger = (component: ReactTestInstance) => {
      act(() => {
        fireEvent.press(component)
        jest.advanceTimersByTime(300)
      })
    }

    it('should log ConsultAccesibilityModalities once when opening accessibility modalities', async () => {
      const { getByText } = await renderOfferPage()

      trigger(getByText('Accessibilité'))
      expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
      expect(analytics.logConsultAccessibility).toHaveBeenCalledWith(offerId)

      trigger(getByText('Accessibilité'))
      trigger(getByText('Accessibilité'))
      expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
    })
    it('should log ConsultWithdrawalModalities once when opening accessibility modalities', async () => {
      const { getByText } = await renderOfferPage()

      trigger(getByText('Modalités de retrait'))
      expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
      expect(analytics.logConsultWithdrawal).toHaveBeenCalledWith(offerId)

      trigger(getByText('Modalités de retrait'))
      trigger(getByText('Modalités de retrait'))
      expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
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
      expect(analytics.logConsultWholeOffer).not.toHaveBeenCalled()

      await act(async () => {
        await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
      })

      expect(analytics.logConsultWholeOffer).toHaveBeenCalledWith(offerId)
    })

    it('should trigger logEvent "ConsultAllOffer" only once', async () => {
      const offerPage = await renderOfferPage()
      const scrollView = offerPage.getByTestId('offer-container')
      await act(async () => {
        // 1st scroll to bottom => trigger
        await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
      })
      expect(analytics.logConsultWholeOffer).toHaveBeenCalledWith(offerId)

      // @ts-ignore: logConsultWholeOffer is the mock function but is seen as the real function
      analytics.logConsultWholeOffer.mockClear()

      await act(async () => {
        // 2nd scroll to bottom => NOT trigger
        await scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
        await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
      })

      expect(analytics.logConsultWholeOffer).not.toHaveBeenCalled()
    })

    it('should trigger logOfferSeenDuration', async () => {
      const offerPage = await renderOfferPage()
      expect(analytics.logOfferSeenDuration).not.toHaveBeenCalled()
      expect(AppState.addEventListener).toHaveBeenCalled()
      await act(async () => {
        await offerPage.unmount()
      })
      expect(analytics.logOfferSeenDuration).toHaveBeenCalledTimes(1)
      expect(AppState.removeEventListener).toHaveBeenCalled()
    })
  })

  describe('OfferTile to Offer transition', () => {
    it('should open Offer with prepopulated react-query cache', async () => {
      const setup = (queryClient: QueryClient) => {
        queryClient.removeQueries()
        queryClient.setQueryData(
          ['offer', offerId],
          mergeOfferData({
            category: offerResponseSnap.category.label,
            description: offerResponseSnap.description,
            thumbUrl: offerResponseSnap.imageUrl,
            isDuo: offerResponseSnap.isDuo,
            name: offerResponseSnap.name,
            offerId,
          })
        )
      }

      const wrapper = render(
        reactQueryProviderHOC(
          <NavigationContainer>
            <RootStack.Navigator initialRouteName="Offer">
              <RootStack.Screen name="Offer" component={Offer} initialParams={{ id: offerId }} />
            </RootStack.Navigator>
          </NavigationContainer>,
          setup
        )
      )

      const initialSnapshot = wrapper.toJSON()
      expect(wrapper.queryByText('Accessibilité')).toBeFalsy()

      await act(async () => {
        await flushAllPromises()
      })

      await waitForExpect(() => {
        expect(wrapper.queryByTestId('offer-container')).toBeTruthy()
      })

      expect(wrapper.toJSON()).toMatchDiffSnapshot(initialSnapshot)
      expect(wrapper.queryByText('Accessibilité')).toBeTruthy()
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
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const offerId = dehumanizeId(humanizedOfferId)!

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
          <RootStack.Screen name="Offer" component={Offer} initialParams={{ id: offerId }} />
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
