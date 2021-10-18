import { useEffect, useState } from 'react'

import { fetchVenues as fetchAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues'
import { fetchVenues as fetchAppSearchVenues } from 'libs/search/fetch/search'
import { useAppSearchBackend } from 'libs/search/fetch/useAppSearchBackend'

export const useSomeVenueId = () => {
  // We don't use react-query as this is a query only used on the cheatcodes to debug
  const [venueId, setVenueId] = useState<number>(283)
  const { enabled, isAppSearchBackend } = useAppSearchBackend()

  const fetchVenuesFn = isAppSearchBackend ? fetchAppSearchVenues : fetchAlgoliaVenues

  useEffect(() => {
    if (!enabled) return
    fetchVenuesFn('')
      .then(([venue]) => venue.venueId && setVenueId(venue.venueId))
      .catch(() => {
        // The cheatcodes are only in testing
        // eslint-disable-next-line no-console
        console.log('Cannot fetch venue ids')
      })
  }, [enabled, fetchVenuesFn])

  return venueId
}
