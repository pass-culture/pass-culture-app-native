import { NativeCategoryIdEnumv2 } from 'api/gen'
import { UseOfferBatchTrackingType } from 'features/offerv2/types'
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
  nativeCategory: NativeCategoryIdEnumv2 | undefined
}

export type UseOfferBatchTrackingType = {
  trackEventHasSeenOfferOnce: VoidFunction
  trackEventHasSeenOfferForSurveyOnce: VoidFunction
  trackBookOfferForSurveyOnce: VoidFunction
  trackCinemaOfferForSurveyOnce: VoidFunction
  trackCulturalVisitOfferForSurveyOnce: VoidFunction
  trackConcertOfferForSurveyOnce: VoidFunction
  shouldTriggerBatchSurveyEvent: boolean
}

export const useOfferBatchTraking = ({
  nativeCategory,
}: Props): UseOfferBatchTrackingType | null => {
  const trackEventHasSeenOfferOnce = useFunctionOnce(trackEventHasSeenOffer)
  const trackEventHasSeenOfferForSurveyOnce = useFunctionOnce(trackEventHasSeenOfferForSurvey)
  const trackBookOfferForSurveyOnce = useFunctionOnce(trackBookOfferForSurvey)
  const trackCinemaOfferForSurveyOnce = useFunctionOnce(trackCinemaOfferForSurvey)
  const trackCulturalVisitOfferForSurveyOnce = useFunctionOnce(trackCulturalVisitOfferForSurvey)
  const trackConcertOfferForSurveyOnce = useFunctionOnce(trackConcertOfferForSurvey)

  if (!nativeCategory) {
    return null
  }

  const shouldTriggerBatchSurveyEvent =
    nativeCategory && OFFER_NATIVE_CATEGORIES_ELIGIBLE_FOR_SURVEY.includes(nativeCategory)

  return {
    trackEventHasSeenOfferOnce,
    trackEventHasSeenOfferForSurveyOnce,
    trackBookOfferForSurveyOnce,
    trackCinemaOfferForSurveyOnce,
    trackCulturalVisitOfferForSurveyOnce,
    trackConcertOfferForSurveyOnce,
    shouldTriggerBatchSurveyEvent,
  }
}
