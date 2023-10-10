import { useState } from 'react'

import { Venue } from 'features/venue/types'
import { useDebounceValue } from 'ui/hooks/useDebounceValue'

type VenueModalHook = {
  doChangeVenue: (arg0: string) => void
  doResetVenue: () => void
  doSetSelectedVenue: (arg0: Venue) => void
  isQueryProvided: boolean
  shouldShowSuggestedVenues: boolean
  isVenueNotSelected: boolean
  venueQuery: string
}

const useVenueModal = (): VenueModalHook => {
  const [venueQuery, setVenueQuery] = useState('')
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)

  const doChangeVenue = (text: string) => {
    setVenueQuery(text)
    setSelectedVenue(null)
  }
  const doResetVenue = () => {
    setVenueQuery('')
    setSelectedVenue(null)
  }

  const doSetSelectedVenue = (venue: Venue) => {
    setSelectedVenue(venue)
    setVenueQuery(venue.label)
  }

  const debouncedVenueQuery = useDebounceValue(venueQuery, 500)
  const isQueryProvided = !!venueQuery && !!debouncedVenueQuery
  const shouldShowSuggestedVenues = isQueryProvided && !selectedVenue
  const isVenueNotSelected = !selectedVenue

  return {
    doChangeVenue,
    doResetVenue,
    doSetSelectedVenue,
    isQueryProvided,
    shouldShowSuggestedVenues,
    isVenueNotSelected,
    venueQuery,
  }
}

export default useVenueModal
