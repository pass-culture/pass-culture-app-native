import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React from 'react'

import { push, reset } from '__mocks__/@react-navigation/native'
import { CulturalSurveyQuestionEnum } from 'api/gen'
import { useCulturalSurveyQuestions as mockedUseCulturalSurveyQuestions } from 'features/culturalSurvey/api/__mocks__/useCulturalSurveyQuestions'
import { useCulturalSurveyAnswersMutation } from 'features/culturalSurvey/api/useCulturalSurveyAnswers'
import {
  useCulturalSurveyContext,
  dispatch,
} from 'features/culturalSurvey/context/__mocks__/CulturalSurveyContextProvider'
import * as CulturalSurveyContextProviderModule from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { CulturalSurveyQuestions } from 'features/culturalSurvey/pages/CulturalSurveyQuestions'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { CulturalSurveyRootStackParamList } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import {
  render,
  screen,
  fireEvent,
  middleScrollEvent,
  bottomScrollEvent,
  waitFor,
} from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/helpers/isAppUrl')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')

const mockRefetchUser = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ refetchUser: mockRefetchUser })),
}))

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

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const { data: questionsFromMockedHook } = mockedUseCulturalSurveyQuestions()

describe('CulturalSurveyQuestions page', () => {
  beforeEach(() => {
    activateFeatureFlags()
  })

  it('should render the page with correct layout', () => {
    render(<CulturalSurveyQuestions {...navigationProps} />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to next page when pressing Continuer', async () => {
    render(<CulturalSurveyQuestions {...navigationProps} />)

    const NextQuestionButton = screen.getByLabelText('Continuer vers l’étape suivante')
    fireEvent.press(NextQuestionButton)

    expect(push).toHaveBeenCalledWith('CulturalSurveyQuestions', {
      question: CulturalSurveyQuestionEnum.ACTIVITES,
    })
  })

  it('should refetch user infos if on lastQuestion and API call is successful', async () => {
    mockUseGetNextQuestionReturnValue = {
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.SPECTACLES,
    }
    render(<CulturalSurveyQuestions {...navigationProps} />)

    const NextQuestionButton = screen.getByLabelText('Valider le formulaire')
    fireEvent.press(NextQuestionButton)

    await waitFor(() => {
      expect(mockRefetchUser).toHaveBeenCalledTimes(1)
    })
  })

  it('should flush answers if on lastQuestion and API call is successful', async () => {
    mockUseGetNextQuestionReturnValue = {
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.SPECTACLES,
    }
    render(<CulturalSurveyQuestions {...navigationProps} />)

    const NextQuestionButton = screen.getByLabelText('Valider le formulaire')
    fireEvent.press(NextQuestionButton)

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({ type: 'FLUSH_ANSWERS' })
    })
  })

  it('should navigate to Home if on lastQuestion and API call is successful and FF ENABLE_CULTURAL_SURVEY_MANDATORY is disabled', async () => {
    mockUseGetNextQuestionReturnValue = {
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.SPECTACLES,
    }
    render(<CulturalSurveyQuestions {...navigationProps} />)

    const NextQuestionButton = screen.getByLabelText('Valider le formulaire')
    fireEvent.press(NextQuestionButton)

    await waitFor(() => {
      expect(reset).toHaveBeenCalledWith({
        index: 1,
        routes: [{ name: navigateToHomeConfig.screen }, { name: 'CulturalSurveyThanks' }],
      })
    })
  })

  it('should navigate to CulturalSurveyThanks if on lastQuestion and API call is successful and FF ENABLE_CULTURAL_SURVEY_MANDATORY is enabled', async () => {
    activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY])
    mockUseGetNextQuestionReturnValue = {
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.SPECTACLES,
    }
    render(<CulturalSurveyQuestions {...navigationProps} />)

    const NextQuestionButton = screen.getByLabelText('Valider le formulaire')
    fireEvent.press(NextQuestionButton)

    await waitFor(() => {
      expect(reset).toHaveBeenCalledWith({
        index: 1,
        routes: [{ name: 'Stepper' }, { name: 'CulturalSurveyThanks' }],
      })
    })
  })

  it('should navigate to home if on lastQuestion and API call is unsuccessful', () => {
    mockUseGetNextQuestionReturnValue = {
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.SPECTACLES,
    }

    mockUseCulturalSurveyAnswersMutation()

    render(<CulturalSurveyQuestions {...navigationProps} />)

    const NextQuestionButton = screen.getByLabelText('Valider le formulaire')
    fireEvent.press(NextQuestionButton)

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should dispatch empty answers on go back', () => {
    render(<CulturalSurveyQuestions {...navigationProps} />)

    const GoBackButton = screen.getByTestId('Revenir en arrière')
    fireEvent.press(GoBackButton)

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_ANSWERS',
      payload: {
        questionId: navigationProps.route.params.question,
        answers: [],
      },
    })
  })

  it('should dispatch default questions on go back when current question is "sorties"', () => {
    render(<CulturalSurveyQuestions {...navigationProps} />)

    const GoBackButton = screen.getByTestId('Revenir en arrière')
    fireEvent.press(GoBackButton)

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'SET_QUESTIONS',
      payload: [
        CulturalSurveyQuestionEnum.SORTIES,
        CulturalSurveyQuestionEnum.ACTIVITES,
        CulturalSurveyQuestionEnum.PROJECTIONS,
      ],
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

    // @ts-expect-error: because of noUncheckedIndexedAccess
    const thirdAnswerTitle = questionsFromMockedHook?.questions[0].answers[2].title as string
    const CulturalSurveyAnswerCheckbox = screen.getByText(thirdAnswerTitle)
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

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
