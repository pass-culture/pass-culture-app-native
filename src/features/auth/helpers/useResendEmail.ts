import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

import {
  canResendEmail,
  getNextResendState,
  getRemainingSeconds,
  getResendState,
  getResendStatus,
  MAX_RESEND_ATTEMPTS,
  RESEND_ATTEMPTS_KEY,
  RESEND_COOLDOWN_KEY,
} from 'features/auth/helpers/resendEmail'

export const useResendEmail = () => {
  const [resendCountdown, setResendCountdown] = useState(0)
  const [resendAttempts, setResendAttempts] = useState(0)
  const [resendCooldownEnd, setResendCooldownEnd] = useState<number | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(function initializeResendState() {
    const loadResendState = async () => {
      const [storedCooldown, storedAttempts] = await Promise.all([
        AsyncStorage.getItem(RESEND_COOLDOWN_KEY),
        AsyncStorage.getItem(RESEND_ATTEMPTS_KEY),
      ])

      const cooldownEnd = storedCooldown ? Number(storedCooldown) : null
      const attempts = storedAttempts ? Number(storedAttempts) : 0

      const state = getResendState(cooldownEnd, attempts)

      setResendCooldownEnd(state.cooldownEnd)
      setResendCountdown(state.countdown)
      setResendAttempts(state.attempts)

      if (cooldownEnd && state.countdown === 0) {
        await AsyncStorage.removeItem(RESEND_COOLDOWN_KEY)

        if (attempts === MAX_RESEND_ATTEMPTS) {
          await AsyncStorage.removeItem(RESEND_ATTEMPTS_KEY)
        }
      }

      setIsInitialized(true)
    }

    void loadResendState()
  }, [])

  useEffect(
    function startResendCountdown() {
      if (!resendCooldownEnd) return

      const updateCountdown = () => {
        const remainingSeconds = getRemainingSeconds(resendCooldownEnd)

        setResendCountdown(remainingSeconds)

        if (remainingSeconds === 0) {
          setResendCooldownEnd(null)

          if (resendAttempts === MAX_RESEND_ATTEMPTS) {
            setResendAttempts(0)
            void AsyncStorage.removeItem(RESEND_ATTEMPTS_KEY)
            void AsyncStorage.removeItem(RESEND_COOLDOWN_KEY)
          }
        }
      }

      updateCountdown()

      const interval = setInterval(updateCountdown, 1000)

      return () => clearInterval(interval)
    },
    [resendCooldownEnd, resendAttempts]
  )

  const handleResendEmail = async () => {
    if (!canResendEmail(resendCountdown, resendAttempts)) return

    const { attempts, cooldownEnd, countdown } = getNextResendState(resendAttempts)

    await Promise.all([
      AsyncStorage.setItem(RESEND_COOLDOWN_KEY, String(cooldownEnd)),
      AsyncStorage.setItem(RESEND_ATTEMPTS_KEY, String(attempts)),
    ])

    setResendAttempts(attempts)
    setResendCooldownEnd(cooldownEnd)
    setResendCountdown(countdown)
  }

  const { isCooldownActive, hasReachedMaxAttempts, isDisabled } = getResendStatus(
    resendCountdown,
    resendAttempts
  )

  return {
    resendCountdown,
    resendAttempts,
    isInitialized,
    isCooldownActive,
    hasReachedMaxAttempts,
    isDisabled,
    handleResendEmail,
  }
}
