import { useCallback, useEffect, useState } from 'react'

import { UserProfileResponse } from 'api/gen'
import { storage } from 'libs/storage'

const MAX_NUMBER_OF_DISPLAYS = 3

export function useShouldShowCulturalSurvey() {
  const [numberOfDisplays, setNumberOfDisplays] = useState<number>()

  useEffect(() => {
    storage.readObject<number>('times_cultural_survey_has_been_requested').then((value) => {
      setNumberOfDisplays(value || 0)
    })
  }, [])

  return useCallback(
    (user?: UserProfileResponse) => {
      return numberOfDisplays === undefined
        ? undefined
        : !!user?.needsToFillCulturalSurvey && numberOfDisplays < MAX_NUMBER_OF_DISPLAYS
    },
    [numberOfDisplays]
  )
}
