import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  MAX_ATTEMPTS_COUNTDOWN,
  MAX_RESEND_ATTEMPTS,
  RESEND_ATTEMPTS_KEY,
  RESEND_COOLDOWN_KEY,
  RESEND_COUNTDOWN,
} from 'features/auth/helpers/resendEmail'
import { act, renderHook, waitFor } from 'tests/utils'

import { useResendEmail } from './useResendEmail'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

describe('useResendEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.mocked(AsyncStorage.getItem).mockResolvedValue(null)
    jest.mocked(AsyncStorage.setItem).mockResolvedValue(undefined)
    jest.mocked(AsyncStorage.removeItem).mockResolvedValue(undefined)
  })

  afterEach(() => jest.useRealTimers())

  it('should initialize with no resend cooldown', async () => {
    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => expect(result.current.isInitialized).toBe(true))

    expect(result.current).toStrictEqual({
      resendCountdown: 0,
      resendAttempts: 0,
      isInitialized: true,
      isCooldownActive: false,
      hasReachedMaxAttempts: false,
      isDisabled: false,
      handleResendEmail: expect.any(Function),
    })
  })

  it('should restore the resend state from AsyncStorage', async () => {
    const cooldownEnd = Date.now() + 60_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(cooldownEnd))
      .mockResolvedValueOnce('2')

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => expect(result.current.isInitialized).toBe(true))

    expect(result.current).toStrictEqual({
      resendCountdown: expect.any(Number),
      resendAttempts: 2,
      isInitialized: true,
      isCooldownActive: true,
      hasReachedMaxAttempts: false,
      isDisabled: true,
      handleResendEmail: expect.any(Function),
    })
  })

  it('should remove an expired cooldown from AsyncStorage', async () => {
    const expiredCooldown = Date.now() - 1_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(expiredCooldown))
      .mockResolvedValueOnce('2')

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => expect(result.current.isInitialized).toBe(true))

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(RESEND_COOLDOWN_KEY)
    expect(result.current).toStrictEqual({
      resendCountdown: 0,
      resendAttempts: 2,
      isInitialized: true,
      isCooldownActive: false,
      hasReachedMaxAttempts: false,
      isDisabled: false,
      handleResendEmail: expect.any(Function),
    })
  })

  it('should remove the attempts when the maximum attempts cooldown has expired', async () => {
    const expiredCooldown = Date.now() - 1_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(expiredCooldown))
      .mockResolvedValueOnce(String(MAX_RESEND_ATTEMPTS))

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => expect(result.current.isInitialized).toBe(true))

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(RESEND_COOLDOWN_KEY)
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(RESEND_ATTEMPTS_KEY)

    expect(result.current).toStrictEqual({
      resendCountdown: 0,
      resendAttempts: 0,
      isInitialized: true,
      isCooldownActive: false,
      hasReachedMaxAttempts: false,
      isDisabled: false,
      handleResendEmail: expect.any(Function),
    })
  })

  it('should request a new email and persist the first attempt', async () => {
    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => expect(result.current.isInitialized).toBe(true))

    await act(async () => {
      await result.current.handleResendEmail()
    })

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(RESEND_COOLDOWN_KEY, expect.any(String))
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(RESEND_ATTEMPTS_KEY, '1')

    expect(result.current).toStrictEqual({
      resendCountdown: RESEND_COUNTDOWN,
      resendAttempts: 1,
      isInitialized: true,
      isCooldownActive: true,
      hasReachedMaxAttempts: false,
      isDisabled: true,
      handleResendEmail: expect.any(Function),
    })
  })

  it('should not request a new email during the cooldown', async () => {
    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => expect(result.current.isInitialized).toBe(true))

    await act(async () => {
      await result.current.handleResendEmail()
    })

    jest.clearAllMocks()

    await act(async () => {
      await result.current.handleResendEmail()
    })

    expect(AsyncStorage.setItem).not.toHaveBeenCalled()
    expect(result.current.resendAttempts).toBe(1)
  })

  it('should increment the number of attempts after each request', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null).mockResolvedValueOnce('1')

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => expect(result.current.isInitialized).toBe(true))

    // The cooldown must be manually expired before another request can be made.
    await act(async () => {
      await jest.advanceTimersByTime(RESEND_COUNTDOWN * 1000)
    })

    await act(async () => {
      await result.current.handleResendEmail()
    })

    expect(result.current.resendAttempts).toBe(2)
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(RESEND_ATTEMPTS_KEY, '2')
  })

  it('should use the maximum cooldown after the fifth attempt', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null).mockResolvedValueOnce('4')

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => expect(result.current.isInitialized).toBe(true))

    await act(async () => {
      await result.current.handleResendEmail()
    })

    expect(result.current).toStrictEqual({
      resendCountdown: MAX_ATTEMPTS_COUNTDOWN,
      resendAttempts: MAX_RESEND_ATTEMPTS,
      isInitialized: true,
      isCooldownActive: true,
      hasReachedMaxAttempts: true,
      isDisabled: true,
      handleResendEmail: expect.any(Function),
    })

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      RESEND_ATTEMPTS_KEY,
      String(MAX_RESEND_ATTEMPTS)
    )
  })

  it('should not request a new email after the maximum number of attempts', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null).mockResolvedValueOnce('5')

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => expect(result.current.isInitialized).toBe(true))

    jest.clearAllMocks()

    await act(async () => {
      await result.current.handleResendEmail()
    })

    expect(AsyncStorage.setItem).not.toHaveBeenCalled()
    expect(result.current.resendAttempts).toBe(MAX_RESEND_ATTEMPTS)
  })

  it('should decrease the countdown every second', async () => {
    const cooldownEnd = Date.now() + 10_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(cooldownEnd))
      .mockResolvedValueOnce('1')

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => expect(result.current.isInitialized).toBe(true))

    const initialCountdown = result.current.resendCountdown

    await act(async () => {
      await jest.advanceTimersByTime(1_000)
    })

    expect(result.current.resendCountdown).toBe(initialCountdown - 1)
  })

  it('should reset the cooldown when it expires', async () => {
    const cooldownEnd = Date.now() + 1_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(cooldownEnd))
      .mockResolvedValueOnce('2')

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => expect(result.current.isInitialized).toBe(true))

    await act(async () => {
      await jest.advanceTimersByTime(1_000)
    })

    expect(result.current).toStrictEqual({
      resendCountdown: 0,
      resendAttempts: 2,
      isInitialized: true,
      isCooldownActive: false,
      hasReachedMaxAttempts: false,
      isDisabled: false,
      handleResendEmail: expect.any(Function),
    })
  })

  it('should reset the attempts when the maximum cooldown expires', async () => {
    const cooldownEnd = Date.now() + 1_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(cooldownEnd))
      .mockResolvedValueOnce(String(MAX_RESEND_ATTEMPTS))

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => expect(result.current.isInitialized).toBe(true))

    await act(async () => {
      await jest.advanceTimersByTime(1_000)
    })

    expect(result.current).toStrictEqual({
      resendCountdown: 0,
      resendAttempts: 0,
      isInitialized: true,
      isCooldownActive: false,
      hasReachedMaxAttempts: false,
      isDisabled: false,
      handleResendEmail: expect.any(Function),
    })

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(RESEND_ATTEMPTS_KEY)
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(RESEND_COOLDOWN_KEY)
  })
})
