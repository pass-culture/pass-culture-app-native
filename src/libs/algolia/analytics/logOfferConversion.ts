import AlgoliaSearchInsights from 'search-insights'

import { CookieNameEnum } from 'features/cookies/enums'
import { getAcceptedCookieConsent } from 'features/cookies/helpers/getAcceptedCookieConsent'
import { AlgoliaAnalyticsEvents } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { captureMonitoringError } from 'libs/monitoring/errors'

type Props = Omit<AlgoliaAnalyticsEvents, 'position'>

export const logOfferConversion = async ({ objectID, queryID }: Props) => {
  const hasAcceptedAlogliaInsights = await getAcceptedCookieConsent(CookieNameEnum.ALGOLIA_INSIGHTS)

  if (!hasAcceptedAlogliaInsights) return

  if (queryID === undefined) {
    captureMonitoringError('Algolia Analytics: logOfferConversion called without any QueryID set')
    return
  }

  await AlgoliaSearchInsights('convertedObjectIDsAfterSearch', {
    eventName: 'Offer reserved',
    index: env.ALGOLIA_OFFERS_INDEX_NAME,
    queryID,
    objectIDs: [objectID],
  })
}
