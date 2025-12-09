import AlgoliaSearchInsights from 'search-insights'

import { CookieNameEnum } from 'features/cookies/enums'
import { getAcceptedCookieConsent } from 'features/cookies/helpers/getAcceptedCookieConsent'
import { AlgoliaAnalyticsEvents } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { captureMonitoringError } from 'libs/monitoring/errors'

export const logClickOnOffer = async ({ objectID, position, queryID }: AlgoliaAnalyticsEvents) => {
  const hasAcceptedAlgoliaInsights = await getAcceptedCookieConsent(CookieNameEnum.ALGOLIA_INSIGHTS)
  if (!hasAcceptedAlgoliaInsights) return

  if (queryID === undefined) {
    captureMonitoringError('Algolia Analytics: logClickOnOffer called without any QueryID set')
    return
  }

  await AlgoliaSearchInsights('clickedObjectIDsAfterSearch', {
    eventName: 'Offer Clicked',
    index: env.ALGOLIA_OFFERS_INDEX_NAME,
    queryID,
    objectIDs: [objectID],
    // for Algolia, position start at 1 instead of 0
    positions: [position + 1],
  })
}
