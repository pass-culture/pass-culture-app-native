import { AppState } from 'react-native'
import { ReactTestInstance } from 'react-test-renderer'

import { analytics } from 'libs/analytics'
import { superFlushWithAct, act, fireEvent, cleanup } from 'tests/utils'

import { offerId, renderOfferPage, renderOfferBodyPage } from './renderOfferPageTestUtil'

describe('<OfferBody /> - Analytics', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  const trigger = (component: ReactTestInstance) => {
    act(() => {
      fireEvent.press(component)
      jest.advanceTimersByTime(300)
    })
  }

  it('should log ConsultAccessibilityModalities once when opening accessibility modalities', async () => {
    const { getByText } = await renderOfferBodyPage()

    trigger(getByText('Accessibilité'))
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultAccessibility).toHaveBeenCalledWith({ offerId })

    trigger(getByText('Accessibilité'))
    trigger(getByText('Accessibilité'))
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultWithdrawalModalities once when opening withdrawal modalities', async () => {
    const { getByText } = await renderOfferBodyPage()

    trigger(getByText('Modalités de retrait'))
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledWith({ offerId })

    trigger(getByText('Modalités de retrait'))
    trigger(getByText('Modalités de retrait'))
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
  })

  // TODO(Lucasbeneston): unskip this test. Make sure the feature works, find when the test was broken and fix it
  it.skip('should trigger logOfferSeenDuration', async () => {
    const offerPage = await renderOfferBodyPage()
    expect(analytics.logOfferSeenDuration).not.toHaveBeenCalled()
    expect(AppState.addEventListener).toHaveBeenCalled()
    await act(async () => {
      await offerPage.unmount()
    })
    expect(analytics.logOfferSeenDuration).toHaveBeenCalledTimes(1)
    expect(AppState.removeEventListener).toHaveBeenCalled()
  })
})

describe('<Offer /> - Analytics', () => {
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

  afterEach(cleanup)

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
    await superFlushWithAct(25)
    expect(analytics.logConsultWholeOffer).toHaveBeenCalledWith(offerId)

    // @ts-expect-error: logConsultWholeOffer is the mock function but is seen as the real function
    analytics.logConsultWholeOffer.mockClear()

    await act(async () => {
      // 2nd scroll to bottom => NOT trigger
      await scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
      await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    })
    await superFlushWithAct(25)

    expect(analytics.logConsultWholeOffer).not.toHaveBeenCalled()
  })
})
