import { analytics } from 'libs/analytics'
import { act, cleanup } from 'tests/utils'

import { offerId, renderOfferPage } from './renderOfferPageTestUtil'

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
    const offerPage = renderOfferPage()
    const scrollView = offerPage.getByTestId('offer-container')

    act(() => {
      scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
    })
    expect(analytics.logConsultWholeOffer).not.toHaveBeenCalled()

    act(() => {
      scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    })

    expect(analytics.logConsultWholeOffer).toHaveBeenCalledWith(offerId)
  })

  it('should trigger logEvent "ConsultAllOffer" only once', async () => {
    const offerPage = renderOfferPage()
    const scrollView = offerPage.getByTestId('offer-container')
    act(() => {
      // 1st scroll to bottom => trigger
      scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    })
    expect(analytics.logConsultWholeOffer).toHaveBeenCalledWith(offerId)

    // @ts-expect-error: logConsultWholeOffer is the mock function but is seen as the real function
    analytics.logConsultWholeOffer.mockClear()

    act(() => {
      // 2nd scroll to bottom => NOT trigger
      scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
      scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    })

    expect(analytics.logConsultWholeOffer).not.toHaveBeenCalled()
  })
})
