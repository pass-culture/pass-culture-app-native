import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { NotificationsSettings } from 'features/profile/pages/NotificationSettings/NotificationsSettings'
import * as usePushPermission from 'features/profile/pages/NotificationSettings/usePushPermission'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
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

const mockUuidV4 = uuidv4 as jest.Mock

describe('NotificationsSettings', () => {
  beforeEach(() => {
    // Keep IDs unique without depending on UUIDs allocated during module imports or other tests.
    let value = 0
    mockUuidV4.mockImplementation(() => `notification-settings-${value++}`)
    setFeatureFlags()
  })

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
