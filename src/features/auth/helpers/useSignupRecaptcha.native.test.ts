import { captureMonitoringError } from 'libs/monitoring/errors'
import { ReCaptchaInternalError } from 'libs/recaptcha/errors'
import { renderHook } from 'tests/utils'

import { useSignupRecaptcha } from './useSignupRecaptcha'

jest.mock('libs/monitoring/services')
jest.mock('libs/monitoring/errors')

describe('useSignupRecaptcha', () => {
  it('should return isDoingReCaptchaChallenge to false when there is no network', () => {
    const { result } = renderHook(() =>
      useSignupRecaptcha({
        handleSignup: jest.fn(),
        setErrorMessage: jest.fn(),
        isUserConnected: false,
      })
    )

    expect(result.current.isDoingReCaptchaChallenge).toBe(false)
  })

  it('should call handleSignup when ReCaptcha is successful', () => {
    const handleSignup = jest.fn()
    const { result } = renderHook(() =>
      useSignupRecaptcha({ handleSignup, setErrorMessage: jest.fn(), isUserConnected: true })
    )

    result.current.onReCaptchaSuccess('token', true)

    expect(handleSignup).toHaveBeenCalledWith('token', true)
  })

  it('should log to Sentry when ReCaptcha challenge has failed', async () => {
    const { result } = renderHook(() =>
      useSignupRecaptcha({
        handleSignup: jest.fn(),
        setErrorMessage: jest.fn(),
        isUserConnected: false,
      })
    )

    result.current.onReCaptchaError(ReCaptchaInternalError.UnknownError, 'someError')

    expect(captureMonitoringError).toHaveBeenCalledWith(
      'ReCaptchaUnknownError someError',
      'AcceptCguOnReCaptchaError'
    )
  })

  it('should not log to Sentry when ReCaptcha challenge has failed due to network error', async () => {
    const { result } = renderHook(() =>
      useSignupRecaptcha({
        handleSignup: jest.fn(),
        setErrorMessage: jest.fn(),
        isUserConnected: false,
      })
    )

    result.current.onReCaptchaError(ReCaptchaInternalError.NetworkError, 'someError')

    expect(captureMonitoringError).not.toHaveBeenCalled()
  })

  it('should notifies when ReCaptcha token has expired', async () => {
    const setErrorMessage = jest.fn()
    const { result } = renderHook(() =>
      useSignupRecaptcha({
        handleSignup: jest.fn(),
        setErrorMessage,
        isUserConnected: true,
      })
    )

    result.current.onReCaptchaExpire()

    expect(setErrorMessage).toHaveBeenCalledWith('Le token reCAPTCHA a expiré, tu peux réessayer.')
  })
})
