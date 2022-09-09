import { CookieNameEnum } from 'features/cookies/enums'
import { getCookiesChoice } from 'features/cookies/helpers/useCookies'

export const getUtmParamsConsent = async () => {
  const cookiesChoice = await getCookiesChoice()
  const acceptedCookies = cookiesChoice?.consent.accepted || []

  const acceptedTrafficCampaign = acceptedCookies.includes(CookieNameEnum.TRAFFIC_CAMPAIGN)
  const acceptedTrafficMedium = acceptedCookies.includes(CookieNameEnum.TRAFFIC_MEDIUM)
  const acceptedTrafficSource = acceptedCookies.includes(CookieNameEnum.TRAFFIC_SOURCE)
  const acceptedCampaignDate = acceptedCookies.includes(CookieNameEnum.CAMPAIGN_DATE)

  return {
    acceptedTrafficCampaign,
    acceptedTrafficMedium,
    acceptedTrafficSource,
    acceptedCampaignDate,
  }
}
