import { useEffect } from 'react'
import InAppReview from 'react-native-in-app-review'

import { useReviewInAppInformation } from 'features/bookOffer/services/useReviewInAppInformation'
import { eventMonitoring } from 'libs/monitoring'

export const useShowReview = () => {
  const { shouldReviewBeRequested, updateInformationWhenReviewHasBeenRequested } =
    useReviewInAppInformation()

  useEffect(() => {
    if (InAppReview.isAvailable() && shouldReviewBeRequested) {
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
  }, [shouldReviewBeRequested])
}
