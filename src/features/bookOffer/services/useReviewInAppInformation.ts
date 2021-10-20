import { useEffect, useState } from 'react'

import { storage } from 'libs/storage'

export const useReviewInAppInformation = () => {
  const [timesReviewHasBeenRequested, setTimesReviewHasBeenRequested] = useState(0)
  const [shouldReviewBeRequested, setShouldReviewBeRequested] = useState(false)
  const currentDate = Date.now()
  const oneYearInMilliseconds = 31536000000

  useEffect(() => {
    storage.readObject('times_review_has_been_requested').then((timesReviewHasBeenRequested) => {
      setTimesReviewHasBeenRequested(timesReviewHasBeenRequested as number)
      setShouldReviewBeRequested((timesReviewHasBeenRequested as number) < 4)
      if ((timesReviewHasBeenRequested as number) === 1) {
        storage.saveObject('first_time_review_has_been_requested', currentDate)
      }
    })

    storage
      .readObject('first_time_review_has_been_requested')
      .then((firstTimeReviewHasBeenRequested) => {
        if ((firstTimeReviewHasBeenRequested as number) + oneYearInMilliseconds < currentDate) {
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
