import {
  MAX_ATTEMPTS_COUNTDOWN,
  MAX_RESEND_ATTEMPTS,
  RESEND_COUNTDOWN,
  getRemainingSeconds,
  getResendCooldownDuration,
  getResendState,
} from './resendEmail'

describe('getRemainingSeconds', () => {
  it('should return the remaining seconds', () => {
    const now = 1_000_000
    const endTime = now + 5_000

    expect(getRemainingSeconds(endTime, now)).toBe(5)
  })

  it('should round up when less than a second remains', () => {
    const now = 1_000_000
    const endTime = now + 1

    expect(getRemainingSeconds(endTime, now)).toBe(1)
  })

  it('should return 0 when the countdown has expired', () => {
    const now = 1_000_000
    const endTime = now - 1_000

    expect(getRemainingSeconds(endTime, now)).toBe(0)
  })
})

describe('getResendCooldownDuration', () => {
  it('should return the regular cooldown duration when the maximum number of attempts has not been reached', () => {
    expect(getResendCooldownDuration(MAX_RESEND_ATTEMPTS - 1)).toBe(RESEND_COUNTDOWN)
  })

  it('should return the maximum attempts cooldown when the maximum number of attempts is reached', () => {
    expect(getResendCooldownDuration(MAX_RESEND_ATTEMPTS)).toBe(MAX_ATTEMPTS_COUNTDOWN)
  })
})

describe('getResendState', () => {
  it('should return an initial state when there is no cooldown', () => {
    expect(getResendState(null, 2)).toEqual({
      cooldownEnd: null,
      countdown: 0,
      attempts: 2,
    })
  })

  it('should return the active cooldown state', () => {
    const now = 1_000_000
    const cooldownEnd = now + 120_000

    expect(getResendState(cooldownEnd, 2, now)).toEqual({
      cooldownEnd,
      countdown: 120,
      attempts: 2,
    })
  })

  it('should clear the cooldown when it has expired', () => {
    const now = 1_000_000
    const cooldownEnd = now - 1_000

    expect(getResendState(cooldownEnd, 2, now)).toEqual({
      cooldownEnd: null,
      countdown: 0,
      attempts: 2,
    })
  })

  it('should reset attempts when the maximum attempts cooldown has expired', () => {
    const now = 1_000_000
    const cooldownEnd = now - 1_000

    expect(getResendState(cooldownEnd, MAX_RESEND_ATTEMPTS, now)).toEqual({
      cooldownEnd: null,
      countdown: 0,
      attempts: 0,
    })
  })

  it('should keep attempts when a regular cooldown has expired', () => {
    const now = 1_000_000
    const cooldownEnd = now - 1_000

    expect(getResendState(cooldownEnd, MAX_RESEND_ATTEMPTS - 1, now)).toEqual({
      cooldownEnd: null,
      countdown: 0,
      attempts: MAX_RESEND_ATTEMPTS - 1,
    })
  })
})
