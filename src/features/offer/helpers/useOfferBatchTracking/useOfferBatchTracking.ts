import { useCallback } from 'react'

import { NativeCategoryIdEnumv2 } from 'api/gen'
import { useFunctionOnce } from 'libs/hooks'
import { BatchUser, BatchEvent } from 'libs/react-native-batch'

const trackEventHasSeenOffer = () => BatchUser.trackEvent(BatchEvent.hasSeenOffer)
const trackEventHasSeenOfferForSurvey = () => BatchUser.trackEvent(BatchEvent.hasSeenOfferForSurvey)
const trackBookOfferForSurvey = () => BatchUser.trackEvent(BatchEvent.hasSeenBookOfferForSurvey)
const trackCinemaOfferForSurvey = () => BatchUser.trackEvent(BatchEvent.hasSeenCinemaOfferForSurvey)
const trackCulturalVisitOfferForSurvey = () =>
  BatchUser.trackEvent(BatchEvent.hasSeenCulturalVisitForSurvey)
const trackConcertOfferForSurvey = () => BatchUser.trackEvent(BatchEvent.hasSeenConcertForSurvey)

const OFFER_NATIVE_CATEGORIES_ELIGIBLE_FOR_SURVEY = [
  NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
  NativeCategoryIdEnumv2.VISITES_CULTURELLES,
  NativeCategoryIdEnumv2.LIVRES_PAPIER,
  NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS,
]

type Props = {
  nativeCategory: NativeCategoryIdEnumv2
}

type UseOfferBatchTrackingType = {
  trackEventHasSeenOfferOnce: VoidFunction
  trackBatchEvent: VoidFunction
  shouldTriggerBatchSurveyEvent: boolean
}

export const useOfferBatchTraking = ({ nativeCategory }: Props): UseOfferBatchTrackingType => {
  const trackEventHasSeenOfferOnce = useFunctionOnce(trackEventHasSeenOffer)
  const trackEventHasSeenOfferForSurveyOnce = useFunctionOnce(trackEventHasSeenOfferForSurvey)
  const trackBookOfferForSurveyOnce = useFunctionOnce(trackBookOfferForSurvey)
  const trackCinemaOfferForSurveyOnce = useFunctionOnce(trackCinemaOfferForSurvey)
  const trackCulturalVisitOfferForSurveyOnce = useFunctionOnce(trackCulturalVisitOfferForSurvey)
  const trackConcertOfferForSurveyOnce = useFunctionOnce(trackConcertOfferForSurvey)

  const trackBatchEvent = useCallback(() => {
    trackEventHasSeenOfferForSurveyOnce()

    if (nativeCategory === NativeCategoryIdEnumv2.LIVRES_PAPIER) {
      trackBookOfferForSurveyOnce()
    }

    if (nativeCategory === NativeCategoryIdEnumv2.VISITES_CULTURELLES) {
      trackCulturalVisitOfferForSurveyOnce()
    }

    if (nativeCategory === NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS) {
      trackConcertOfferForSurveyOnce()
    }

    if (nativeCategory === NativeCategoryIdEnumv2.SEANCES_DE_CINEMA) {
      trackCinemaOfferForSurveyOnce()
    }
  }, [
    nativeCategory,
    trackBookOfferForSurveyOnce,
    trackCinemaOfferForSurveyOnce,
    trackConcertOfferForSurveyOnce,
    trackCulturalVisitOfferForSurveyOnce,
    trackEventHasSeenOfferForSurveyOnce,
  ])

  const shouldTriggerBatchSurveyEvent =
    nativeCategory && OFFER_NATIVE_CATEGORIES_ELIGIBLE_FOR_SURVEY.includes(nativeCategory)

  return {
    trackEventHasSeenOfferOnce,
    trackBatchEvent,
    shouldTriggerBatchSurveyEvent,
  }
}
