import React from 'react'

import { reset } from '__mocks__/@react-navigation/native'
import { CulturalSurveyThanks } from 'features/culturalSurvey/pages/CulturalSurveyThanks'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, fireEvent, screen } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('features/navigation/helpers/navigateToHome')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('CulturalSurveyThanksPage page', () => {
  describe('When FF is disabled', () => {
    beforeEach(() => {
      activateFeatureFlags()
    })

    it('should render the page with correct layout and content', () => {
      render(<CulturalSurveyThanks />)

      expect(screen).toMatchSnapshot()
    })

    it('should navigate to home when pressing "Découvrir le catalogue" button', async () => {
      render(<CulturalSurveyThanks />)

      const discoverButton = screen.getByText('Découvrir le catalogue')
      fireEvent.press(discoverButton)

      expect(reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'TabNavigator' }],
      })
    })
  })

  describe('When FF is enabled', () => {
    beforeEach(() => {
      activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY])
    })

    it('should render the page with correct layout and content', () => {
      render(<CulturalSurveyThanks />)

      expect(screen).toMatchSnapshot()
    })

    it('should navigate to IdentityCheckHonor screen when pressing "Continuer" button', async () => {
      render(<CulturalSurveyThanks />)

      const continueButton = screen.getByText('Continuer')
      fireEvent.press(continueButton)

      expect(reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'IdentityCheckHonor' }],
      })
    })
  })
})

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
