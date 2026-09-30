import React from 'react'

import { useResendEmail } from 'features/auth/helpers/useResendEmail'
import { render, checkAccessibilityFor, waitFor } from 'tests/utils/web'

import { LoginWithOneTimePassword } from './LoginWithOneTimePassword'

jest.mock('features/auth/helpers/useResendEmail')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

const mockedUseResendEmail = jest.mocked(useResendEmail)

describe('<LoginWithOneTimePassword />', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockedUseResendEmail.mockReturnValue({
      resendCountdown: 0,
      resendAttempts: 0,
      isInitialized: true,
      isCooldownActive: false,
      hasReachedMaxAttempts: false,
      isDisabled: false,
      handleResendEmail: jest.fn(),
    })
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<LoginWithOneTimePassword />)

      await waitFor(() => {
        expect(container).toHaveTextContent(
          'Saisis le code de vérification que tu as reçu à l’adresse'
        )
      })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
