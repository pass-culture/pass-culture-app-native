import { useMemo } from 'react'
import AlgoliaSearchInsights from 'search-insights'

import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { env } from 'libs/environment'
import { captureMonitoringError } from 'libs/monitoring'
import { getCookiesConsent } from 'libs/trackingConsent/consent'

export const logOfferConversion = (queryID?: string) => async (objectID: string) => {
  const hasAcceptedCookies = await getCookiesConsent()
  if (!hasAcceptedCookies) {
    return
  }

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

  return useMemo(
    () => ({
      logOfferConversion: logOfferConversion(currentQueryID),
    }),
    [currentQueryID]
  )
}
