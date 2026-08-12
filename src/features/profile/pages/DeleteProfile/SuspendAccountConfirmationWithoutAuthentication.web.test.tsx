import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { SuspendAccountConfirmationWithoutAuthentication } from './SuspendAccountConfirmationWithoutAuthentication'

jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

describe('SuspendAccountConfirmationWithoutAuthentication', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        reactQueryProviderHOC(<SuspendAccountConfirmationWithoutAuthentication />)
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
