import { useEffect, useState } from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers'

const fakeOfferId = 283

export const useSomeOfferId = () => {
  // We don't use react-query as this is a query only used on the cheatcodes to debug
  const [offerId, setOfferId] = useState<number>(fakeOfferId)

  useEffect(() => {
    fetchOffers({
      parameters: { ...initialSearchState, page: 1 },
      isUserUnderage: false,
      userLocation: { latitude: 1, longitude: 1 },
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
