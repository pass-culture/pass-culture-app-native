import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { ChangeEmailExpiredLink } from './ChangeEmailExpiredLink'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<ChangeEmailExpiredLink/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ChangeEmailExpiredLink />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
