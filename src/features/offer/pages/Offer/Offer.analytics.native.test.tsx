import { offerId, renderOfferPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import { analytics } from 'libs/firebase/analytics'
import { superFlushWithAct, act, cleanup } from 'tests/utils'

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
