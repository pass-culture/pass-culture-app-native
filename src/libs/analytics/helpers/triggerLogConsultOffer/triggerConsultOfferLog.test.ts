import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { ConsultOfferLogParams } from 'libs/analytics/types'
import { eventMonitoring } from 'libs/monitoring/services'

describe('triggerConsultOfferLog', () => {
  it('should trigger ConsultOffer log when offerId defined', () => {
    const params: ConsultOfferLogParams = { offerId: '123', from: 'home' }

    triggerConsultOfferLog(params)

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, params)
  })

  it('should trigger a sentry error when offerId not defined', () => {
    // @ts-ignore a priori impossible but some logs without offerId returned to the data without reproduction of the bug
    const params: ConsultOfferLogParams = { offerId: undefined, from: 'home' }

    triggerConsultOfferLog(params)

    expect(eventMonitoring.captureException).toHaveBeenNthCalledWith(
      1,
      new Error('Trigger ConsultOffer log without offer id'),
      { extra: { from: 'home', offerId: undefined } }
    )
  })

  it('should not trigger ConsultOffer log when offerId not defined', () => {
    // @ts-ignore a priori impossible but some logs without offerId returned to the data without reproduction of the bug
    const params: ConsultOfferLogParams = { offerId: undefined, from: 'home' }

    triggerConsultOfferLog(params)

    expect(analytics.logConsultOffer).not.toHaveBeenCalled()
  })
})
