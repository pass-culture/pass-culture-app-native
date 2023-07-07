import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { ReinitializePassword } from './ReinitializePassword'

jest.mock('react-query')

const mockV4 = jest.fn()
jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(mockV4),
}))

describe('<ReinitializePassword/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderReinitializePassword()

      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
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
