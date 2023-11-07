import React from 'react'

import {
  LocationWidgetWrapperDesktop,
  SearchLocationWidgetDesktopProps,
} from 'features/location/components/LocationWidgetWrapperDesktop'
import { SearchLocationModal } from 'features/location/components/SearchLocationModal'
import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { useModal } from 'ui/components/modals/useModal'

export const SearchLocationWidgetDesktop = ({ onSearch }: SearchLocationWidgetDesktopProps) => {
  const {
    visible: venueModalVisible,
    showModal: showVenueModal,
    hideModal: hideVenueModal,
  } = useModal()

  return (
    <LocationWidgetWrapperDesktop>
      {({ visible, dismissModal }) => (
        <React.Fragment>
          <VenueModal
            visible={venueModalVisible}
            dismissModal={hideVenueModal}
            doAfterSearch={onSearch}
          />
          <SearchLocationModal
            visible={visible}
            dismissModal={dismissModal}
            showVenueModal={showVenueModal}
          />
        </React.Fragment>
      )}
    </LocationWidgetWrapperDesktop>
  )
}
