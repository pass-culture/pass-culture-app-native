import React from 'react'

import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { AccountCreated } from './AccountCreated'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('libs/firebase/analytics/analytics')

describe('<AccountCreated/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccountCreated />)

      await screen.findByLabelText('On y va !')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
