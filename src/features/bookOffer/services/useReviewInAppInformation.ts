import { useEffect, useState } from 'react'

import { storage } from 'libs/storage'

export const useReviewInAppInformation = () => {
  const [timesReviewHasBeenRequested, setTimesReviewHasBeenRequested] = useState(0)
  const [shouldReviewBeRequested, setShouldReviewBeRequested] = useState(false)
  const [firstTimeReviewHasBeenRequested, setFirstTimeReviewHasBeenRequested] = useState('')
  console.log({ firstTimeReviewHasBeenRequested })

  useEffect(() => {
    // Times review has been requested
    storage.readObject('times_review_has_been_requested').then((timesReviewHasBeenRequested) => {
      setTimesReviewHasBeenRequested(timesReviewHasBeenRequested as number)
      setShouldReviewBeRequested((timesReviewHasBeenRequested as number) < 4)
    })

    // Firt time review has been requested date
    storage.readObject('first_time_review_has_been_requested').then((value) => {
      setFirstTimeReviewHasBeenRequested(value as string)
      if (timesReviewHasBeenRequested === 1) {
        setFirstTimeReviewHasBeenRequested('First time !')
      }
    })
  }, [])

  const updateInformationWhenReviewHasBeenRequested = (hasFlowFinishedSuccessfully: boolean) => {
    // TODO (LucasBeneston) : cheat for reset timesReviewHasBeenRequested in storage.
    // storage.saveObject('times_review_has_been_requested', 0)

    if (hasFlowFinishedSuccessfully)
      storage.saveObject('times_review_has_been_requested', timesReviewHasBeenRequested + 1)
  }

  return { shouldReviewBeRequested, updateInformationWhenReviewHasBeenRequested } || {}
}
