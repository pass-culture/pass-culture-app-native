import React from 'react'

import { navigate, reset } from '__mocks__/@react-navigation/native'
import { CulturalSurveyQuestionEnum } from 'api/gen'
import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent, waitFor } from 'tests/utils'

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')
jest.mock('features/culturalSurvey/helpers/useGetNextQuestion')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('CulturalSurveyIntro page', () => {
  describe('When FF is disabled', () => {
    beforeEach(() => {
      setFeatureFlags()
    })

    it('should render the page with correct layout and content', () => {
      render(<CulturalSurveyIntro />)

      expect(screen).toMatchSnapshot()
    })

    it('should navigate to first page when pressing "Commencer le questionnaire" button', async () => {
      render(<CulturalSurveyIntro />)

      const StartButton = screen.getByText('Commencer le questionnaire')
      await user.press(StartButton)

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
          screen: 'CulturalSurveyQuestions',
          params: {
            question: CulturalSurveyQuestionEnum.SORTIES,
          },
        })
      })
    })

    it('should log hasStartedCulturalSurvey event when pressing "Commencer le questionnaire" button', async () => {
      render(<CulturalSurveyIntro />)

      const StartButton = screen.getByText('Commencer le questionnaire')
      await user.press(StartButton)

      expect(analytics.logHasStartedCulturalSurvey).toHaveBeenCalledTimes(1)
    })

    it('should reset navigation and navigate to home when pressing Plus tard', async () => {
      render(<CulturalSurveyIntro />)

      const LaterButton = screen.getByText('Plus tard')
      await user.press(LaterButton)

      expect(reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'TabNavigator' }],
      })
    })

    it('should log hasSkippedCulturalSurvey event when pressing "Plus tard" button', async () => {
      render(<CulturalSurveyIntro />)

      const LaterButton = screen.getByText('Plus tard')
      await user.press(LaterButton)

      expect(analytics.logHasSkippedCulturalSurvey).toHaveBeenCalledTimes(1)
    })

    it('should navigate to FAQWebview when pressing "En savoir plus" button', async () => {
      render(<CulturalSurveyIntro />)

      const FAQButton = screen.getByText('En savoir plus')
      await user.press(FAQButton)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: undefined,
        screen: 'FAQWebview',
      })
    })
  })

  describe('When FF is enabled', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY])
    })

    it('should render the page with correct layout and content', () => {
      render(<CulturalSurveyIntro />)

      expect(screen).toMatchSnapshot()
    })

    it('should goBack when we press on the back button', async () => {
      render(<CulturalSurveyIntro />)

      const goBackButton = screen.getByText('Retour')
      await user.press(goBackButton)

      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })
  })
})
