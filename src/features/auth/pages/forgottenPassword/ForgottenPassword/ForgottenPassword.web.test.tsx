import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { mockSettings } from 'features/auth/context/mockSettings'
import { render, checkAccessibilityFor, screen, waitFor } from 'tests/utils/web'

import { ForgottenPassword } from './ForgottenPassword'

// Fix the error "IDs used in ARIA and labels must be unique (duplicate-id-aria)" because the UUIDV4 mock return "testUuidV4"
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})
mockSettings()

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
