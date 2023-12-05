import React from 'react'

import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { useSearch } from 'features/search/context/SearchWrapper'
import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { useModal } from 'ui/components/modals/useModal'
import { LocationBuildingFilled } from 'ui/svg/icons/LocationBuildingFilled'

export const Venue = () => {
  const { searchState } = useSearch()
  const {
    visible: searchVenueModalVisible,
    showModal: showSearchVenueModal,
    hideModal: hideSearchVenueModal,
  } = useModal(false)

  const venueLabel = searchState.venue ? searchState.venue.label : undefined

  return (
    <React.Fragment>
      <FilterRow
        icon={LocationBuildingFilled}
        title="Lieu culturel"
        description={venueLabel}
        onPress={showSearchVenueModal}
      />
      <VenueModal visible={searchVenueModalVisible} dismissModal={hideSearchVenueModal} />
    </React.Fragment>
  )
}
