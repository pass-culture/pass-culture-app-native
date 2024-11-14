import React from 'react'
import { act } from 'react-test-renderer'

import { navigate, reset } from '__mocks__/@react-navigation/native'
import { CulturalSurveyQuestionEnum } from 'api/gen'
import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')
jest.mock('features/culturalSurvey/helpers/useGetNextQuestion')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')

const CULTURAL_SURVEY_DISPLAYS_STORAGE_KEY = 'times_cultural_survey_has_been_requested'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('CulturalSurveyIntro page', () => {
  beforeEach(() => {
    storage.clear(CULTURAL_SURVEY_DISPLAYS_STORAGE_KEY)
  })

  describe('When FF is disabled', () => {
    beforeEach(() => {
      activateFeatureFlags()
    })

    it('should render the page with correct layout and content', () => {
      render(<CulturalSurveyIntro />)

      expect(screen).toMatchSnapshot()
    })

    it('should navigate to first page when pressing "Commencer le questionnaire" button', async () => {
      render(<CulturalSurveyIntro />)

      const StartButton = screen.getByText('Commencer le questionnaire')
      fireEvent.press(StartButton)

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('CulturalSurveyQuestions', {
          question: CulturalSurveyQuestionEnum.SORTIES,
        })
      })
    })

    it('should log hasStartedCulturalSurvey event when pressing "Commencer le questionnaire" button', () => {
      render(<CulturalSurveyIntro />)

      const StartButton = screen.getByText('Commencer le questionnaire')
      fireEvent.press(StartButton)

      expect(analytics.logHasStartedCulturalSurvey).toHaveBeenCalledTimes(1)
    })

    it('should reset navigation and navigate to home when pressing Plus tard', async () => {
      render(<CulturalSurveyIntro />)

      const LaterButton = screen.getByText('Plus tard')
      fireEvent.press(LaterButton)

      await waitFor(() => {
        expect(reset).toHaveBeenCalledWith({
          index: 0,
          routes: [{ name: 'TabNavigator' }],
        })
      })
    })

    it('should log hasSkippedCulturalSurvey event when pressing "Plus tard" button', async () => {
      render(<CulturalSurveyIntro />)

      const LaterButton = screen.getByText('Plus tard')
      await act(() => {
        fireEvent.press(LaterButton)
      })

      expect(analytics.logHasSkippedCulturalSurvey).toHaveBeenCalledTimes(1)
    })

    it('should navigate to FAQWebview when pressing "En savoir plus" button', () => {
      render(<CulturalSurveyIntro />)

      const FAQButton = screen.getByText('En savoir plus')
      fireEvent.press(FAQButton)

      expect(navigate).toHaveBeenCalledWith('FAQWebview', undefined)
    })

    it('should increment number of times cultural survey has been seen', async () => {
      render(<CulturalSurveyIntro />)
      await screen.findByText('Plus tard')

      render(<CulturalSurveyIntro />)
      await screen.findByText('Plus tard')

      const numberOfCulturalSurveyDisplays = await storage.readObject(
        CULTURAL_SURVEY_DISPLAYS_STORAGE_KEY
      )

      expect(numberOfCulturalSurveyDisplays).toEqual(2)
    })
  })

  describe('When FF is enabled', () => {
    beforeEach(() => {
      activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY])
    })

    it('should render the page with correct layout and content', () => {
      render(<CulturalSurveyIntro />)

      expect(screen).toMatchSnapshot()
    })

    it('should goBack when we press on the back button', async () => {
      render(<CulturalSurveyIntro />)

      const goBackButton = screen.getByText('Retour')
      fireEvent.press(goBackButton)

      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })
  })
})

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
