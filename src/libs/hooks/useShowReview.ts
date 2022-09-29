import { useEffect } from 'react'
import InAppReview from 'react-native-in-app-review'

import { useAppSettings } from 'features/auth/settings'
import { useReviewInAppInformation } from 'features/bookOffer/services/useReviewInAppInformation'
import { eventMonitoring } from 'libs/monitoring'

export const useShowReview = () => {
  const { data: settings } = useAppSettings()
  const disableStoreReview = settings?.disableStoreReview

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
