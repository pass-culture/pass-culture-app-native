import { waitFor } from '@testing-library/react'
import React from 'react'

import { api } from 'api/api'
import { AccountState } from 'api/gen'
import { useSignInMutation } from 'features/auth/queries/useSignInMutation'
import { SignInResponseFailure } from 'features/auth/types'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import * as appleSSOContextModule from 'libs/react-native-apple-sso/appleSSOContext'
import { render } from 'tests/utils/web'

import { AppleSSOCallback } from './AppleSSOCallback'

const mockResetFromRef = jest.fn()
jest.mock('features/navigation/navigationRef', () => ({
  resetFromRef: (...args: unknown[]) => mockResetFromRef(...args),
}))

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: mockRouteParams }),
}))

let mockRouteParams: Record<string, string> | undefined = {}

const mockSignInAsync = jest.fn()
const mockUseSignInMutation = jest.mocked(useSignInMutation)
jest.mock('features/auth/queries/useSignInMutation', () => ({
  useSignInMutation: jest.fn(() => ({ mutateAsync: mockSignInAsync })),
}))

jest.mock('libs/react-native-apple-sso/appleSSOContext', () => ({
  loadAppleSSOContext: jest.fn(),
  clearAppleSSOContext: jest.fn(),
}))

const mockLoadAppleSSOContext = jest.mocked(appleSSOContextModule.loadAppleSSOContext)
const mockClearAppleSSOContext = jest.mocked(
  (appleSSOContextModule as unknown as { clearAppleSSOContext: jest.Mock }).clearAppleSSOContext
)

const mockGetNativeV1OauthState = jest.spyOn(api, 'getNativeV1OauthState')

/** Retrieve the onFailure callback passed to useSignInMutation */
const getOnFailure = (): ((error: SignInResponseFailure) => void) => {
  const lastCall = mockUseSignInMutation.mock.calls.at(-1)
  return lastCall?.[0]?.onFailure as (error: SignInResponseFailure) => void
}

describe('AppleSSOCallback (web)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLoadAppleSSOContext.mockReturnValue({ type: 'login' })
    mockGetNativeV1OauthState.mockResolvedValue({ oauthStateToken: 'fresh-state-token' })
    mockSignInAsync.mockResolvedValue({ accountState: AccountState.ACTIVE })
    mockRouteParams = {}
  })

  it('should call signInAsync with code and a fresh state token', async () => {
    mockRouteParams = { code: 'apple-code', state: 'original-state' }

    render(<AppleSSOCallback />)

    await waitFor(() => {
      expect(mockSignInAsync).toHaveBeenCalledWith({
        authorizationCode: 'apple-code',
        oauthStateToken: 'fresh-state-token',
        provider: 'apple',
      })
    })
  })

  it('should request a fresh state token before calling signIn', async () => {
    mockRouteParams = { code: 'apple-code', state: 'original-state' }

    render(<AppleSSOCallback />)

    await waitFor(() => {
      expect(mockGetNativeV1OauthState).toHaveBeenCalledTimes(1)
    })
  })

  it('should clear SSO context when signIn is called', async () => {
    mockRouteParams = { code: 'apple-code', state: 'oauth-state' }

    render(<AppleSSOCallback />)

    await waitFor(() => {
      expect(mockClearAppleSSOContext).toHaveBeenCalledTimes(1)
    })
  })

  it('should pass doNotNavigateOnSigninSuccess to useSignInMutation', () => {
    mockRouteParams = { code: 'apple-code', state: 'oauth-state' }

    render(<AppleSSOCallback />)

    expect(mockUseSignInMutation).toHaveBeenCalledWith(
      expect.objectContaining({ doNotNavigateOnSigninSuccess: true })
    )
  })

  describe('success navigation', () => {
    it('should reset navigation to TabNavigator when accountState is ACTIVE', async () => {
      mockSignInAsync.mockResolvedValue({ accountState: AccountState.ACTIVE })
      mockRouteParams = { code: 'apple-code', state: 'oauth-state' }

      render(<AppleSSOCallback />)

      await waitFor(() => {
        expect(mockResetFromRef).toHaveBeenCalledWith('TabNavigator')
      })
    })

    it('should reset navigation to AccountStatusScreenHandler when accountState is INACTIVE', async () => {
      mockSignInAsync.mockResolvedValue({ accountState: AccountState.INACTIVE })
      mockRouteParams = { code: 'apple-code', state: 'oauth-state' }

      render(<AppleSSOCallback />)

      await waitFor(() => {
        expect(mockResetFromRef).toHaveBeenCalledWith('AccountStatusScreenHandler')
      })
    })
  })

  describe('error navigation (navigateBack)', () => {
    it('should reset to Login when Apple returns an error', () => {
      mockRouteParams = { error: 'access_denied' }

      render(<AppleSSOCallback />)

      expect(mockResetFromRef).toHaveBeenCalledWith('Login', undefined)
      expect(mockSignInAsync).not.toHaveBeenCalled()
    })

    it('should clear SSO context when navigating back on error', () => {
      mockRouteParams = { error: 'access_denied' }

      render(<AppleSSOCallback />)

      expect(mockClearAppleSSOContext).toHaveBeenCalledTimes(1)
    })

    it('should reset to SignupForm when context type is signup and there is an error', () => {
      mockLoadAppleSSOContext.mockReturnValueOnce({
        type: 'signup',
        params: { from: StepperOrigin.SIGNUP },
      })
      mockRouteParams = { error: 'access_denied' }

      render(<AppleSSOCallback />)

      expect(mockResetFromRef).toHaveBeenCalledWith('SignupForm', { from: StepperOrigin.SIGNUP })
    })

    it('should reset to Login when no code is present', () => {
      mockRouteParams = { state: 'oauth-state' }

      render(<AppleSSOCallback />)

      expect(mockResetFromRef).toHaveBeenCalledWith('Login', undefined)
      expect(mockSignInAsync).not.toHaveBeenCalled()
    })

    it('should reset to Login when no state is present', () => {
      mockRouteParams = { code: 'apple-code' }

      render(<AppleSSOCallback />)

      expect(mockResetFromRef).toHaveBeenCalledWith('Login', undefined)
      expect(mockSignInAsync).not.toHaveBeenCalled()
    })
  })

  it('should do nothing when context is null (sign-in already in progress from previous mount)', () => {
    mockLoadAppleSSOContext.mockReturnValueOnce(null)
    mockRouteParams = { code: 'apple-code', state: 'oauth-state' }

    render(<AppleSSOCallback />)

    expect(mockResetFromRef).not.toHaveBeenCalled()
    expect(mockSignInAsync).not.toHaveBeenCalled()
  })

  it('should not navigate when fresh state token request fails (handled by catch)', async () => {
    mockGetNativeV1OauthState.mockRejectedValueOnce(new Error('Network error'))
    mockRouteParams = { code: 'apple-code', state: 'oauth-state' }

    render(<AppleSSOCallback />)

    await waitFor(() => {
      expect(mockSignInAsync).not.toHaveBeenCalled()
      expect(mockClearAppleSSOContext).toHaveBeenCalledTimes(1)
    })
  })

  describe('handleFailure (SSO_EMAIL_NOT_FOUND)', () => {
    it('should reset to SignupForm with from LOGIN when context type is login', () => {
      mockLoadAppleSSOContext.mockReturnValueOnce({ type: 'login' })
      mockRouteParams = { code: 'apple-code', state: 'oauth-state' }

      render(<AppleSSOCallback />)

      const onFailure = getOnFailure()
      onFailure({
        isSuccess: false,
        provider: 'apple',
        content: {
          code: 'SSO_EMAIL_NOT_FOUND',
          accountCreationToken: 'token-123',
          email: 'user@apple.com',
          general: [],
        },
      })

      expect(mockResetFromRef).toHaveBeenCalledWith('SignupForm', {
        accountCreationToken: 'token-123',
        email: 'user@apple.com',
        from: StepperOrigin.LOGIN,
        ssoProvider: 'apple',
      })
    })

    it('should reset to SignupForm with from SIGNUP when context type is signup', () => {
      mockLoadAppleSSOContext.mockReturnValueOnce({ type: 'signup' })
      mockRouteParams = { code: 'apple-code', state: 'oauth-state' }

      render(<AppleSSOCallback />)

      const onFailure = getOnFailure()
      onFailure({
        isSuccess: false,
        provider: 'apple',
        content: {
          code: 'SSO_EMAIL_NOT_FOUND',
          accountCreationToken: 'token-456',
          email: 'user@apple.com',
          general: [],
        },
      })

      expect(mockResetFromRef).toHaveBeenCalledWith('SignupForm', {
        accountCreationToken: 'token-456',
        email: 'user@apple.com',
        from: StepperOrigin.SIGNUP,
        ssoProvider: 'apple',
      })
    })
  })
})
