import { NavigationContainer } from '@react-navigation/native'
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react-native'
import { rest } from 'msw/'
import React from 'react'
import { Animated, Share } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { Tab } from 'features/navigation/TabBar/TabNavigator'
import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { dehumanizeId } from 'features/offer/services/dehumanizeId'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises } from 'tests/utils'

import { OfferHeader } from '../OfferHeader'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

describe('<OfferHeader />', () => {
  afterEach(async () => {
    jest.clearAllMocks()
    await cleanup()
  })
  it('should render correctly', async () => {
    const { toJSON } = await renderOfferHeader(true)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render all the icons - loggedIn', async () => {
    const offerHeader = await renderOfferHeader(true)
    expect(offerHeader.queryByTestId('icon-back')).toBeTruthy()
    expect(offerHeader.queryByTestId('icon-share')).toBeTruthy()
    expect(offerHeader.queryByTestId('icon-favorite')).toBeTruthy()
  })

  it('should render all the icons - not loggedIn', async () => {
    const offerHeader = await renderOfferHeader(false)
    expect(offerHeader.queryByTestId('icon-back')).toBeTruthy()
    expect(offerHeader.queryByTestId('icon-share')).toBeTruthy()
    expect(offerHeader.queryByTestId('icon-favorite')).toBeTruthy()
  })

  it('should fully display the title at the end of the animation', async () => {
    const { animatedValue, getByTestId } = await renderOfferHeader(true)
    expect(getByTestId('offerHeaderName').props.style.opacity).toBe(0)
    Animated.timing(animatedValue, { duration: 100, toValue: 1, useNativeDriver: false }).start()
    await waitForExpect(() => expect(getByTestId('offerHeaderName').props.style.opacity).toBe(1))
  })

  it('should call Share with the right arguments', async () => {
    const share = jest.spyOn(Share, 'share')
    const { getByTestId } = await renderOfferHeader(true)

    act(() => {
      fireEvent.press(getByTestId('icon-share'))
    })
    expect(share).toHaveBeenCalledTimes(1)
    const url = 'passculture://app.passculture.testing/offer/?id=116656'
    const title =
      'Retrouve Sous les étoiles de Paris - VF chez PATHE BEAUGRENELLE sur le pass Culture'
    expect(share).toHaveBeenCalledWith({ message: title, title, url }, { dialogTitle: title })
  })

  describe('<OfferHeader /> - Analytics', () => {
    it('should log ShareOffer once when clicking on the Share button', async () => {
      const { getByTestId } = await renderOfferHeader(true)

      fireEvent.press(getByTestId('icon-share'))
      expect(analytics.logShareOffer).toHaveBeenCalledTimes(1)
      expect(analytics.logShareOffer).toHaveBeenCalledWith(offerId)

      fireEvent.press(getByTestId('icon-share'))
      fireEvent.press(getByTestId('icon-share'))
      expect(analytics.logShareOffer).toHaveBeenCalledTimes(1)
    })
  })
})

const humanizedOfferId = 'AHD3A'
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const offerId = dehumanizeId(humanizedOfferId)!

async function renderOfferHeader(isLoggedIn: boolean) {
  server.use(
    rest.get<OfferResponse>(env.API_BASE_URL + `/native/v1/offer/${offerId}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(offerResponseSnap))
    )
  )
  mockUseAuthContext.mockImplementation(() => ({ isLoggedIn }))
  const animatedValue = new Animated.Value(0)
  const wrapper = render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen name="Home">
            {() => (
              <OfferHeader
                title="Some very nice offer"
                headerTransition={animatedValue}
                offerId={offerId}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    )
  )
  await act(async () => {
    await flushAllPromises()
  })
  await waitFor(() => wrapper.getByTestId('offerHeaderName'))
  return { ...wrapper, animatedValue }
}
