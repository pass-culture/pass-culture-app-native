import React from 'react'

import * as useMinimalBuildNumberModule from 'features/forceUpdate/helpers/useMinimalBuildNumber'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { ForceUpdateWithResetErrorBoundary } from './ForceUpdateWithResetErrorBoundary'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/forceUpdate/helpers/useMinimalBuildNumber')

describe('<ForceUpdateWithResetErrorBoundary/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      jest.spyOn(useMinimalBuildNumberModule, 'useMinimalBuildNumber').mockReturnValueOnce({
        minimalBuildNumber: 10_304_000,
        isLoading: false,
        error: undefined,
      })

      const { container } = render(
        <ForceUpdateWithResetErrorBoundary resetErrorBoundary={() => null} />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
