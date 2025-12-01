import { analytics } from 'libs/analytics/provider'
import { ConsultOfferLogParams } from 'libs/analytics/types'
import { eventMonitoring } from 'libs/monitoring/services'
import { SegmentResult } from 'shared/useABSegment/useABSegment'

export function triggerConsultOfferLog(params: ConsultOfferLogParams, segment: SegmentResult) {
  if (!params.offerId) {
    eventMonitoring.captureException(new Error(`Trigger ConsultOffer log without offer id`), {
      extra: params,
    })
    return
  }

  const paramsWithStringId: ConsultOfferLogParams = {
    ...params,
    offerId: params.offerId.toString(),
    fromOfferId: params.fromOfferId?.toString(),
    fromMultivenueOfferId: params.fromMultivenueOfferId?.toString(),
    isHeadline: params.isHeadline === true,
    displayVideo: segment === 'A',
  }

  void analytics.logConsultOffer(paramsWithStringId)
}
