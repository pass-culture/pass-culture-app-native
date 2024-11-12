import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { DeleteProfileAccountNotDeletable } from './DeleteProfileAccountNotDeletable'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('DeleteProfileAccountNotDeletable', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<DeleteProfileAccountNotDeletable />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
