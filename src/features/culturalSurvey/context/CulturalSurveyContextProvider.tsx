import React, { useContext, useMemo, useReducer } from 'react'

import {
  culturalSurveyReducer,
  initialCulturalSurveyState,
} from 'features/culturalSurvey/context/reducer'
import { Action, CulturalSurveyState } from 'features/culturalSurvey/context/types'

export interface ICulturalSurveyContext extends CulturalSurveyState {
  dispatch: React.Dispatch<Action>
}

const CulturalSurveyContext = React.createContext<ICulturalSurveyContext | null>(null)

export const CulturalSurveyContextProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  const [culturalSurveyState, dispatch] = useReducer(
    culturalSurveyReducer,
    initialCulturalSurveyState
  )

  const value = useMemo(
    () => ({ ...culturalSurveyState, dispatch }),
    [culturalSurveyState, dispatch]
  )
  return <CulturalSurveyContext.Provider value={value}>{children}</CulturalSurveyContext.Provider>
}

export const useCulturalSurveyContext = (): ICulturalSurveyContext => {
  return useContext(CulturalSurveyContext) as ICulturalSurveyContext
}
