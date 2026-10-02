export const ONE_MINUTE = 60 // 1 minute in seconds
export const RESEND_COUNTDOWN = 120 // 2 minutes in seconds
export const MAX_RESEND_ATTEMPTS = 5
export const MAX_ATTEMPTS_COUNTDOWN = 3600 // 1 hour in seconds

export const RESEND_COOLDOWN_KEY = 'login-one-time-password-resend-cooldown'
export const RESEND_ATTEMPTS_KEY = 'login-one-time-password-resend-attempts'

export const getRemainingSeconds = (endTime: number, now = Date.now()) =>
  Math.max(Math.ceil((endTime - now) / 1000), 0)

export const getResendCooldownDuration = (attempts: number) =>
  attempts === MAX_RESEND_ATTEMPTS ? MAX_ATTEMPTS_COUNTDOWN : RESEND_COUNTDOWN

export const getResendState = (cooldownEnd: number | null, attempts: number, now = Date.now()) => {
  const initialCooldown = { cooldownEnd: null, countdown: 0, attempts }

  if (!cooldownEnd) return initialCooldown

  const countdown = getRemainingSeconds(cooldownEnd, now)

  if (countdown > 0) return { cooldownEnd, countdown, attempts }

  return {
    cooldownEnd: null,
    countdown: 0,
    attempts: attempts === MAX_RESEND_ATTEMPTS ? 0 : attempts,
  }
}

export const canResendEmail = (resendCountdown: number, resendAttempts: number) =>
  resendCountdown === 0 && resendAttempts < MAX_RESEND_ATTEMPTS

export const getNextResendState = (resendAttempts: number, now = Date.now()) => {
  const attempts = resendAttempts + 1
  const countdown = getResendCooldownDuration(attempts)
  const cooldownEnd = now + countdown * 1000

  return {
    attempts,
    cooldownEnd,
    countdown,
  }
}

export const getResendStatus = (resendCountdown: number, resendAttempts: number) => {
  const isCooldownActive = resendCountdown > 0
  const hasReachedMaxAttempts = resendAttempts >= MAX_RESEND_ATTEMPTS

  return {
    isCooldownActive,
    hasReachedMaxAttempts,
    isDisabled: isCooldownActive || hasReachedMaxAttempts,
  }
}
