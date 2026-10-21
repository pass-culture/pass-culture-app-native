import AsyncStorage from '@react-native-async-storage/async-storage'

import { maskEmail } from 'features/auth/helpers/maskEmail'
import { act, renderHook, waitFor } from 'tests/utils'

import { useOneTimePasswordAttempts } from './useOneTimePasswordAttempts'

jest.mock('features/auth/helpers/maskEmail', () => ({
  maskEmail: jest.fn(() => 'ad*****@mail.com'),
}))

const CODE_ATTEMPTS_KEY = 'login-one-time-password-failed-attempts'
const CODE_COOLDOWN_KEY = 'login-one-time-password-cooldown'
const LOGIN_EMAIL_KEY = 'login-one-time-password-email'

const CODE_COOLDOWN_DURATION = 60 * 60
const EMAIL = 'adresse@mail.com'
const MASKED_EMAIL = 'ad*****@mail.com'

const asyncStorageGetItemSpy = jest.spyOn(AsyncStorage, 'getItem')
const asyncStorageSetItemSpy = jest.spyOn(AsyncStorage, 'setItem')
const asyncStorageRemoveItemSpy = jest.spyOn(AsyncStorage, 'removeItem')

const mockStoredValues = ({
  attempts = null,
  cooldown = null,
  email = null,
}: {
  attempts?: string | null
  cooldown?: string | null
  email?: string | null
}) => {
  asyncStorageGetItemSpy
    .mockResolvedValueOnce(attempts)
    .mockResolvedValueOnce(cooldown)
    .mockResolvedValueOnce(email)
}

describe('useOneTimePasswordAttempts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()

    asyncStorageGetItemSpy.mockReset()
    asyncStorageGetItemSpy.mockResolvedValue(null)

    asyncStorageSetItemSpy.mockReset()
    asyncStorageSetItemSpy.mockResolvedValue()

    asyncStorageRemoveItemSpy.mockReset()
    asyncStorageRemoveItemSpy.mockResolvedValue()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should initialize with default values when storage is empty', async () => {
    const { result } = renderHook(() => useOneTimePasswordAttempts())

    await waitFor(() => {
      expect(result.current.failedAttempts).toBe(0)
      expect(result.current.loginEmail).toBeNull()
    })

    expect(result.current.codeError).toBeUndefined()
    expect(result.current.hasReachedMaxCodeAttempts).toBe(false)
    expect(result.current.remainingSeconds).toBe(0)
    expect(result.current.isLastAttempt).toBe(false)
    expect(result.current.maxCodeAttempts).toBe(5)

    expect(asyncStorageGetItemSpy).toHaveBeenCalledWith(CODE_ATTEMPTS_KEY)
    expect(asyncStorageGetItemSpy).toHaveBeenCalledWith(CODE_COOLDOWN_KEY)
    expect(asyncStorageGetItemSpy).toHaveBeenCalledWith(LOGIN_EMAIL_KEY)
  })

  it('should reset failed attempts when no cooldown is active', async () => {
    mockStoredValues({ attempts: '2' })

    const { result } = renderHook(() => useOneTimePasswordAttempts())

    await waitFor(() => expect(result.current.failedAttempts).toBe(0))

    expect(result.current.hasReachedMaxCodeAttempts).toBe(false)
  })

  it('should restore the email from storage', async () => {
    mockStoredValues({ email: EMAIL })

    const { result } = renderHook(() => useOneTimePasswordAttempts())

    await waitFor(() => expect(result.current.loginEmail).toBe(EMAIL))
  })

  it('should restore an active cooldown from storage', async () => {
    const cooldownEnd = Date.now() + 300_000

    mockStoredValues({ attempts: '5', cooldown: String(cooldownEnd), email: MASKED_EMAIL })

    const { result } = renderHook(() => useOneTimePasswordAttempts())

    await waitFor(() => expect(result.current.hasReachedMaxCodeAttempts).toBe(true))

    expect(result.current.failedAttempts).toBe(5)
    expect(result.current.remainingSeconds).toBeGreaterThan(0)
    expect(result.current.loginEmail).toBe(MASKED_EMAIL)
  })

  it('should remove expired cooldown data during initialization', async () => {
    mockStoredValues({ attempts: '5', cooldown: String(Date.now() - 1000), email: MASKED_EMAIL })

    const { result } = renderHook(() => useOneTimePasswordAttempts())

    await waitFor(() => {
      expect(asyncStorageRemoveItemSpy).toHaveBeenCalledWith(CODE_ATTEMPTS_KEY)
      expect(asyncStorageRemoveItemSpy).toHaveBeenCalledWith(CODE_COOLDOWN_KEY)
      expect(asyncStorageRemoveItemSpy).toHaveBeenCalledWith(LOGIN_EMAIL_KEY)
    })

    expect(result.current.failedAttempts).toBe(0)
    expect(result.current.loginEmail).toBeNull()
    expect(result.current.remainingSeconds).toBe(0)
  })

  it('should save and normalize the login email', async () => {
    const { result } = renderHook(() => useOneTimePasswordAttempts())

    await waitFor(() => {
      expect(result.current.loginEmail).toBeNull()
      expect(asyncStorageGetItemSpy).toHaveBeenCalledTimes(3)
    })

    await act(async () => {
      await result.current.saveLoginEmail(`  ${EMAIL}  `)
    })

    expect(result.current.loginEmail).toBe(EMAIL)
    expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(LOGIN_EMAIL_KEY, EMAIL)
  })

  it('should register a failed attempt and persist the error', async () => {
    const { result } = renderHook(() => useOneTimePasswordAttempts())

    await waitFor(() => expect(result.current.failedAttempts).toBe(0))

    let hasReachedLimit = true
    await act(async () => (hasReachedLimit = await result.current.registerFailedAttempt()))

    expect(hasReachedLimit).toBe(false)
    expect(result.current.failedAttempts).toBe(1)
    expect(result.current.codeError).toBe('Le code renseigné est incorrect')
    expect(result.current.hasReachedMaxCodeAttempts).toBe(false)

    expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(CODE_ATTEMPTS_KEY, '1')
  })

  it('should increment failed attempts on each invalid code', async () => {
    const { result } = renderHook(() => useOneTimePasswordAttempts())

    await waitFor(() => expect(result.current.failedAttempts).toBe(0))

    for (let attempts = 1; attempts <= 3; attempts += 1) {
      await act(async () => {
        await result.current.registerFailedAttempt()
      })

      expect(result.current.failedAttempts).toBe(attempts)
    }

    expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(CODE_ATTEMPTS_KEY, '3')
  })

  it('should indicate when only one attempt remains', async () => {
    const { result } = renderHook(() => useOneTimePasswordAttempts())

    await waitFor(() => expect(result.current.failedAttempts).toBe(0))

    for (let attempts = 1; attempts <= 4; attempts += 1) {
      await act(async () => {
        await result.current.registerFailedAttempt()
      })
    }

    expect(result.current.failedAttempts).toBe(4)
    expect(result.current.isLastAttempt).toBe(true)
    expect(result.current.hasReachedMaxCodeAttempts).toBe(false)
  })

  it('should lock the account after five failed attempts', async () => {
    const { result } = renderHook(() => useOneTimePasswordAttempts())

    await waitFor(() => expect(result.current.failedAttempts).toBe(0))

    await act(async () => {
      await result.current.saveLoginEmail(EMAIL)
    })

    for (let attempts = 0; attempts < 4; attempts += 1) {
      await act(async () => {
        await result.current.registerFailedAttempt()
      })
    }

    let hasReachedLimit = false
    await act(async () => (hasReachedLimit = await result.current.registerFailedAttempt()))

    expect(hasReachedLimit).toBe(true)
    expect(result.current.failedAttempts).toBe(5)
    expect(result.current.hasReachedMaxCodeAttempts).toBe(true)
    expect(result.current.isLastAttempt).toBe(false)
    expect(result.current.remainingSeconds).toBe(CODE_COOLDOWN_DURATION)
    expect(result.current.loginEmail).toBe(MASKED_EMAIL)

    expect(maskEmail).toHaveBeenCalledWith(EMAIL)

    expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(CODE_ATTEMPTS_KEY, '5')
    expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(LOGIN_EMAIL_KEY, MASKED_EMAIL)

    const cooldownCall = asyncStorageSetItemSpy.mock.calls.find(
      ([key]) => key === CODE_COOLDOWN_KEY
    )

    expect(cooldownCall).toBeDefined()
    expect(Number(cooldownCall?.[1])).toBeGreaterThan(Date.now())
  })

  it('should not register another failed attempt while the account is locked', async () => {
    mockStoredValues({ attempts: '5', cooldown: String(Date.now() + 300_000), email: MASKED_EMAIL })

    const { result } = renderHook(() => useOneTimePasswordAttempts())

    await waitFor(() => expect(result.current.hasReachedMaxCodeAttempts).toBe(true))

    let hasReachedLimit = true
    await act(async () => (hasReachedLimit = await result.current.registerFailedAttempt()))

    expect(hasReachedLimit).toBe(false)
    expect(result.current.failedAttempts).toBe(5)
  })

  it('should clear the code error', async () => {
    const { result } = renderHook(() => useOneTimePasswordAttempts())

    await waitFor(() => expect(result.current.failedAttempts).toBe(0))

    await act(async () => {
      await result.current.registerFailedAttempt()
    })

    expect(result.current.codeError).toBe('Le code renseigné est incorrect')

    act(() => result.current.clearCodeError())

    expect(result.current.codeError).toBeUndefined()
  })

  it('should not indicate the last attempt after the account is locked', async () => {
    mockStoredValues({ attempts: '5', cooldown: String(Date.now() + 300_000) })

    const { result } = renderHook(() => useOneTimePasswordAttempts())

    await waitFor(() => expect(result.current.hasReachedMaxCodeAttempts).toBe(true))

    expect(result.current.isLastAttempt).toBe(false)
  })
})
