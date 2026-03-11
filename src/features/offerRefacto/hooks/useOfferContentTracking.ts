import { useCallback, useEffect } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { SubcategoryIdEnumv2 } from 'api/gen'
import { DELAY_BEFORE_CONSIDERING_PAGE_SEEN } from 'features/offer/constants'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { useFunctionOnce } from 'libs/hooks'

export const useOfferContentTracking = ({
  offerId,
  subcategoryId,
}: {
  offerId: number
  subcategoryId: SubcategoryIdEnumv2
}) => {
  const logConsultWholeOffer = useFunctionOnce(() => {
    void analytics.logConsultWholeOffer(offerId)
  })

  const { shouldTriggerBatchSurveyEvent, trackBatchEvent, trackEventHasSeenOfferOnce } =
    useOfferBatchTracking(subcategoryId)

  useEffect(() => {
    let timeoutId: number
    if (shouldTriggerBatchSurveyEvent) {
      timeoutId = setTimeout(() => {
        trackBatchEvent()
      }, DELAY_BEFORE_CONSIDERING_PAGE_SEEN)
    }

    return () => clearTimeout(timeoutId)
  }, [shouldTriggerBatchSurveyEvent, trackBatchEvent])

  const scrollListener = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom(nativeEvent)) {
        logConsultWholeOffer()
        if (shouldTriggerBatchSurveyEvent) {
          trackBatchEvent()
        }
      }
    },
    [logConsultWholeOffer, shouldTriggerBatchSurveyEvent, trackBatchEvent]
  )

  return {
    scrollListener,
    trackEventHasSeenOfferOnce,
  }
}
