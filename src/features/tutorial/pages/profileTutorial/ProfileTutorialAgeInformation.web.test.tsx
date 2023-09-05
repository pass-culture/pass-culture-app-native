import React from 'react'
import { act } from 'react-dom/test-utils'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { ProfileTutorialAgeInformation } from './ProfileTutorialAgeInformation'

describe('<ProfileTutorialAgeInformation/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ProfileTutorialAgeInformation />)

      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
    })
  })
})
