import { useEffect, useState } from 'react'

import { storage } from 'libs/storage'

export const useReviewInAppInformation = () => {
  const [timesReviewHasBeenRequested, setTimesReviewHasBeenRequested] = useState<number>(0)
  const [shouldReviewBeRequested, setShouldReviewBeRequested] = useState<boolean>(true)

  useEffect(() => {
    storage.readObject('times_review_has_been_requested').then((value) => {
      setTimesReviewHasBeenRequested(value as number)
    })
    setShouldReviewBeRequested(timesReviewHasBeenRequested < 4)
  }, [])

  const updateInformationWhenReviewHasBeenRequested = () => {
    storage.saveObject('times_review_has_been_requested', timesReviewHasBeenRequested + 1)
  }

  return { shouldReviewBeRequested, updateInformationWhenReviewHasBeenRequested } || {}
}
