import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { CulturalSurveyQuestionEnum } from 'api/gen'
import { CulturalSurveyQuestions } from 'features/culturalSurvey/pages/CulturalSurveyQuestions'
import { navigateToHome } from 'features/navigation/helpers'
import { CulturalSurveyRootStackParamList } from 'features/navigation/RootNavigator'
import { render, fireEvent } from 'tests/utils/web'

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

let mockUseGetNextStepReturnValue = {
  isCurrentStepLastStep: false,
  nextStep: CulturalSurveyQuestionEnum.ACTIVITES,
}
jest.mock('features/culturalSurvey/useGetNextStep', () => ({
  useGetNextStep: jest.fn(() => mockUseGetNextStepReturnValue),
}))

describe('CulturalSurveysQuestions page', () => {
  it('should render the page with correct layout', () => {
    const QuestionsPage = render(<CulturalSurveyQuestions {...navigationProps} />)
    expect(QuestionsPage).toMatchSnapshot()
  })

  it('should navigate to next page when pressing Continuer', () => {
    const QuestionsPage = render(<CulturalSurveyQuestions {...navigationProps} />)
    const NextQuestionButton = QuestionsPage.getByTestId('next-cultural-survey-question')
    fireEvent.click(NextQuestionButton)
    expect(push).toHaveBeenCalledWith('CulturalSurveyQuestions', {
      step: CulturalSurveyQuestionEnum.ACTIVITES,
    })
  })
  // TODO : test will change to 'should navigate to OUTRO' after page implementation
  it('should navigate to home if on lastStep', () => {
    mockUseGetNextStepReturnValue = {
      isCurrentStepLastStep: true,
      nextStep: CulturalSurveyQuestionEnum.SPECTACLES,
    }
    const QuestionsPage = render(<CulturalSurveyQuestions {...navigationProps} />)
    const NextQuestionButton = QuestionsPage.getByTestId('next-cultural-survey-question')
    fireEvent.click(NextQuestionButton)
    expect(navigateToHome).toHaveBeenCalled()
  })
})
