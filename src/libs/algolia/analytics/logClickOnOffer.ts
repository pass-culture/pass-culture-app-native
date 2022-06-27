import { useMemo } from 'react'
import AlgoliaSearchInsights from 'search-insights'

import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { env } from 'libs/environment'
import { captureMonitoringError } from 'libs/monitoring'

type LogClickOnProductArgs = {
  index: string
  queryID: string
  objectIDs: string[]
  positions: number[]
}

const logClickOnProduct = ({ index, queryID, objectIDs, positions }: LogClickOnProductArgs) => {
  AlgoliaSearchInsights('clickedObjectIDsAfterSearch', {
    eventName: 'Product Clicked',
    index,
    queryID,
    objectIDs,
    positions,
  })
}

export const logClickOnOffer =
  (currentQueryID?: string) =>
  ({ objectID, position }: { objectID: string; position: number }) => {
    if (currentQueryID === undefined) {
      captureMonitoringError('Algolia Analytics: useLogClickOnOffer called without any QueryID set')
      return
    }

    logClickOnProduct({
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
