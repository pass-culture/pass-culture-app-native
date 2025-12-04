import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { ConsultOfferLogParams } from 'libs/analytics/types'
import { eventMonitoring } from 'libs/monitoring/services'

describe('triggerConsultOfferLog', () => {
  it('should trigger ConsultOffer log when offerId defined', () => {
    const params: ConsultOfferLogParams = {
      offerId: '123',
      from: 'home',
      isHeadline: false,
      displayVideo: true,
    }

    triggerConsultOfferLog(params, 'A')

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, params)
  })

  it('should trigger ConsultOffer log with displayVideo is false when AB testing segment is not A', () => {
    const params: ConsultOfferLogParams = {
      offerId: '123',
      from: 'home',
      isHeadline: false,
      displayVideo: false,
    }

    triggerConsultOfferLog(params, 'B')

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, params)
  })

  it('should trigger a sentry error when offerId not defined', () => {
    // @ts-ignore a priori impossible but some logs without offerId returned to the data without reproduction of the bug
    const params: ConsultOfferLogParams = { offerId: undefined, from: 'home' }

    triggerConsultOfferLog(params, 'A')

    expect(eventMonitoring.captureException).toHaveBeenNthCalledWith(
      1,
      new Error('Trigger ConsultOffer log without offer id'),
      { extra: { from: 'home', offerId: undefined } }
    )
  })

  it('should not trigger ConsultOffer log when offerId not defined', () => {
    // @ts-ignore a priori impossible but some logs without offerId returned to the data without reproduction of the bug
    const params: ConsultOfferLogParams = { offerId: undefined, from: 'home' }

    triggerConsultOfferLog(params, 'A')

    expect(analytics.logConsultOffer).not.toHaveBeenCalled()
  })
})
