import { useMemo } from 'react'
import AlgoliaSearchInsights from 'search-insights'

import { CookieNameEnum } from 'features/cookies/enums'
import { getAcceptedCookieConsent } from 'features/cookies/helpers/getAcceptedCookieConsent'
import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { env } from 'libs/environment'
import { captureMonitoringError } from 'libs/monitoring'

export const logOfferConversion = (queryID?: string) => async (objectID: string) => {
  const hasAcceptedAlogliaInsights = await getAcceptedCookieConsent(CookieNameEnum.ALGOLIA_INSIGHTS)

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
  return useMemo(
    () => ({ logOfferConversion: logOfferConversion(currentQueryID) }),
    [currentQueryID]
  )
}
