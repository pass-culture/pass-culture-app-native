import { useEffect, useState } from 'react'

import { fetchVenues } from 'libs/search/fetch/search'

export const useSomeVenueId = () => {
  // We don't use react-query as this is a query only used on the cheatcodes to debug
  const [venueId, setVenueId] = useState<number>(283)

  useEffect(() => {
    // TODO(antoinewg, #PC-11353): make fetchVenues depend on search backend
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
