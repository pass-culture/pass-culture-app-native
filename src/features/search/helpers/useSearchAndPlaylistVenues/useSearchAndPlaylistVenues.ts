import { useMemo } from 'react'

import { SearchOfferHits } from 'features/search/api/useSearchResults/useSearchResults'
import { Venue } from 'features/venue/types'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'

type Props = {
  hits: SearchOfferHits
  offerVenues: Venue[]
}

export const useSearchAndPlaylistVenues = ({ hits, offerVenues }: Props) => {
  return useMemo(() => {
    if (hits.venues && hits.venues.length > 0) {
      const playlistVenues = adaptAlgoliaVenues(hits.venues)

      const mergedVenues = [
        ...playlistVenues,
        ...offerVenues.filter(
          (offerVenue) => !playlistVenues.some((venue) => venue.venueId === offerVenue.venueId)
        ),
      ]

      return mergedVenues
    } else {
      return offerVenues
    }
  }, [hits.venues, offerVenues])
}
