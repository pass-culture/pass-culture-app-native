import { analytics } from 'libs/analytics/provider'
import { ConsultOfferLogParams } from 'libs/analytics/types'
import { eventMonitoring } from 'libs/monitoring/services'

export function triggerConsultOfferLog(params: ConsultOfferLogParams) {
  if (!params.offerId) {
    eventMonitoring.captureException(new Error(`Trigger ConsultOffer log without offer id`), {
      extra: params,
    })
    return
  }

  const paramsWithStringId: ConsultOfferLogParams = {
    ...params,
    offerId: String(params.offerId),
  }

  analytics.logConsultOffer(paramsWithStringId)
}
