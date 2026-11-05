import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'

import { maskEmail } from 'features/auth/helpers/maskEmail'

const MAX_CODE_ATTEMPTS = 5
const CODE_ATTEMPTS_KEY = 'login-one-time-password-failed-attempts'
const CODE_COOLDOWN_KEY = 'login-one-time-password-cooldown'
const LOGIN_EMAIL_KEY = 'login-one-time-password-email'
const CODE_COOLDOWN_DURATION = 60 * 60 // 1 hour in seconds

export const useOneTimePasswordAttempts = () => {
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [codeError, setCodeError] = useState<string | undefined>()
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [loginEmail, setLoginEmail] = useState<string | null>(null)

  useEffect(function initializeCodeAttempts() {
    let isActive = true

    async function loadCodeAttempts() {
      const [storedAttempts, storedCooldown, storedEmail] = await Promise.all([
        AsyncStorage.getItem(CODE_ATTEMPTS_KEY),
        AsyncStorage.getItem(CODE_COOLDOWN_KEY),
        AsyncStorage.getItem(LOGIN_EMAIL_KEY),
      ])

      const attempts = storedAttempts ? Number(storedAttempts) : 0
      const endTime = storedCooldown ? Number(storedCooldown) : null
      const remaining = endTime ? Math.max(Math.ceil((endTime - Date.now()) / 1000), 0) : 0

      let email = storedEmail

      if (storedCooldown && remaining === 0) {
        await Promise.all([
          AsyncStorage.removeItem(CODE_ATTEMPTS_KEY),
          AsyncStorage.removeItem(CODE_COOLDOWN_KEY),
          AsyncStorage.removeItem(LOGIN_EMAIL_KEY),
        ])

        email = null
      }

      if (!isActive) return

      setFailedAttempts(remaining > 0 ? attempts : 0)
      setCooldownEnd(remaining > 0 ? endTime : null)
      setRemainingSeconds(remaining)
      setLoginEmail(email)
    }

    void loadCodeAttempts()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(
    function updateCodeCooldown() {
      if (cooldownEnd === null) return

      const endTime = cooldownEnd

      async function updateRemainingSeconds() {
        const remaining = Math.max(Math.ceil((endTime - Date.now()) / 1000), 0)

        setRemainingSeconds(remaining)

        if (remaining === 0) {
          setCooldownEnd(null)
          setFailedAttempts(0)
          setCodeError(undefined)
          setLoginEmail(null)

          await Promise.all([
            AsyncStorage.removeItem(CODE_ATTEMPTS_KEY),
            AsyncStorage.removeItem(CODE_COOLDOWN_KEY),
            AsyncStorage.removeItem(LOGIN_EMAIL_KEY),
          ])
        }
      }

      void updateRemainingSeconds()
      const interval = setInterval(() => void updateRemainingSeconds(), 1000)

      return () => clearInterval(interval)
    },
    [cooldownEnd]
  )

  const saveLoginEmail = useCallback(async (email: string) => {
    const normalizedEmail = email.trim()
    await AsyncStorage.setItem(LOGIN_EMAIL_KEY, normalizedEmail)
    setLoginEmail(normalizedEmail)
  }, [])

  const registerFailedAttempt = async (): Promise<boolean> => {
    if (failedAttempts >= MAX_CODE_ATTEMPTS && remainingSeconds > 0) {
      return false
    }
    const nextAttempts = failedAttempts + 1

    setFailedAttempts(nextAttempts)
    setCodeError('Le code renseigné est incorrect')

    if (nextAttempts >= MAX_CODE_ATTEMPTS) {
      const endTime = Date.now() + CODE_COOLDOWN_DURATION * 1000
      const maskedEmail = loginEmail ? maskEmail(loginEmail) : null

      await Promise.all([
        AsyncStorage.setItem(CODE_ATTEMPTS_KEY, String(nextAttempts)),
        AsyncStorage.setItem(CODE_COOLDOWN_KEY, String(endTime)),
        maskedEmail ? AsyncStorage.setItem(LOGIN_EMAIL_KEY, maskedEmail) : Promise.resolve(),
      ])

      setLoginEmail(maskedEmail)
      setCooldownEnd(endTime)
      setRemainingSeconds(CODE_COOLDOWN_DURATION)

      return true
    }

    await AsyncStorage.setItem(CODE_ATTEMPTS_KEY, String(nextAttempts))

    return false
  }

  const clearCodeError = () => setCodeError(undefined)

  const hasReachedMaxCodeAttempts = failedAttempts >= MAX_CODE_ATTEMPTS && remainingSeconds > 0
  const isLastAttempt = !hasReachedMaxCodeAttempts && failedAttempts === MAX_CODE_ATTEMPTS - 1

  return {
    failedAttempts,
    codeError,
    hasReachedMaxCodeAttempts,
    remainingSeconds,
    loginEmail,
    saveLoginEmail,
    registerFailedAttempt,
    clearCodeError,
    isLastAttempt,
    maxCodeAttempts: MAX_CODE_ATTEMPTS,
  }
}
