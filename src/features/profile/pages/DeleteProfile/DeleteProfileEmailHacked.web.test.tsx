import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { DeleteProfileEmailHacked } from './DeleteProfileEmailHacked'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('DeleteProfileEmailHacked', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<DeleteProfileEmailHacked />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
