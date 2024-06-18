import React from 'react'

import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { AccountCreated } from './AccountCreated'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/RemoteConfigProvider', () => ({
  useRemoteConfigContext: jest.fn().mockReturnValue({ shouldLogInfo: false }),
}))

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
