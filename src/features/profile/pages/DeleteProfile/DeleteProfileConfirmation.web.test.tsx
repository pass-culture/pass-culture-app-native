import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { DeleteProfileConfirmation } from './DeleteProfileConfirmation'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('libs/firebase/analytics/analytics')

jest.spyOn(NavigationHelpers, 'openUrl')
jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('DeleteProfileConfirmation', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<DeleteProfileConfirmation />))
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
