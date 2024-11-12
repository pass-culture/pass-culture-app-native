import { analytics } from 'libs/analytics'
import { ConsultOfferLogParams } from 'libs/analytics/types'
import { eventMonitoring } from 'libs/monitoring'

export function triggerConsultOfferLog(params: ConsultOfferLogParams) {
  if (!params.offerId) {
    eventMonitoring.captureException(new Error(`Trigger ConsultOffer log without offer id`), {
      extra: params,
    })
    return
  }

  analytics.logConsultOffer(params)
}
