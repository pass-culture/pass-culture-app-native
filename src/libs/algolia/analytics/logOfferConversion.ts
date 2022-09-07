import { useMemo } from 'react'
import AlgoliaSearchInsights from 'search-insights'

import { useAppSettings } from 'features/auth/settings'
import { CookieNameEnum } from 'features/cookies/enums'
import { getAcceptedCookieConsent } from 'features/cookies/helpers/getAcceptedCookieConsent'
import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { env } from 'libs/environment'
import { captureMonitoringError } from 'libs/monitoring'
import { getCookiesConsent } from 'libs/trackingConsent/consent'

export const logOfferConversion =
  (appEnableCookiesV2: boolean, queryID?: string) => async (objectID: string) => {
    // TODO(PC-17175): use getAcceptedCookieConsent instead
    const hasAcceptedAlogliaInsights = appEnableCookiesV2
      ? await getAcceptedCookieConsent(CookieNameEnum.ALGOLIA_INSIGHTS)
      : await getCookiesConsent()

    if (!hasAcceptedAlogliaInsights) return

    if (queryID === undefined) {
      captureMonitoringError(
        'Algolia Analytics: useLogOfferConversion called without any QueryID set'
      )
      return
    }

    AlgoliaSearchInsights('convertedObjectIDsAfterSearch', {
      eventName: 'Offer reserved',
      index: env.ALGOLIA_OFFERS_INDEX_NAME,
      queryID,
      objectIDs: [objectID],
    })
  }

export const useLogOfferConversion = () => {
  const { currentQueryID } = useSearchAnalyticsState()
  const { data: settings } = useAppSettings()
  const appEnableCookiesV2 = !!settings?.appEnableCookiesV2

  return useMemo(
    () => ({
      logOfferConversion: logOfferConversion(appEnableCookiesV2, currentQueryID),
    }),
    [currentQueryID, appEnableCookiesV2]
  )
}
