import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { DeactivateProfileSuccess } from './DeactivateProfileSuccess'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<DeactivateProfileSuccess/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<DeactivateProfileSuccess />))
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
