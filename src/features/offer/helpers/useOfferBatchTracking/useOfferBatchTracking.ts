import { useCallback } from 'react'

import { NativeCategoryIdEnumv2 } from 'api/gen'
import { useFunctionOnce } from 'libs/hooks'
import { BatchUser, BatchEvent } from 'libs/react-native-batch'

const trackEventHasSeenOffer = () => BatchUser.trackEvent(BatchEvent.hasSeenOffer)
const trackEventHasSeenOfferForSurvey = () => BatchUser.trackEvent(BatchEvent.hasSeenOfferForSurvey)

type Props = {
  offerNativeCategory: NativeCategoryIdEnumv2
}

type UseOfferBatchTrackingType = {
  trackEventHasSeenOfferOnce: VoidFunction
  trackBatchEvent: VoidFunction
  shouldTriggerBatchSurveyEvent: boolean
}

const batchEventForNativeCategory: { [key in NativeCategoryIdEnumv2]?: BatchEvent } = {
  [NativeCategoryIdEnumv2.SEANCES_DE_CINEMA]: BatchEvent.hasSeenCinemaOfferForSurvey,
  [NativeCategoryIdEnumv2.VISITES_CULTURELLES]: BatchEvent.hasSeenCulturalVisitForSurvey,
  [NativeCategoryIdEnumv2.LIVRES_PAPIER]: BatchEvent.hasSeenBookOfferForSurvey,
  [NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS]: BatchEvent.hasSeenConcertForSurvey,
}

export const useOfferBatchTracking = ({
  offerNativeCategory,
}: Props): UseOfferBatchTrackingType => {
  const trackEventHasSeenOfferOnce = useFunctionOnce(trackEventHasSeenOffer)
  const trackEventHasSeenOfferForSurveyOnce = useFunctionOnce(trackEventHasSeenOfferForSurvey)

  const trackBatchEventForNativeCategoryOnce = useFunctionOnce(() => {
    const batchEvent = batchEventForNativeCategory[offerNativeCategory]
    if (batchEvent) {
      BatchUser.trackEvent(batchEvent)
    }
  })

  const trackBatchEvent = useCallback(() => {
    trackEventHasSeenOfferForSurveyOnce()
    trackBatchEventForNativeCategoryOnce()
  }, [trackEventHasSeenOfferForSurveyOnce, trackBatchEventForNativeCategoryOnce])

  const shouldTriggerBatchSurveyEvent =
    offerNativeCategory && offerNativeCategory in batchEventForNativeCategory

  return {
    trackEventHasSeenOfferOnce,
    trackBatchEvent,
    shouldTriggerBatchSurveyEvent,
  }
}
