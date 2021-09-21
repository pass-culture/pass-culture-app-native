import { useEffect, useState } from 'react'

import { fetchVenues } from 'libs/search/fetch/search'

export const useSomeVenueId = () => {
  // We don't use react-query as this is a query only used on the cheatcodes to debug
  const [venueId, setVenueId] = useState<number>(283)

  useEffect(() => {
    fetchVenues('').then(([venue]) => venue.venueId && setVenueId(venue.venueId))
  }, [])

  return venueId
}
