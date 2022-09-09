import { getCookiesChoice } from 'features/cookies/helpers/useCookies'

const CONSENT_EXPIRATION_DELAY = 6 * 30 * 24 * 60 * 60 * 1000

export const isConsentChoiceExpired = async () => {
  const choiceDatetime = (await getCookiesChoice())?.choiceDatetime

  if (!choiceDatetime) return true

  const choiceTime = new Date(choiceDatetime).getTime()
  return choiceTime + CONSENT_EXPIRATION_DELAY <= Date.now()
}
