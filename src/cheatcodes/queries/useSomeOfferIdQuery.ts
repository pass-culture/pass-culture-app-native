import { useEffect, useState } from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers'
import { LocationMode } from 'libs/location/types'

const fakeOfferId = 283

// TODO(PC-34760): should use React Query
export const useSomeOfferIdQuery = () => {
  const [offerId, setOfferId] = useState<number>(fakeOfferId)

  useEffect(() => {
    fetchOffers({
      parameters: { ...initialSearchState, page: 1 },
      isUserUnderage: false,
      buildLocationParameterParams: {
        userLocation: { latitude: 1, longitude: 1 },
        selectedLocationMode: LocationMode.EVERYWHERE,
        aroundMeRadius: 'all',
        aroundPlaceRadius: 'all',
      },
    })
      .then((response) => {
        if (response.hits[0]) {
          setOfferId(Number.parseInt(response.hits[0].objectID))
        }
      })
      .catch(() => {
        // The cheatcodes are only in testing
        // eslint-disable-next-line no-console
        console.log('Cannot fetch offer ids')
      })
  }, [])

  return offerId
}
