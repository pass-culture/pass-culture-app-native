import { useEffect, useState } from 'react'

import { storage } from 'libs/storage'

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

export const useReviewInAppInformation = () => {
  const [timesReviewHasBeenRequested, setTimesReviewHasBeenRequested] = useState(0)
  const [shouldReviewBeRequested, setShouldReviewBeRequested] = useState(false)
  const currentDate = Date.now()

  useEffect(() => {
    storage.readObject('times_review_has_been_requested').then((reviewsRequested) => {
      setTimesReviewHasBeenRequested(reviewsRequested as number)
      setShouldReviewBeRequested((reviewsRequested as number) < 4)
      if ((reviewsRequested as number) === 1) {
        storage.saveObject('first_time_review_has_been_requested', currentDate)
      }
    })

    storage.readObject('first_time_review_has_been_requested').then((firstReview) => {
      if ((firstReview as number) + ONE_YEAR < currentDate) {
        setTimesReviewHasBeenRequested(0)
        storage.saveObject('times_review_has_been_requested', 0)
        storage.saveObject('first_time_review_has_been_requested', currentDate)
      }
    })
  }, [])

  const updateInformationWhenReviewHasBeenRequested = (hasFlowFinishedSuccessfully: boolean) => {
    if (hasFlowFinishedSuccessfully)
      storage.saveObject('times_review_has_been_requested', timesReviewHasBeenRequested + 1)
  }

  return { shouldReviewBeRequested, updateInformationWhenReviewHasBeenRequested } || {}
}
