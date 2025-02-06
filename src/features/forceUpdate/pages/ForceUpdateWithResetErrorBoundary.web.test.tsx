import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { ForceUpdateWithResetErrorBoundary } from './ForceUpdateWithResetErrorBoundary'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('features/forceUpdate/helpers/useMinimalBuildNumber')

describe('<ForceUpdateWithResetErrorBoundary/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <ForceUpdateWithResetErrorBoundary resetErrorBoundary={() => null} />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
