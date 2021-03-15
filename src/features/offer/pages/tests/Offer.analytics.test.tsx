import { act, fireEvent } from '@testing-library/react-native'
import { AppState } from 'react-native'
import { ReactTestInstance } from 'react-test-renderer'

import { analytics } from 'libs/analytics'

import { offerId, renderOfferPage } from './renderOfferPageTestUtil'

allowConsole({ error: true })

describe('<Offer /> - Analytics', () => {
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

  it('should log ConsultAccessibilityModalities once when opening accessibility modalities', async () => {
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
