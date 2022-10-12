const CONSENT_EXPIRATION_DELAY = 6 * 30 * 24 * 60 * 60 * 1000

export const isConsentChoiceExpired = (choiceDatetime: Date): boolean => {
  const choiceTime = choiceDatetime.getTime()
  return choiceTime + CONSENT_EXPIRATION_DELAY <= Date.now()
}
