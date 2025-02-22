import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { ForceUpdate } from './ForceUpdate'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<ForceUpdate/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ForceUpdate />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
