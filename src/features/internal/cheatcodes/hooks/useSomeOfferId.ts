import { useEffect, useState } from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { AlgoliaLocationFilter } from 'libs/algolia'
import { fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers'
import { adaptAlgoliaLocationFilter } from 'libs/algolia/fetchAlgolia/helpers/adaptAlgoliaLocationFilter'
import { LocationMode } from 'libs/location/types'

const fakeOfferId = 283

export const useSomeOfferId = () => {
  // We don't use react-query as this is a query only used on the cheatcodes to debug
  const [offerId, setOfferId] = useState<number>(fakeOfferId)

  useEffect(() => {
    const locationFilter: AlgoliaLocationFilter = adaptAlgoliaLocationFilter({
      userPosition: { latitude: 1, longitude: 1 },
      selectedLocationMode: LocationMode.EVERYWHERE,
      aroundMeRadius: null,
      aroundPlaceRadius: null,
    })
    fetchOffers({
      parameters: { ...initialSearchState, locationFilter, page: 1 },
      isUserUnderage: false,
    })
      .then((response) => setOfferId(Number.parseInt(response.hits[0].objectID)))
      .catch(() => {
        // The cheatcodes are only in testing
        // eslint-disable-next-line no-console
        console.log('Cannot fetch offer ids')
      })
  }, [])

  return offerId
}
