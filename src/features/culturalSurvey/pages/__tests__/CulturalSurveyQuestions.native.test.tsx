import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React from 'react'
import { mocked } from 'ts-jest/utils'

import { push, navigate } from '__mocks__/@react-navigation/native'
import { CulturalSurveyQuestionEnum } from 'api/gen'
import {
  useCulturalSurveyContext,
  dispatch,
} from 'features/culturalSurvey/context/__mocks__/CulturalSurveyContextProvider'
import * as CulturalSurveyContextProviderModule from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { CulturalSurveyQuestions } from 'features/culturalSurvey/pages/CulturalSurveyQuestions'
import { useCulturalSurveyAnswersMutation } from 'features/culturalSurvey/useCulturalSurvey'
import { navigateToHome } from 'features/navigation/helpers/__mocks__'
import { CulturalSurveyRootStackParamList } from 'features/navigation/RootNavigator'
import { render, fireEvent } from 'tests/utils'

jest.mock('features/navigation/helpers')
jest.mock('react-query')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')

const mockedUseCulturalSurveyAnswersMutation = mocked(useCulturalSurveyAnswersMutation)

const navigationProps = {
  route: {
    params: {
      question: CulturalSurveyQuestionEnum.SORTIES,
    },
  },
  navigation: {},
} as StackScreenProps<CulturalSurveyRootStackParamList, 'CulturalSurveyQuestions'>

let mockUseGetNextQuestionReturnValue = {
  isCurrentQuestionLastQuestion: false,
  nextQuestion: CulturalSurveyQuestionEnum.ACTIVITES,
}
jest.mock('features/culturalSurvey/useGetNextQuestion', () => ({
  useGetNextQuestion: jest.fn(() => mockUseGetNextQuestionReturnValue),
}))

jest.mock('features/culturalSurvey/useCulturalSurvey')

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
      question: CulturalSurveyQuestionEnum.ACTIVITES,
    })
  })

  it('should navigate to CulturalSurveyThanks if on lastQuestion and API call is successful', async () => {
    mockUseGetNextQuestionReturnValue = {
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.SPECTACLES,
    }
    const QuestionsPage = render(<CulturalSurveyQuestions {...navigationProps} />)
    const NextQuestionButton = QuestionsPage.getByTestId('next-cultural-survey-question')
    fireEvent.press(NextQuestionButton)
    expect(navigate).toHaveBeenCalledWith('CulturalSurveyThanks')
  })

  it('should navigate to home if on lastQuestion and API call is unsuccessful', async () => {
    mockUseGetNextQuestionReturnValue = {
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.SPECTACLES,
    }
    // TODO: yorickeando: understand why mutate is called twice in test and remove double implementation
    // @ts-ignore ignore useMutationType
    mockedUseCulturalSurveyAnswersMutation.mockImplementationOnce(({ onError }) => {
      return { mutate: onError }
    })
    // @ts-ignore useMutationType
    mockedUseCulturalSurveyAnswersMutation.mockImplementationOnce(({ onError }) => {
      return { mutate: onError }
    })
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
        questionId: navigationProps.route.params.question,
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
          question: CulturalSurveyQuestionEnum.ACTIVITES,
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
