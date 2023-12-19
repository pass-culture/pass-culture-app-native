import React from 'react'

import { LocationWidgetWrapperDesktop } from 'features/location/components/LocationWidgetWrapperDesktop'
import { SearchLocationModal } from 'features/location/components/SearchLocationModal'
import { ScreenOrigin } from 'features/location/enums'

export const SearchLocationWidgetDesktop = () => {
  return (
    <LocationWidgetWrapperDesktop screenOrigin={ScreenOrigin.SEARCH}>
      {({ visible, dismissModal }) => (
        <SearchLocationModal visible={visible} dismissModal={dismissModal} />
      )}
    </LocationWidgetWrapperDesktop>
  )
}
