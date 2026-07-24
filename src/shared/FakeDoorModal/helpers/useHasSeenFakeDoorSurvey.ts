import { useEffect, useState } from 'react'

import { storage, StorageKey } from 'libs/storage'
import { getHasSeenFakeDoorSurvey } from 'shared/FakeDoorModal/helpers/getHasSeenFakeDoorSurvey'

export const useHasSeenFakeDoorSurvey = (surveyKey: StorageKey) => {
  const [hasSeenSurvey, setHasSeenSurvey] = useState(false)

  useEffect(() => {
    void getHasSeenFakeDoorSurvey(surveyKey).then(setHasSeenSurvey)
  }, [surveyKey])

  const markHasSeenSurvey = async () => {
    setHasSeenSurvey(true)
    await storage.saveString(surveyKey, 'true')
  }

  return { hasSeenSurvey, markHasSeenSurvey }
}
