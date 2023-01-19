import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { ReinitializePassword } from './ReinitializePassword'

jest.mock('react-query')

jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

describe('<ReinitializePassword/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderReinitializePassword()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

function renderReinitializePassword() {
  return render(
    <SafeAreaProvider>
      <ReinitializePassword />
    </SafeAreaProvider>
  )
}
