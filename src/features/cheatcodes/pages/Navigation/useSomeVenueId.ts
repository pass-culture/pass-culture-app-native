import { useEffect, useState } from 'react'

import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues'

export const useSomeVenueId = () => {
  // We don't use react-query as this is a query only used on the cheatcodes to debug
  const [venueId, setVenueId] = useState<number>(283)

  useEffect(() => {
    fetchVenues('')
      .then(([venue]) => venue.venueId && setVenueId(venue.venueId))
      .catch(() => {
        // The cheatcodes are only in testing
        // eslint-disable-next-line no-console
        console.log('Cannot fetch venue ids')
      })
  }, [])

  return venueId
}
