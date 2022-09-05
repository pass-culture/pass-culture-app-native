import { useMemo } from 'react'
import AlgoliaSearchInsights from 'search-insights'

import { useAppSettings } from 'features/auth/settings'
import { CookieNameEnum } from 'features/cookies/CookiesPolicy'
import { getAcceptedCookieConsent } from 'features/cookies/getAcceptedCookieConsent'
import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { env } from 'libs/environment'
import { captureMonitoringError } from 'libs/monitoring'
import { getCookiesConsent } from 'libs/trackingConsent/consent'

export const logClickOnOffer =
  (appEnableCookiesV2: boolean, currentQueryID?: string) =>
  async ({ objectID, position }: { objectID: string; position: number }) => {
    // TODO(PC-17175): use getAcceptedCookieConsent instead
    const hasAcceptedAlogliaInsights = appEnableCookiesV2
      ? await getAcceptedCookieConsent(CookieNameEnum.ALGOLIA_INSIGHTS)
      : await getCookiesConsent()

    if (!hasAcceptedAlogliaInsights) return

    if (currentQueryID === undefined) {
      captureMonitoringError('Algolia Analytics: useLogClickOnOffer called without any QueryID set')
      return
    }

    AlgoliaSearchInsights('clickedObjectIDsAfterSearch', {
      eventName: 'Offer Clicked',
      index: env.ALGOLIA_OFFERS_INDEX_NAME,
      queryID: currentQueryID,
      objectIDs: [objectID],
      // for Algolia, position start at 1 instead of 0
      positions: [position + 1],
    })
  }

export const useLogClickOnOffer = () => {
  const { currentQueryID } = useSearchAnalyticsState()
  const { data: settings } = useAppSettings()
  const appEnableCookiesV2 = !!settings?.appEnableCookiesV2

  return useMemo(
    () => ({
      logClickOnOffer: logClickOnOffer(appEnableCookiesV2, currentQueryID),
    }),
    [appEnableCookiesV2, currentQueryID]
  )
}
