import React from 'react'

import { NotificationsSettings } from 'features/profile/pages/NotificationSettings/NotificationsSettings'
import * as usePushPermission from 'features/profile/pages/NotificationSettings/usePushPermission'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, waitFor } from 'tests/utils/web'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('libs/react-native-device-info/getDeviceId')
// Fix the error "IDs used in ARIA and labels must be unique (duplicate-id-aria)" because the UUIDV4 mock return "testUuidV4"
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

jest.spyOn(usePushPermission, 'usePushPermission').mockReturnValue({
  pushPermission: 'granted',
  refreshPermission: jest.fn(),
})

jest.mock('libs/firebase/analytics/analytics')

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('NotificationsSettings', () => {
  it('should render correctly', () => {
    const { container } = render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(container).toMatchSnapshot()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<NotificationsSettings />))

      const results = await checkAccessibilityFor(container)

      await waitFor(async () => {
        expect(results).toHaveNoViolations()
      })
    })
  })
})
