import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, checkAccessibilityFor } from 'tests/utils/web'

import { PersonalData } from './PersonalData'

jest.mock('features/auth/context/AuthContext')

describe('<PersonalData/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<PersonalData />))

      await act(async () => {})

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
