import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { DebugScreen } from './DebugScreen'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => ({ user: { id: '1234' } }),
}))

jest.mock('features/trustedDevice/helpers/useDeviceInfo', () => ({
  useDeviceInfo: () => ({
    deviceId: 'device-id',
    model: 'model-x',
    os: 'iOS',
    resolution: '1080x1920',
    source: 'app-store',
    screenZoomLevel: 1.2,
  }),
}))

jest.mock('ui/hooks/useVersion', () => ({
  useVersion: () => '1.2.3',
}))

jest.mock('libs/environment/env', () => ({
  env: { COMMIT_HASH: 'abcdef', SUPPORT_EMAIL_ADDRESS: 'support@example.com' },
}))

describe('DebugScreen', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<DebugScreen />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
