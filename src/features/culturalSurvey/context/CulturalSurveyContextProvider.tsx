import React, { useContext, useEffect, useMemo, useReducer } from 'react'

import { CulturalSurveyAnswerEnum } from 'api/gen'
import { useCulturalSurveyQuestions } from 'features/culturalSurvey/api/useCulturalSurveyQuestions'
import {
  culturalSurveyReducer,
  initialCulturalSurveyState,
} from 'features/culturalSurvey/context/reducer'
import { Action, CulturalSurveyState } from 'features/culturalSurvey/context/types'
import { createInitialQuestionsList } from 'features/culturalSurvey/helpers/utils'

export interface ICulturalSurveyContext extends CulturalSurveyState {
  dispatch: React.Dispatch<Action>
}

const CulturalSurveyContext = React.createContext<ICulturalSurveyContext | null>(null)

export const CulturalSurveyContextProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  const { data: culturalSurveyQuestionsData } = useCulturalSurveyQuestions()

  const [culturalSurveyState, dispatch] = useReducer(
    culturalSurveyReducer,
    initialCulturalSurveyState
  )

  useEffect(() => {
    if (culturalSurveyQuestionsData?.questions) {
      const questions = createInitialQuestionsList(culturalSurveyQuestionsData)
      const answers = culturalSurveyQuestionsData.questions.map((question) => ({
        questionId: question.id,
        answerIds: [] as CulturalSurveyAnswerEnum[],
      }))
      dispatch({
        type: 'INIT_QUESTION_KEYS',
        payload: { questions, answers },
      })
    }
  }, [culturalSurveyQuestionsData, dispatch])

  const value = useMemo(
    () => ({ ...culturalSurveyState, dispatch }),
    [culturalSurveyState, dispatch]
  )

  return <CulturalSurveyContext.Provider value={value}>{children}</CulturalSurveyContext.Provider>
}

export const useCulturalSurveyContext = (): ICulturalSurveyContext => {
  return useContext(CulturalSurveyContext) as ICulturalSurveyContext
}
