import { useMemo } from 'react'

import { CulturalSurveyQuestionEnum } from 'api/gen'
import { useCulturalSurveyContext } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'

export function useCulturalSurveyProgress(step: CulturalSurveyQuestionEnum | undefined) {
  const { questionsToDisplay } = useCulturalSurveyContext()

  return useMemo(() => {
    if (!step) return 0
    const stepIndex = questionsToDisplay.indexOf(step)
    if (stepIndex < 0) {
      return 0
    }
    return Math.floor((100 * stepIndex) / questionsToDisplay.length) / 100
  }, [questionsToDisplay, step])
}
