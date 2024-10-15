import { useCallback, useEffect, useState } from 'react'

import { UserProfileResponse } from 'api/gen'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'

const MAX_NUMBER_OF_DISPLAYS = 3

export function useShouldShowCulturalSurvey() {
  const isCulturalSurveyInIdentityCheck = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY
  )

  const [numberOfDisplays, setNumberOfDisplays] = useState<number>()

  useEffect(() => {
    storage.readObject<number>('times_cultural_survey_has_been_requested').then((value) => {
      setNumberOfDisplays(value || 0)
    })
  }, [])

  return useCallback(
    (user?: UserProfileResponse) => {
      const isNumberOfDisplaysUndefined = numberOfDisplays === undefined

      if (isNumberOfDisplaysUndefined || isCulturalSurveyInIdentityCheck) {
        return undefined
      }

      const doesUserNeedToFillSurvey = !!user?.needsToFillCulturalSurvey
      const hasRemainingDisplays = numberOfDisplays < MAX_NUMBER_OF_DISPLAYS

      return doesUserNeedToFillSurvey && hasRemainingDisplays
    },
    [numberOfDisplays, isCulturalSurveyInIdentityCheck]
  )
}
