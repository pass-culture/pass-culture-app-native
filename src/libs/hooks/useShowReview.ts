import { useEffect } from 'react'
import InAppReview from 'react-native-in-app-review'

import { useReviewInAppInformation } from 'features/bookOffer/helpers/useReviewInAppInformation'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring'

export const useShowReview = () => {
  const disableStoreReview = useFeatureFlag(RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW)

  const { shouldReviewBeRequested, updateInformationWhenReviewHasBeenRequested } =
    useReviewInAppInformation()

  useEffect(() => {
    if (InAppReview.isAvailable() && shouldReviewBeRequested && !disableStoreReview) {
      setTimeout(
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
}
