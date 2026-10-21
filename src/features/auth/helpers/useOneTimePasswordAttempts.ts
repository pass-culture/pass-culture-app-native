import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

const CODE_ATTEMPTS_KEY = 'login-one-time-password-failed-attempts'
const CODE_COOLDOWN_KEY = 'login-one-time-password-cooldown'
const CODE_COOLDOWN_DURATION = 60 * 60 // 1 hour in seconds

export const useOneTimePasswordAttempts = (maxAttempts: number) => {
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [codeError, setCodeError] = useState<string | undefined>()
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(function initializeCodeAttempts() {
    let isActive = true

    async function loadCodeAttempts() {
      const [storedAttempts, storedCooldown] = await Promise.all([
        AsyncStorage.getItem(CODE_ATTEMPTS_KEY),
        AsyncStorage.getItem(CODE_COOLDOWN_KEY),
      ])

      const attempts = storedAttempts ? Number(storedAttempts) : 0
      const endTime = storedCooldown ? Number(storedCooldown) : null
      const remaining = endTime ? Math.max(Math.ceil((endTime - Date.now()) / 1000), 0) : 0

      if (remaining === 0) {
        await Promise.all([
          AsyncStorage.removeItem(CODE_ATTEMPTS_KEY),
          AsyncStorage.removeItem(CODE_COOLDOWN_KEY),
        ])
      }

      if (!isActive) return

      setFailedAttempts(remaining > 0 ? attempts : 0)
      setCooldownEnd(remaining > 0 ? endTime : null)
      setRemainingSeconds(remaining)
      setIsInitialized(true)
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

      function updateRemainingSeconds() {
        const remaining = Math.max(Math.ceil((endTime - Date.now()) / 1000), 0)

        setRemainingSeconds(remaining)

        if (remaining === 0) {
          setCooldownEnd(null)
          setFailedAttempts(0)
          setCodeError(undefined)

          void Promise.all([
            AsyncStorage.removeItem(CODE_ATTEMPTS_KEY),
            AsyncStorage.removeItem(CODE_COOLDOWN_KEY),
          ])
        }
      }

      updateRemainingSeconds()

      const interval = setInterval(updateRemainingSeconds, 1000)

      return () => clearInterval(interval)
    },
    [cooldownEnd]
  )

  const registerFailedAttempt = async (): Promise<boolean> => {
    if (!isInitialized || (failedAttempts >= maxAttempts && remainingSeconds > 0)) {
      return false
    }
    const nextAttempts = failedAttempts + 1

    setFailedAttempts(nextAttempts)
    setCodeError('Le code renseigné est incorrect')

    if (nextAttempts >= maxAttempts) {
      const endTime = Date.now() + CODE_COOLDOWN_DURATION * 1000

      await Promise.all([
        AsyncStorage.setItem(CODE_ATTEMPTS_KEY, String(nextAttempts)),
        AsyncStorage.setItem(CODE_COOLDOWN_KEY, String(endTime)),
      ])

      setCooldownEnd(endTime)
      setRemainingSeconds(CODE_COOLDOWN_DURATION)

      return true
    }

    await AsyncStorage.setItem(CODE_ATTEMPTS_KEY, String(nextAttempts))

    return false
  }

  const clearCodeError = () => setCodeError(undefined)

  const hasReachedMaxCodeAttempts =
    isInitialized && failedAttempts >= maxAttempts && remainingSeconds > 0

  return {
    failedAttempts,
    codeError,
    hasReachedMaxCodeAttempts,
    remainingSeconds,
    isInitialized,
    registerFailedAttempt,
    clearCodeError,
  }
}
