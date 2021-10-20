import { useEffect, useState } from 'react'

import { storage } from 'libs/storage'

export const useReviewInAppInformation = () => {
  const [timesReviewHasBeenRequested, setTimesReviewHasBeenRequested] = useState(0)
  const [shouldReviewBeRequested, setShouldReviewBeRequested] = useState(false)

  useEffect(() => {
    storage
      .readObject('times_review_has_been_requested')
      .then((storageTimesReviewHasBeenRequested) => {
        setTimesReviewHasBeenRequested(storageTimesReviewHasBeenRequested as number)
        setShouldReviewBeRequested((storageTimesReviewHasBeenRequested as number) < 4)
        if ((storageTimesReviewHasBeenRequested as number) === 1) {
          storage.saveObject('first_time_review_has_been_requested', Date.now())
        }
      })
  }, [])

  const updateInformationWhenReviewHasBeenRequested = (hasFlowFinishedSuccessfully: boolean) => {
    if (hasFlowFinishedSuccessfully)
      storage.saveObject('times_review_has_been_requested', timesReviewHasBeenRequested + 1)
  }

  return { shouldReviewBeRequested, updateInformationWhenReviewHasBeenRequested } || {}
}
