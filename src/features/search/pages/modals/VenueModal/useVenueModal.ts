import { useCallback, useEffect, useState } from 'react'

import { DEFAULT_RADIUS } from 'features/location/components/SearchLocationModal'
import { useSearch } from 'features/search/context/SearchWrapper'
import { LocationType } from 'features/search/enums'
import { VenueModalHook, VenueModalHookProps } from 'features/search/pages/modals/VenueModal/type'
import { LocationFilter, SearchState, SearchView } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { analytics } from 'libs/analytics'
import { useLocation } from 'libs/geolocation'
import { useDebounceValue } from 'ui/hooks/useDebounceValue'

/**
 * Build the logic of the modal so buttons are only shown
 * when the input venue query has been filled
 * by a click on the selected dropdown venue list
 * It can then apply the "search" by changing the search context
 *
 * @param dismissModal callback to close modal passed by parent component
 * @returns
 */
const useVenueModal = ({ dismissModal, doAfterSearch }: VenueModalHookProps): VenueModalHook => {
  const [venueQuery, setVenueQuery] = useState('')
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const { dispatch, searchState } = useSearch()
  const { isCustomPosition, isGeolocated, place } = useLocation()

  useEffect(() => {
    if (searchState.locationFilter.locationType !== LocationType.VENUE) {
      setVenueQuery('')
    }
  }, [searchState.locationFilter.locationType])

  const onClose = () => {
    if (searchState.locationFilter.locationType === LocationType.VENUE) {
      setVenueQuery(searchState.locationFilter.venue.label)
    }
    dismissModal()
  }

  const doChangeVenue = useCallback((text: string) => {
    setVenueQuery(text)
    setSelectedVenue(null)
  }, [])

  const doResetVenue = useCallback(() => {
    setVenueQuery('')
    setSelectedVenue(null)
  }, [])

  const doSetSelectedVenue = useCallback((venue: Venue) => {
    setSelectedVenue(venue)
    setVenueQuery(venue.label)
  }, [])

  const doApplySearch = useCallback(() => {
    if (!venueQuery) {
      let locationFilter: LocationFilter = { locationType: LocationType.EVERYWHERE }
      if (isCustomPosition && place) {
        locationFilter = {
          place,
          locationType: LocationType.PLACE,
          aroundRadius: DEFAULT_RADIUS,
        }
      } else if (isGeolocated) {
        locationFilter = { locationType: LocationType.AROUND_ME, aroundRadius: DEFAULT_RADIUS }
      }
      const payload: Partial<SearchState> = {
        ...searchState,
        locationFilter,
        view: SearchView.Results,
      }
      dispatch({
        type: 'SET_STATE',
        payload,
      })
      doAfterSearch?.(payload)
    }
    if (selectedVenue) {
      const payload: Partial<SearchState> = {
        ...searchState,
        locationFilter: { locationType: LocationType.VENUE, venue: selectedVenue },
        view: SearchView.Results,
      }
      dispatch({
        type: 'SET_STATE',
        payload,
      })
      analytics.logUserSetVenue({ venueLabel: selectedVenue.label })
      doAfterSearch?.(payload)
    }

    dismissModal()
  }, [
    dismissModal,
    dispatch,
    doAfterSearch,
    isCustomPosition,
    isGeolocated,
    place,
    searchState,
    selectedVenue,
    venueQuery,
  ])

  useEffect(() => {
    if (searchState.locationFilter.locationType === LocationType.VENUE) {
      setVenueQuery(searchState.locationFilter.venue.label)
      setSelectedVenue(searchState.locationFilter.venue)
    }
  }, [searchState.locationFilter])

  const debouncedVenueQuery = useDebounceValue(venueQuery, 500)
  const isQueryProvided = !!venueQuery && !!debouncedVenueQuery
  const shouldShowSuggestedVenues = isQueryProvided && !selectedVenue
  const isSearchButtonDisabled = !selectedVenue && !!venueQuery

  return {
    doChangeVenue,
    doResetVenue,
    doSetSelectedVenue,
    doApplySearch,
    isQueryProvided,
    shouldShowSuggestedVenues,
    venueQuery,
    isSearchButtonDisabled,
    onClose,
  }
}

export default useVenueModal
