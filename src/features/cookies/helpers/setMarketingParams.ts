import { CookieNameEnum } from 'features/cookies/enums'
import { Cookies, UTMParams } from 'features/cookies/types'
import { setUtmParameters } from 'features/navigation/RootNavigator/linking/getStateFromPath'
import { setFirebaseParams } from 'libs/firebase/analytics/useInit'
import { getCampaignDate } from 'libs/utm/useUtmParams'

export const setMarketingParams = async (params: UTMParams['params'], acceptedCookies: Cookies) => {
  if (!params) return

  // we use setTimeout to ensure local storage is updated before reading it
  setTimeout(async () => {
    if (acceptedCookies.includes(CookieNameEnum.TRAFFIC_CAMPAIGN)) {
      setFirebaseParams(getCampaignDate(params.campaign_date))
      await setUtmParameters(params)
    }
  })
}
