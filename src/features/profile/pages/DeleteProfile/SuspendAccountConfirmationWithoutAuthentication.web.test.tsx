import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { SuspendAccountConfirmationWithoutAuthentication } from './SuspendAccountConfirmationWithoutAuthentication'

jest.spyOn(NavigationHelpers, 'openUrl')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('SuspendAccountConfirmationWithoutAuthentication', () => {
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
