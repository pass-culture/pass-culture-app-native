import { rest } from 'msw'

import { SubcategoryIdEnum } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { offerId, renderOfferPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import { analytics } from 'libs/analytics'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { server } from 'tests/server'
import { act, bottomScrollEvent, fireEvent, middleScrollEvent, screen } from 'tests/utils'

server.use(
  rest.get(
    `https://recommmendation-endpoint/similar_offers/${offerResponseSnap.id}`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          hits: [],
        })
      )
    }
  )
)

const BATCH_TRIGGER_DELAY_IN_MS = 5000

jest.useFakeTimers({ legacyFakeTimers: true })

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

  it('should trigger logEvent "ConsultAllOffer" when reaching the end', async () => {
    renderOfferPage()
    const scrollView = screen.getByTestId('offer-container')

    await act(async () => {
      await scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
    })
    expect(analytics.logConsultWholeOffer).not.toHaveBeenCalled()

    await act(async () => {
      await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    })

    expect(analytics.logConsultWholeOffer).toHaveBeenCalledWith(offerId)
  })

  it('should trigger logEvent "ConsultAllOffer" only once', async () => {
    renderOfferPage()
    const scrollView = screen.getByTestId('offer-container')
    await act(async () => {
      // 1st scroll to bottom => trigger
      await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    })
    expect(analytics.logConsultWholeOffer).toHaveBeenCalledWith(offerId)

    // @ts-expect-error: logConsultWholeOffer is the mock function but is seen as the real function
    analytics.logConsultWholeOffer.mockClear()

    await act(async () => {
      // 2nd scroll to bottom => NOT trigger
      await scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
      await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    })

    expect(analytics.logConsultWholeOffer).not.toHaveBeenCalled()
  })

  describe('Batch trigger', () => {
    it('should trigger has_seen_offer_for_survey event after 5 seconds', async () => {
      renderOfferPage()

      await act(() => {})
      jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should not trigger has_seen_offer_for_survey event before 5 seconds have elapsed', async () => {
      renderOfferPage()

      await act(() => {})
      jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS - 1)

      expect(BatchUser.trackEvent).not.toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should trigger has_seen_offer_for_survey event on scroll to bottom', async () => {
      renderOfferPage()

      await act(() => {})
      fireEvent.scroll(screen.getByTestId('offer-container'), bottomScrollEvent)

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should not trigger has_seen_offer_for_survey event on scroll to middle', async () => {
      renderOfferPage()

      await act(() => {})
      fireEvent.scroll(screen.getByTestId('offer-container'), middleScrollEvent)

      expect(BatchUser.trackEvent).not.toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should trigger has_seen_offer_for_survey event once on scroll to bottom and after 5 seconds', async () => {
      renderOfferPage()

      await act(() => {})
      fireEvent.scroll(screen.getByTestId('offer-container'), bottomScrollEvent)
      jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)

      expect(BatchUser.trackEvent).toHaveBeenCalledTimes(3) // Three different Batch events are triggered on this page
      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOffer)
      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenCinemaOfferForSurvey)
    })

    it.each([
      SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
      SubcategoryIdEnum.CONCOURS,
      SubcategoryIdEnum.MATERIEL_ART_CREATIF,
      SubcategoryIdEnum.CARTE_JEUNES,
    ])(
      'should not trigger has_seen_offer_for_survey event for uneligible offer type %s',
      async (subcategoryId) => {
        renderOfferPage(undefined, { subcategoryId })

        await act(() => {})
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)

        expect(BatchUser.trackEvent).not.toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
      }
    )

    it.each`
      subcategoryId                       | expectedBatchEvent
      ${SubcategoryIdEnum.CINE_PLEIN_AIR} | ${BatchEvent.hasSeenCinemaOfferForSurvey}
      ${SubcategoryIdEnum.VISITE}         | ${BatchEvent.hasSeenCulturalVisitForSurvey}
      ${SubcategoryIdEnum.LIVRE_PAPIER}   | ${BatchEvent.hasSeenBookOfferForSurvey}
      ${SubcategoryIdEnum.CONCERT}        | ${BatchEvent.hasSeenConcertForSurvey}
    `(
      'should trigger has_seen_offer_for_survey and specific batch event for offer type $subcategoryId',
      async ({ subcategoryId, expectedBatchEvent }) => {
        renderOfferPage(undefined, { subcategoryId })

        await act(() => {})
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)

        expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
        expect(BatchUser.trackEvent).toHaveBeenCalledWith(expectedBatchEvent)
      }
    )
  })
})
