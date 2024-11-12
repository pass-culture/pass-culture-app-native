import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { ExpiredOrLostID } from './ExpiredOrLostID'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<ExpiredOrLostID/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ExpiredOrLostID />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
