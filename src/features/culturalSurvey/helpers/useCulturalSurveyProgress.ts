import { useMemo } from 'react'

import { useCulturalSurveyContext } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'

import { CulturalSurveyQuestionEnum } from '../../api/gen/api'

export function useCulturalSurveyProgress(step: CulturalSurveyQuestionEnum) {
  const { questionsToDisplay } = useCulturalSurveyContext()
  return useMemo(() => {
    const stepIndex = questionsToDisplay.indexOf(step)
    if (stepIndex < 0) {
      return 0
    }
    return Math.floor((100 * stepIndex) / questionsToDisplay.length) / 100
  }, [questionsToDisplay, step])
}
