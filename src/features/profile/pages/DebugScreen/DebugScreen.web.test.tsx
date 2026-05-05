import React from 'react'

import { deviceInfoStoreActions } from 'shared/store/deviceInfoStore'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { DebugScreen } from './DebugScreen'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => ({ user: { id: '1234' } }),
}))

jest.mock('features/trustedDevice/helpers/useDeviceMetrics', () => ({
  useDeviceMetrics: () => ({
    resolution: '1080x1920',
    screenZoomLevel: undefined,
    fontScale: 1.5,
  }),
}))

jest.mock('ui/hooks/useVersion', () => ({
  useVersion: () => '1.2.3',
}))

describe('DebugScreen', () => {
  beforeEach(() => {
    deviceInfoStoreActions.setDeviceInfo({
      deviceId: 'device-id',
      source: 'iPhone 13',
      os: 'iOS',
    })
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<DebugScreen />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
