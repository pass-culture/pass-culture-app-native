import React from 'react'

import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { PersonalData } from './PersonalData'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

jest.mock('features/auth/context/AuthContext')
jest.mock('react-query')

describe('<PersonalData/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<PersonalData />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
