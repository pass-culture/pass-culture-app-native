import { useEffect, useState } from 'react'

import { storage } from 'libs/storage'

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

export const useReviewInAppInformation = () => {
  const [timesReviewHasBeenRequested, setTimesReviewHasBeenRequested] = useState<number | null>(
    null
  )
  const currentDate = Date.now()

  useEffect(() => {
    storage
      .readMultiString(['times_review_has_been_requested', 'first_time_review_has_been_requested'])
      .then(([[, reviewsRequested], [, firstReview]]) => {
        const timesReviewsRequested = parseInt(reviewsRequested || '0')
        setTimesReviewHasBeenRequested(timesReviewsRequested)
        if (timesReviewsRequested === 0) {
          storage.saveObject('first_time_review_has_been_requested', currentDate)
        }
        // After one year we reset dateFirstReview and show review pop-up again
        const dateFirstReview = parseInt(firstReview || currentDate.toString())
        if (dateFirstReview + ONE_YEAR < currentDate) {
          setTimesReviewHasBeenRequested(0)
          storage.saveMultiString([
            ['times_review_has_been_requested', '0'],
            ['first_time_review_has_been_requested', currentDate.toString()],
          ])
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateInformationWhenReviewHasBeenRequested = () => {
    if (typeof timesReviewHasBeenRequested === 'number')
      storage.saveObject('times_review_has_been_requested', timesReviewHasBeenRequested + 1)
  }

  return {
    shouldReviewBeRequested:
      typeof timesReviewHasBeenRequested === 'number' ? timesReviewHasBeenRequested < 4 : false,
    updateInformationWhenReviewHasBeenRequested,
  }
}
