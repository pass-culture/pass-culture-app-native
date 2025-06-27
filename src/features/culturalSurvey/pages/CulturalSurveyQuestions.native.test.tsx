import React from 'react'

import { push, reset, useRoute } from '__mocks__/@react-navigation/native'
import { CulturalSurveyQuestionEnum } from 'api/gen'
import {
  dispatch,
  useCulturalSurveyContext,
} from 'features/culturalSurvey/context/__mocks__/CulturalSurveyContextProvider'
import * as CulturalSurveyContextProviderModule from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { CulturalSurveyQuestions } from 'features/culturalSurvey/pages/CulturalSurveyQuestions'
import { useCulturalSurveyQuestionsQuery as mockedUseCulturalSurveyQuestions } from 'features/culturalSurvey/queries/__mocks__/useCulturalSurveyQuestionsQuery'
import { useCulturalSurveyAnswersMutation } from 'features/culturalSurvey/queries/useCulturalSurveyAnswersMutation'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import {
  bottomScrollEvent,
  fireEvent,
  middleScrollEvent,
  render,
  screen,
  userEvent,
} from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/helpers/isAppUrl')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')

const mockRefetchUser = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ refetchUser: mockRefetchUser })),
}))

const mockedUseCulturalSurveyAnswersMutation = jest.mocked(useCulturalSurveyAnswersMutation)

useRoute.mockReturnValue({
  params: {
    question: CulturalSurveyQuestionEnum.SORTIES,
  },
})

let mockUseGetNextQuestionReturnValue = {
  isCurrentQuestionLastQuestion: false,
  nextQuestion: CulturalSurveyQuestionEnum.ACTIVITES,
}
jest.mock('features/culturalSurvey/helpers/useGetNextQuestion', () => ({
  useGetNextQuestion: jest.fn(() => mockUseGetNextQuestionReturnValue),
}))

jest.mock('features/culturalSurvey/queries/useCulturalSurveyQuestionsQuery')
jest.mock('features/culturalSurvey/queries/useCulturalSurveyAnswersMutation')

jest
  .spyOn(CulturalSurveyContextProviderModule, 'useCulturalSurveyContext')
  .mockImplementation(useCulturalSurveyContext)

const mockUseCulturalSurveyAnswersMutation = () => {
  // @ts-ignore we don't use the other properties of useCulturalSurveyAnswersMutation (such as failureCount)
  mockedUseCulturalSurveyAnswersMutation.mockImplementation(({ onError }) => {
    return { mutate: onError }
  })
}

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const { data: questionsFromMockedHook } = mockedUseCulturalSurveyQuestions()

const user = userEvent.setup()

jest.useFakeTimers()

describe('CulturalSurveyQuestions page', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render the page with correct layout', () => {
    render(<CulturalSurveyQuestions />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to next page when pressing Continuer', async () => {
    render(<CulturalSurveyQuestions />)

    await user.press(screen.getByLabelText('Continuer vers l’étape suivante'))

    expect(push).toHaveBeenCalledWith('CulturalSurveyQuestions', {
      question: CulturalSurveyQuestionEnum.ACTIVITES,
    })
  })

  it('should refetch user infos if on lastQuestion and API call is successful', async () => {
    mockUseGetNextQuestionReturnValue = {
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.SPECTACLES,
    }
    render(<CulturalSurveyQuestions />)

    await user.press(screen.getByLabelText('Valider le formulaire'))

    expect(mockRefetchUser).toHaveBeenCalledTimes(1)
  })

  it('should flush answers if on lastQuestion and API call is successful', async () => {
    mockUseGetNextQuestionReturnValue = {
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.SPECTACLES,
    }
    render(<CulturalSurveyQuestions />)

    await user.press(screen.getByLabelText('Valider le formulaire'))

    expect(dispatch).toHaveBeenCalledWith({ type: 'FLUSH_ANSWERS' })
  })

  it('should navigate to Home if on lastQuestion and API call is successful and FF ENABLE_CULTURAL_SURVEY_MANDATORY is disabled', async () => {
    mockUseGetNextQuestionReturnValue = {
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.SPECTACLES,
    }
    render(<CulturalSurveyQuestions />)

    await user.press(screen.getByLabelText('Valider le formulaire'))

    expect(reset).toHaveBeenCalledWith({
      index: 1,
      routes: [{ name: navigateToHomeConfig.screen }, { name: 'CulturalSurveyThanks' }],
    })
  })

  it('should navigate to CulturalSurveyThanks if on lastQuestion and API call is successful and FF ENABLE_CULTURAL_SURVEY_MANDATORY is enabled', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY])
    mockUseGetNextQuestionReturnValue = {
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.SPECTACLES,
    }
    render(<CulturalSurveyQuestions />)

    await user.press(screen.getByLabelText('Valider le formulaire'))

    expect(reset).toHaveBeenCalledWith({
      index: 1,
      routes: [{ name: 'Stepper' }, { name: 'CulturalSurveyThanks' }],
    })
  })

  it('should navigate to home if on lastQuestion and API call is unsuccessful', async () => {
    mockUseGetNextQuestionReturnValue = {
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.SPECTACLES,
    }

    mockUseCulturalSurveyAnswersMutation()

    render(<CulturalSurveyQuestions />)

    await user.press(screen.getByLabelText('Valider le formulaire'))

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should dispatch empty answers on go back', async () => {
    render(<CulturalSurveyQuestions />)

    await user.press(screen.getByTestId('Revenir en arrière'))

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_ANSWERS',
      payload: {
        questionId: CulturalSurveyQuestionEnum.SORTIES,
        answers: [],
      },
    })
  })

  it('should dispatch default questions on go back when current question is "sorties"', async () => {
    render(<CulturalSurveyQuestions />)

    await user.press(screen.getByTestId('Revenir en arrière'))

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'SET_QUESTIONS',
      payload: [
        CulturalSurveyQuestionEnum.SORTIES,
        CulturalSurveyQuestionEnum.ACTIVITES,
        CulturalSurveyQuestionEnum.PROJECTIONS,
      ],
    })
  })

  it('should updateQuestionsToDisplay on checkbox press if answer pressed has sub_question', async () => {
    render(<CulturalSurveyQuestions />)

    const CulturalSurveyAnswerCheckbox = screen.getByText(
      // @ts-expect-error mocked Hook is defined
      questionsFromMockedHook.questions[0].answers[0].title
    )
    await user.press(CulturalSurveyAnswerCheckbox)

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_QUESTIONS',
      payload: expect.anything(),
    })
  })

  it('should not updateQuestionsToDisplay on checkbox press if answer pressed has no sub_question', async () => {
    render(<CulturalSurveyQuestions />)

    const thirdAnswerTitle = questionsFromMockedHook?.questions[0]?.answers[2]?.title as string
    const CulturalSurveyAnswerCheckbox = screen.getByText(thirdAnswerTitle)
    await user.press(CulturalSurveyAnswerCheckbox)

    expect(dispatch).not.toHaveBeenCalledWith({
      type: 'SET_QUESTIONS',
      payload: expect.anything(),
    })
  })

  it('should log event CulturalSurveyScrolledToBottom when user reach end of screen', () => {
    render(<CulturalSurveyQuestions />)

    const scrollContainer = screen.getByTestId('cultural-survey-questions-scrollview')

    fireEvent.scroll(scrollContainer, middleScrollEvent)

    expect(analytics.logCulturalSurveyScrolledToBottom).toHaveBeenCalledTimes(0)

    fireEvent.scroll(scrollContainer, bottomScrollEvent)

    expect(analytics.logCulturalSurveyScrolledToBottom).toHaveBeenNthCalledWith(1, {
      questionId: CulturalSurveyQuestionEnum.SORTIES,
    })
  })
})
