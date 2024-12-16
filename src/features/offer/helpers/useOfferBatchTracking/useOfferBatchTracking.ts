import { useCallback } from 'react'

import { SubcategoryIdEnumv2 } from 'api/gen'
import { useFunctionOnce } from 'libs/hooks'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'

const trackEventHasSeenOffer = () => BatchProfile.trackEvent(BatchEvent.hasSeenOffer)
const trackEventHasSeenOfferForSurvey = () =>
  BatchProfile.trackEvent(BatchEvent.hasSeenOfferForSurvey)

type UseOfferBatchTrackingType = {
  trackEventHasSeenOfferOnce: VoidFunction
  trackBatchEvent: VoidFunction
  shouldTriggerBatchSurveyEvent: boolean
}

const batchEventForSubcategory: { [key in SubcategoryIdEnumv2]?: BatchEvent } = {
  [SubcategoryIdEnumv2.SEANCE_CINE]: BatchEvent.hasSeenCinemaOfferForSurvey,
  [SubcategoryIdEnumv2.CINE_PLEIN_AIR]: BatchEvent.hasSeenCinemaOfferForSurvey,
  [SubcategoryIdEnumv2.CINE_VENTE_DISTANCE]: BatchEvent.hasSeenCinemaOfferForSurvey,
  [SubcategoryIdEnumv2.VISITE]: BatchEvent.hasSeenCulturalVisitForSurvey,
  [SubcategoryIdEnumv2.VISITE_GUIDEE]: BatchEvent.hasSeenCulturalVisitForSurvey,
  [SubcategoryIdEnumv2.MUSEE_VENTE_DISTANCE]: BatchEvent.hasSeenCulturalVisitForSurvey,
  [SubcategoryIdEnumv2.LIVRE_PAPIER]: BatchEvent.hasSeenBookOfferForSurvey,
  [SubcategoryIdEnumv2.CONCERT]: BatchEvent.hasSeenConcertForSurvey,
  [SubcategoryIdEnumv2.EVENEMENT_MUSIQUE]: BatchEvent.hasSeenConcertForSurvey,
  [SubcategoryIdEnumv2.ABO_CONCERT]: BatchEvent.hasSeenConcertForSurvey,
}

export const useOfferBatchTracking = (
  offerSubcategoryId: SubcategoryIdEnumv2
): UseOfferBatchTrackingType => {
  const trackEventHasSeenOfferOnce = useFunctionOnce(trackEventHasSeenOffer)
  const trackEventHasSeenOfferForSurveyOnce = useFunctionOnce(trackEventHasSeenOfferForSurvey)

  const trackBatchEventForNativeCategoryOnce = useFunctionOnce(() => {
    const batchEvent = batchEventForSubcategory[offerSubcategoryId]
    if (batchEvent) {
      BatchProfile.trackEvent(batchEvent)
    }
  })

  const trackBatchEvent = useCallback(() => {
    trackEventHasSeenOfferForSurveyOnce()
    trackBatchEventForNativeCategoryOnce()
  }, [trackEventHasSeenOfferForSurveyOnce, trackBatchEventForNativeCategoryOnce])

  const shouldTriggerBatchSurveyEvent = offerSubcategoryId in batchEventForSubcategory

  return {
    trackEventHasSeenOfferOnce,
    trackBatchEvent,
    shouldTriggerBatchSurveyEvent,
  }
}
