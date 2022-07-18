import { useMemo } from 'react'
import AlgoliaSearchInsights from 'search-insights'

import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { env } from 'libs/environment'
import { captureMonitoringError } from 'libs/monitoring'
import { getCookiesConsent } from 'libs/trackingConsent/consent'

export const logClickOnOffer =
  (currentQueryID?: string) =>
  async ({ objectID, position }: { objectID: string; position: number }) => {
    const hasAcceptedCookies = await getCookiesConsent()
    if (!hasAcceptedCookies) {
      return
    }

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

  return useMemo(
    () => ({
      logClickOnOffer: logClickOnOffer(currentQueryID),
    }),
    [currentQueryID]
  )
}
