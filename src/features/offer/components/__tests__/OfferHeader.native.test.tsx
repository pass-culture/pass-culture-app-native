import React from 'react'
import { Animated, Share, Platform } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { useAuthContext } from 'features/auth/AuthContext'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { OfferHeader } from 'features/offer/components/OfferHeader'
import { getOfferUrl } from 'features/offer/services/useShareOffer'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render } from 'tests/utils'

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

const mockedUseAuthContext = useAuthContext as jest.Mock
jest.mock('features/auth/AuthContext', () => ({ useAuthContext: jest.fn() }))

// TODO(LucasBeneston): Maybe create only one mockOffer and use it with everywhere (useOffer, etc.)
const mockOffer = offerResponseSnap
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => ({
    data: mockOffer,
  }),
}))

const url = getOfferUrl(offerResponseSnap.id)
const title = "Je t'invite à découvrir une super offre sur le pass Culture\u00a0!"
const message = `Retrouve "${offerResponseSnap.name}" chez "${offerResponseSnap.venue.name}" sur le pass Culture`
const messageWithUrl = `${message}\n\n${url}`

describe('<OfferHeader />', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  describe('Icons', () => {
    it('should render all icons', async () => {
      const offerHeader = await renderOfferHeader()
      expect(offerHeader.queryByTestId('icon-back')).toBeTruthy()
      expect(offerHeader.queryByTestId('icon-share')).toBeTruthy()
      expect(offerHeader.queryByTestId('icon-favorite')).toBeTruthy()
    })
  })

  it('should goBack when we press on the back button', async () => {
    const { getByTestId } = await renderOfferHeader()
    fireEvent.press(getByTestId('icon-back'))
    expect(mockGoBack).toBeCalledTimes(1)
  })

  describe('Animation', () => {
    it('should fully display the title at the end of the animation', async () => {
      const { animatedValue, getByTestId } = await renderOfferHeader()
      const offerHeaderName = getByTestId('offerHeaderName')
      expect(offerHeaderName.props['aria-hidden']).toBeTruthy()
      expect(offerHeaderName.props.style.opacity).toBe(0)

      act(() => {
        Animated.timing(animatedValue, {
          duration: 100,
          toValue: 1,
          useNativeDriver: false,
        }).start()
        jest.advanceTimersByTime(100)
      })

      await waitForExpect(() => {
        expect(offerHeaderName.props['aria-hidden']).toBeFalsy()
        expect(offerHeaderName.props.style.opacity).toBe(1)
      })
    })
  })

  describe('Share', () => {
    it('should call Share with the right arguments on IOS', async () => {
      Platform.OS = 'ios'
      const share = jest.spyOn(Share, 'share')
      const { getByTestId } = await renderOfferHeader()

      fireEvent.press(getByTestId('icon-share'))

      expect(share).toHaveBeenNthCalledWith(
        1,
        { message, title, url },
        { dialogTitle: title, subject: title }
      )
    })

    it('should call Share with the right arguments on Android', async () => {
      Platform.OS = 'android'
      const share = jest.spyOn(Share, 'share')
      const { getByTestId } = await renderOfferHeader()

      fireEvent.press(getByTestId('icon-share'))

      expect(share).toHaveBeenNthCalledWith(
        1,
        { message: messageWithUrl, title, url },
        { dialogTitle: title, subject: title }
      )
    })
  })

  describe('Analytics', () => {
    it('should log OfferVenue once when clicking on the Share button', async () => {
      const { getByTestId } = await renderOfferHeader()

      fireEvent.press(getByTestId('icon-share'))

      expect(analytics.logShareOffer).toHaveBeenNthCalledWith(1, offerResponseSnap.id)
    })
  })
})

async function renderOfferHeader(isLoggedIn?: boolean) {
  mockedUseAuthContext.mockReturnValue({ isLoggedIn: isLoggedIn ?? true })
  const animatedValue = new Animated.Value(0)
  const wrapper = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <OfferHeader
        headerTransition={animatedValue}
        title={offerResponseSnap.name}
        offerId={offerResponseSnap.id}
      />
    )
  )
  return { ...wrapper, animatedValue }
}
