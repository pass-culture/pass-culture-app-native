import React, { useContext, useEffect, useMemo, useReducer } from 'react'

import { CulturalSurveyAnswerEnum } from 'api/gen'
import {
  culturalSurveyReducer,
  initialCulturalSurveyState,
} from 'features/culturalSurvey/context/reducer'
import { Action, CulturalSurveyState } from 'features/culturalSurvey/context/types'
import { createInitialQuestionsList } from 'features/culturalSurvey/helpers/createInitialQuestionsList'
import { useCulturalSurveyQuestionsQuery } from 'features/culturalSurvey/queries/useCulturalSurveyQuestionsQuery'

export interface ICulturalSurveyContext extends CulturalSurveyState {
  dispatch: React.Dispatch<Action>
}

const CulturalSurveyContext = React.createContext<ICulturalSurveyContext | null>(null)

export const CulturalSurveyContextProvider = ({
  children,
}: {
  children: React.JSX.Element | React.JSX.Element[]
}) => {
  const { data: culturalSurveyQuestionsData } = useCulturalSurveyQuestionsQuery()

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
