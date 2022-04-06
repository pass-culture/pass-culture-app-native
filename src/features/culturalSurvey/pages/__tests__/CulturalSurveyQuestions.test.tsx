import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React from 'react'

import { CulturalSurveyQuestionEnum } from 'api/gen'
import { CulturalSurveyQuestions } from 'features/culturalSurvey/pages/CulturalSurveyQuestions'
import { CulturalSurveyRootStackParamList } from 'features/navigation/RootNavigator'
import { render } from 'tests/utils'

const navigationProps = {
  route: {
    params: {
      step: CulturalSurveyQuestionEnum.SORTIES,
    },
  },
  navigation: {},
} as StackScreenProps<CulturalSurveyRootStackParamList, 'CulturalSurveyQuestions'>

jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')
describe('CulturalSurveysQuestions page', () => {
  it('should render the page with correct layout', () => {
    const QuestionsPage = render(<CulturalSurveyQuestions {...navigationProps} />)
    expect(QuestionsPage).toMatchSnapshot()
  })
})
