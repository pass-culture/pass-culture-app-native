import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React from 'react'

import { push, navigate } from '__mocks__/@react-navigation/native'
import { CulturalSurveyQuestionEnum } from 'api/gen'
import { useCulturalSurveyQuestions as mockedUseCulturalSurveyQuestions } from 'features/culturalSurvey/api/__mocks__/useCulturalSurveyQuestions'
import { useCulturalSurveyAnswersMutation } from 'features/culturalSurvey/api/useCulturalSurveyAnswers'
import {
  useCulturalSurveyContext,
  dispatch,
} from 'features/culturalSurvey/context/__mocks__/CulturalSurveyContextProvider'
import * as CulturalSurveyContextProviderModule from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { CulturalSurveyQuestions } from 'features/culturalSurvey/pages/CulturalSurveyQuestions'
import { navigateToHome } from 'features/navigation/helpers/__mocks__'
import { CulturalSurveyRootStackParamList } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/firebase/analytics'
import { render, screen, fireEvent, middleScrollEvent, bottomScrollEvent } from 'tests/utils'

jest.mock('features/navigation/helpers')
jest.mock('react-query')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')

const mockedUseCulturalSurveyAnswersMutation = jest.mocked(useCulturalSurveyAnswersMutation)

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
jest.mock('features/culturalSurvey/helpers/useGetNextQuestion', () => ({
  useGetNextQuestion: jest.fn(() => mockUseGetNextQuestionReturnValue),
}))

jest.mock('features/culturalSurvey/api/useCulturalSurveyQuestions')
jest.mock('features/culturalSurvey/api/useCulturalSurveyAnswers')

jest
  .spyOn(CulturalSurveyContextProviderModule, 'useCulturalSurveyContext')
  .mockImplementation(useCulturalSurveyContext)

const mockUseCulturalSurveyAnswersMutation = () => {
  // @ts-ignore we don't use the other properties of useCulturalSurveyAnswersMutation (such as failureCount)
  mockedUseCulturalSurveyAnswersMutation.mockImplementation(({ onError }) => {
    return { mutate: onError }
  })
}

describe('CulturalSurveysQuestions page', () => {
  const { data: questionsFromMockedHook } = mockedUseCulturalSurveyQuestions()
  it('should render the page with correct layout', () => {
    render(<CulturalSurveyQuestions {...navigationProps} />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to next page when pressing Continuer', async () => {
    render(<CulturalSurveyQuestions {...navigationProps} />)

    const NextQuestionButton = screen.getByTestId('Continuer vers l’étape suivante')
    fireEvent.press(NextQuestionButton)

    expect(push).toHaveBeenCalledWith('CulturalSurveyQuestions', {
      question: CulturalSurveyQuestionEnum.ACTIVITES,
    })
  })

  it('should flush answers and navigate to CulturalSurveyThanks if on lastQuestion and API call is successful', async () => {
    mockUseGetNextQuestionReturnValue = {
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.SPECTACLES,
    }
    render(<CulturalSurveyQuestions {...navigationProps} />)

    const NextQuestionButton = screen.getByTestId('Continuer vers l’étape suivante')
    fireEvent.press(NextQuestionButton)

    expect(dispatch).toHaveBeenCalledWith({ type: 'FLUSH_ANSWERS' })
    expect(navigate).toHaveBeenCalledWith('CulturalSurveyThanks')
  })

  it('should navigate to home if on lastQuestion and API call is unsuccessful', () => {
    mockUseGetNextQuestionReturnValue = {
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.SPECTACLES,
    }

    mockUseCulturalSurveyAnswersMutation()

    render(<CulturalSurveyQuestions {...navigationProps} />)

    const NextQuestionButton = screen.getByTestId('Continuer vers l’étape suivante')
    fireEvent.press(NextQuestionButton)

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should dispatch empty answers on go back', () => {
    render(<CulturalSurveyQuestions {...navigationProps} />)

    const GoBackButton = screen.getByTestId('Revenir en arrière')
    fireEvent.press(GoBackButton)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_ANSWERS',
      payload: {
        questionId: navigationProps.route.params.question,
        answers: [],
      },
    })
  })

  it('should updateQuestionsToDisplay on checkbox press if answer pressed has sub_question', () => {
    render(<CulturalSurveyQuestions {...navigationProps} />)

    const CulturalSurveyAnswerCheckbox = screen.getByText(
      // @ts-expect-error mocked Hook is defined
      questionsFromMockedHook.questions[0].answers[0].title
    )
    fireEvent.press(CulturalSurveyAnswerCheckbox)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_QUESTIONS',
      payload: expect.anything(),
    })
  })

  it('should not updateQuestionsToDisplay on checkbox press if answer pressed has no sub_question', () => {
    render(<CulturalSurveyQuestions {...navigationProps} />)

    const CulturalSurveyAnswerCheckbox = screen.getByText(
      // @ts-expect-error mocked Hook is defined
      questionsFromMockedHook?.questions[0].answers[2].title
    )
    fireEvent.press(CulturalSurveyAnswerCheckbox)

    expect(dispatch).not.toHaveBeenCalledWith({
      type: 'SET_QUESTIONS',
      payload: expect.anything(),
    })
  })

  it('should log event CulturalSurveyScrolledToBottom when user reach end of screen', () => {
    render(<CulturalSurveyQuestions {...navigationProps} />)

    const scrollContainer = screen.getByTestId('cultural-survey-questions-scrollview')

    fireEvent.scroll(scrollContainer, middleScrollEvent)
    expect(analytics.logCulturalSurveyScrolledToBottom).toHaveBeenCalledTimes(0)

    fireEvent.scroll(scrollContainer, bottomScrollEvent)
    expect(analytics.logCulturalSurveyScrolledToBottom).toHaveBeenNthCalledWith(1, {
      questionId: CulturalSurveyQuestionEnum.SORTIES,
    })
  })
})
