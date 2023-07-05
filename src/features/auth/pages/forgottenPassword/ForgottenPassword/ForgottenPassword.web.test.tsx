import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { render, checkAccessibilityFor, screen, waitFor } from 'tests/utils/web'

import { ForgottenPassword } from './ForgottenPassword'

jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

describe('<ForgottenPassword/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderForgottenPassword()

      await waitFor(() => {
        expect(screen.getByTestId('Entrée pour l’email')).toHaveFocus()
      })

      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})

function renderForgottenPassword() {
  return render(
    <SafeAreaProvider>
      <ForgottenPassword />
    </SafeAreaProvider>
  )
}
