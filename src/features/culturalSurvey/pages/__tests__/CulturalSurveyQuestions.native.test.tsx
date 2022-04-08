import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { CulturalSurveyQuestionEnum } from 'api/gen'
import { CulturalSurveyQuestions } from 'features/culturalSurvey/pages/CulturalSurveyQuestions'
import { CulturalSurveyRootStackParamList } from 'features/navigation/RootNavigator'
import { render, fireEvent } from 'tests/utils'

jest.mock('features/navigation/helpers')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')

const navigationProps = {
  route: {
    params: {
      step: CulturalSurveyQuestionEnum.SORTIES,
    },
  },
  navigation: {},
} as StackScreenProps<CulturalSurveyRootStackParamList, 'CulturalSurveyQuestions'>

describe('CulturalSurveysQuestions page', () => {
  it('should render the page with correct layout', () => {
    const QuestionsPage = render(<CulturalSurveyQuestions {...navigationProps} />)
    expect(QuestionsPage).toMatchSnapshot()
  })

  it('should navigate to next page when pressing Continuer', () => {
    const QuestionsPage = render(<CulturalSurveyQuestions {...navigationProps} />)
    const NextQuestionButton = QuestionsPage.getByTestId('next-cultural-survey-question')
    fireEvent.press(NextQuestionButton)
    expect(push).toHaveBeenCalledWith('CulturalSurveyQuestions', {
      step: CulturalSurveyQuestionEnum.ACTIVITES,
    })
  })
})
