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

    await waitFor(() => {
      expect(result.current.resendCountdown).toBe(0)
      expect(result.current.resendAttempts).toBe(0)
    })

    expect(result.current.isCooldownActive).toBe(false)
    expect(result.current.hasReachedMaxAttempts).toBe(false)
    expect(result.current.isDisabled).toBe(false)
  })

  it('should restore an active resend cooldown from AsyncStorage', async () => {
    const cooldownEnd = Date.now() + 60_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(cooldownEnd))
      .mockResolvedValueOnce('2')

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => {
      expect(result.current.resendAttempts).toBe(2)
      expect(result.current.resendCountdown).toBeGreaterThan(0)
    })

    expect(result.current.isCooldownActive).toBe(true)
    expect(result.current.hasReachedMaxAttempts).toBe(false)
    expect(result.current.isDisabled).toBe(true)
  })

  it('should remove an expired cooldown and preserve remaining attempts', async () => {
    const expiredCooldown = Date.now() - 1_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(expiredCooldown))
      .mockResolvedValueOnce('2')

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(RESEND_COOLDOWN_KEY)
      expect(result.current.resendCountdown).toBe(0)
      expect(result.current.resendAttempts).toBe(2)
    })

    expect(result.current.isCooldownActive).toBe(false)
    expect(result.current.isDisabled).toBe(false)
    expect(AsyncStorage.removeItem).not.toHaveBeenCalledWith(RESEND_ATTEMPTS_KEY)
  })

  it('should reset attempts when the maximum-attempt cooldown has expired on initialization', async () => {
    const expiredCooldown = Date.now() - 1_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(expiredCooldown))
      .mockResolvedValueOnce(String(MAX_RESEND_ATTEMPTS))

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(RESEND_COOLDOWN_KEY)
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(RESEND_ATTEMPTS_KEY)
      expect(result.current.resendAttempts).toBe(0)
    })

    expect(result.current.resendCountdown).toBe(0)
    expect(result.current.hasReachedMaxAttempts).toBe(false)
    expect(result.current.isDisabled).toBe(false)
  })

  it('should persist the first resend request', async () => {
    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => expect(result.current.resendAttempts).toBe(0))

    await act(async () => {
      await result.current.handleResendEmail()
    })

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(RESEND_COOLDOWN_KEY, expect.any(String))
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(RESEND_ATTEMPTS_KEY, '1')

    expect(result.current.resendCountdown).toBe(RESEND_COUNTDOWN)
    expect(result.current.resendAttempts).toBe(1)
    expect(result.current.isCooldownActive).toBe(true)
    expect(result.current.isDisabled).toBe(true)
  })

  it('should not request a new email during the cooldown', async () => {
    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => expect(result.current.resendAttempts).toBe(0))

    await act(async () => {
      await result.current.handleResendEmail()
    })

    jest.mocked(AsyncStorage.setItem).mockClear()

    await act(async () => {
      await result.current.handleResendEmail()
    })

    expect(AsyncStorage.setItem).not.toHaveBeenCalled()
    expect(result.current.resendAttempts).toBe(1)
  })

  it('should increment the number of attempts after the cooldown expires', async () => {
    const expiredCooldown = Date.now() - 1_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(expiredCooldown))
      .mockResolvedValueOnce('1')

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => {
      expect(result.current.resendAttempts).toBe(1)
      expect(result.current.resendCountdown).toBe(0)
    })

    await act(async () => {
      await result.current.handleResendEmail()
    })

    expect(result.current.resendAttempts).toBe(2)
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(RESEND_ATTEMPTS_KEY, '2')
  })

  it('should use the maximum cooldown after the fifth attempt', async () => {
    const expiredCooldown = Date.now() - 1_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(expiredCooldown))
      .mockResolvedValueOnce(String(MAX_RESEND_ATTEMPTS - 1))

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => {
      expect(result.current.resendAttempts).toBe(MAX_RESEND_ATTEMPTS - 1)
      expect(result.current.resendCountdown).toBe(0)
    })

    await act(async () => {
      await result.current.handleResendEmail()
    })

    expect(result.current.resendCountdown).toBe(MAX_ATTEMPTS_COUNTDOWN)
    expect(result.current.resendAttempts).toBe(MAX_RESEND_ATTEMPTS)
    expect(result.current.hasReachedMaxAttempts).toBe(true)
    expect(result.current.isCooldownActive).toBe(true)
    expect(result.current.isDisabled).toBe(true)

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      RESEND_ATTEMPTS_KEY,
      String(MAX_RESEND_ATTEMPTS)
    )
  })

  it('should not request another email while the maximum-attempt cooldown is active', async () => {
    const cooldownEnd = Date.now() + MAX_ATTEMPTS_COUNTDOWN * 1000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(cooldownEnd))
      .mockResolvedValueOnce(String(MAX_RESEND_ATTEMPTS))

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => {
      expect(result.current.resendAttempts).toBe(MAX_RESEND_ATTEMPTS)
      expect(result.current.hasReachedMaxAttempts).toBe(true)
    })

    jest.mocked(AsyncStorage.setItem).mockClear()

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

    await waitFor(() => {
      expect(result.current.resendCountdown).toBeGreaterThan(0)
    })

    const initialCountdown = result.current.resendCountdown

    await act(async () => {
      jest.advanceTimersByTime(1_000)
    })

    expect(result.current.resendCountdown).toBe(initialCountdown - 1)
  })

  it('should reset the cooldown when it expires without resetting attempts', async () => {
    const cooldownEnd = Date.now() + 1_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(cooldownEnd))
      .mockResolvedValueOnce('2')

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => {
      expect(result.current.resendAttempts).toBe(2)
      expect(result.current.resendCountdown).toBeGreaterThan(0)
    })

    await act(async () => {
      jest.advanceTimersByTime(1_000)
    })

    await waitFor(() => {
      expect(result.current.resendCountdown).toBe(0)
      expect(result.current.isCooldownActive).toBe(false)
    })

    expect(result.current.resendAttempts).toBe(2)
    expect(result.current.isDisabled).toBe(false)
  })

  it('should reset attempts when the maximum cooldown expires', async () => {
    const cooldownEnd = Date.now() + 1_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(cooldownEnd))
      .mockResolvedValueOnce(String(MAX_RESEND_ATTEMPTS))

    const { result } = renderHook(() => useResendEmail())

    await waitFor(() => {
      expect(result.current.resendAttempts).toBe(MAX_RESEND_ATTEMPTS)
      expect(result.current.resendCountdown).toBeGreaterThan(0)
    })

    await act(async () => {
      jest.advanceTimersByTime(1_000)
    })

    await waitFor(() => {
      expect(result.current.resendAttempts).toBe(0)
      expect(result.current.resendCountdown).toBe(0)
    })

    expect(result.current.hasReachedMaxAttempts).toBe(false)
    expect(result.current.isDisabled).toBe(false)
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(RESEND_ATTEMPTS_KEY)
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(RESEND_COOLDOWN_KEY)
  })
})
