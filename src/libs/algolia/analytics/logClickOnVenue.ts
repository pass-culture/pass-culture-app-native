import AlgoliaSearchInsights from 'search-insights'

import { AlgoliaAnalyticsEvents } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { captureMonitoringError } from 'libs/monitoring/errors'

export const logClickOnVenue = async ({ objectID, position, queryID }: AlgoliaAnalyticsEvents) => {
  const hasAcceptedAlgoliaInsights = true
  if (!hasAcceptedAlgoliaInsights) return

  if (!queryID) {
    return captureMonitoringError(
      'Algolia Analytics: logClickOnVenue called without any QueryID set'
    )
  }

  await AlgoliaSearchInsights('clickedObjectIDsAfterSearch', {
    eventName: 'Venue Clicked',
    index: env.ALGOLIA_OFFERS_INDEX_NAME,
    queryID,
    objectIDs: [objectID],

    // for Algolia, position start at 1 instead of 0
    positions: [position + 1],
  })
}
