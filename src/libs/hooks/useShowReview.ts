import { useEffect, useRef } from 'react'
import InAppReview from 'react-native-in-app-review'

import { useReviewInAppInformation } from 'features/bookOffer/helpers/useReviewInAppInformation'
import { useAppStateChange } from 'libs/appState'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring'

export const useShowReview = () => {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const disableStoreReview = useFeatureFlag(RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW)

  const { shouldReviewBeRequested, updateInformationWhenReviewHasBeenRequested } =
    useReviewInAppInformation()

  useEffect(() => {
    // In web InAppReview.isAvailable() is false, so we never ask a review from the webapp with this hook
    if (InAppReview.isAvailable() && shouldReviewBeRequested && !disableStoreReview) {
      timeoutRef.current = setTimeout(
        () =>
          InAppReview.RequestInAppReview()
            .then((hasFlowFinishedSuccessfully) => {
              if (hasFlowFinishedSuccessfully) updateInformationWhenReviewHasBeenRequested()
            })
            .catch((error) => {
              eventMonitoring.captureException(error)
            }),
        3000
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReviewBeRequested, disableStoreReview])

  useAppStateChange(
    () => undefined,
    () => {
      clearTimeout(timeoutRef.current)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}
