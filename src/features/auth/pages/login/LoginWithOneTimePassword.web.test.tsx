import React from 'react'

import { useOneTimePasswordAttempts } from 'features/auth/helpers/useOneTimePasswordAttempts'
import { useResendEmail } from 'features/auth/helpers/useResendEmail'
import { render, checkAccessibilityFor, waitFor } from 'tests/utils/web'

import { LoginWithOneTimePassword } from './LoginWithOneTimePassword'

const mockHandleResendEmail = jest.fn()
const mockRegisterFailedAttempt = jest.fn()
const mockClearCodeError = jest.fn()

jest.mock('features/auth/helpers/useResendEmail')

jest.mock('features/auth/helpers/useOneTimePasswordAttempts', () => ({
  useOneTimePasswordAttempts: jest.fn(),
}))

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

const mockedUseResendEmail = jest.mocked(useResendEmail)
const mockedUseOneTimePasswordAttempts = jest.mocked(useOneTimePasswordAttempts)

const getDefaultResendState = () => ({
  resendCountdown: 0,
  resendAttempts: 0,
  isInitialized: true,
  isCooldownActive: false,
  hasReachedMaxAttempts: false,
  isDisabled: false,
  handleResendEmail: mockHandleResendEmail,
})

const getDefaultCodeAttemptsState = () => ({
  failedAttempts: 0,
  codeError: undefined,
  remainingSeconds: 0,
  registerFailedAttempt: mockRegisterFailedAttempt,
  clearCodeError: mockClearCodeError,
  hasReachedMaxCodeAttempts: false,
  isLastAttempt: false,
  maxCodeAttempts: 5,
  loginEmail: 'adresse@mail.com',
  saveLoginEmail: jest.fn(),
})

describe('<LoginWithOneTimePassword />', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockRegisterFailedAttempt.mockResolvedValue(false)
    mockHandleResendEmail.mockResolvedValue(undefined)

    mockedUseResendEmail.mockReturnValue(getDefaultResendState())
    mockedUseOneTimePasswordAttempts.mockReturnValue(getDefaultCodeAttemptsState())
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
