import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { CulturalSurveyQuestionEnum } from 'api/gen'
import {
  useCulturalSurveyContext,
  dispatch,
} from 'features/culturalSurvey/context/__mocks__/CulturalSurveyContextProvider'
import * as CulturalSurveyContextProviderModule from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { mockedCulturalSurveyQuestions } from 'features/culturalSurvey/fixtures/mockedCulturalSurveyQuestions'
import { CulturalSurveyQuestions } from 'features/culturalSurvey/pages/CulturalSurveyQuestions'
import { navigateToHome } from 'features/navigation/helpers/__mocks__'
import { CulturalSurveyRootStackParamList } from 'features/navigation/RootNavigator'
import { render, fireEvent } from 'tests/utils'
jest.mock('features/navigation/helpers')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')
jest.mock('features/culturalSurvey/useCulturalSurveyQuestions', () => ({
  useCulturalSurveyQuestions: () => ({
    data: mockedCulturalSurveyQuestions,
  }),
}))

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

jest
  .spyOn(CulturalSurveyContextProviderModule, 'useCulturalSurveyContext')
  .mockImplementation(useCulturalSurveyContext)

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

  // TODO : test will change to 'should navigate to OUTRO' after page implementation
  it('should navigate to home if on lastStep', () => {
    mockUseGetNextStepReturnValue = {
      isCurrentStepLastStep: true,
      nextStep: CulturalSurveyQuestionEnum.SPECTACLES,
    }
    const QuestionsPage = render(<CulturalSurveyQuestions {...navigationProps} />)
    const NextQuestionButton = QuestionsPage.getByTestId('next-cultural-survey-question')
    fireEvent.press(NextQuestionButton)
    expect(navigateToHome).toHaveBeenCalled()
  })

  it('should dispatch empty answers on go back', () => {
    const QuestionsPage = render(<CulturalSurveyQuestions {...navigationProps} />)
    const GoBackButton = QuestionsPage.getByTestId('Revenir en arrière')

    fireEvent.press(GoBackButton)
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_ANSWERS',
      payload: {
        questionId: navigationProps.route.params.step,
        answers: [],
      },
    })
  })

  it('should updateQuestionsToDisplay on checkbox press', () => {
    const QuestionsPage = render(<CulturalSurveyQuestions {...navigationProps} />)
    const CulturalSurveyAnswerCheckboxes = QuestionsPage.getAllByTestId('CulturalSurveyAnswer')

    expect(CulturalSurveyAnswerCheckboxes).not.toBe([])

    fireEvent.press(CulturalSurveyAnswerCheckboxes[0])
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_QUESTIONS',
      payload: expect.anything(),
    })
  })

  it('should not updateQuestionsToDisplay on checkbox press', () => {
    const navigationProps = {
      route: {
        params: {
          step: CulturalSurveyQuestionEnum.ACTIVITES,
        },
      },
      navigation: {},
    } as StackScreenProps<CulturalSurveyRootStackParamList, 'CulturalSurveyQuestions'>
    const QuestionsPage = render(<CulturalSurveyQuestions {...navigationProps} />)

    const CulturalSurveyAnswerCheckboxes = QuestionsPage.getAllByTestId('CulturalSurveyAnswer')

    expect(CulturalSurveyAnswerCheckboxes).not.toBe([])

    fireEvent.press(CulturalSurveyAnswerCheckboxes[0])
    expect(dispatch).not.toHaveBeenCalledWith({
      type: 'SET_QUESTIONS',
      payload: expect.anything(),
    })
  })
})
