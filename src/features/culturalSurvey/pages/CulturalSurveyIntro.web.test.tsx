import React from 'react'

import { FAQ_LINK_USER_DATA } from 'features/culturalSurvey/constants'
import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import { openUrl } from 'features/navigation/helpers/openUrl'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

jest.mock('features/culturalSurvey/helpers/useGetNextQuestion')
jest.mock('features/navigation/helpers/openUrl')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('CulturalSurveyIntro page', () => {
  describe('When FF is disabled', () => {
    beforeEach(() => {
      activateFeatureFlags()
    })

    it('should not have basic accessibility issues', async () => {
      const { container } = render(<CulturalSurveyIntro />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should open FAQ url when pressing En savoir plus', () => {
      render(<CulturalSurveyIntro />)

      const FAQButton = screen.getByText('En savoir plus')
      fireEvent.click(FAQButton)

      expect(openUrl).toHaveBeenCalledWith(FAQ_LINK_USER_DATA, undefined, true)
    })
  })

  describe('When FF is enabled', () => {
    beforeEach(() => {
      activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY])
    })

    it('should not have basic accessibility issues', async () => {
      const { container } = render(<CulturalSurveyIntro />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
