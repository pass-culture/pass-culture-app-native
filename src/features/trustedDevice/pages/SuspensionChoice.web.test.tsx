import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { SuspensionChoice } from './SuspensionChoice'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<SuspensionChoice/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SuspensionChoice />, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
