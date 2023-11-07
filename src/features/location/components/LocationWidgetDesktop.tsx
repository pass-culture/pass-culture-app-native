import React from 'react'

import { LocationModal as HomeLocationModal } from 'features/location/components/LocationModal'
import { LocationWidgetWrapperDesktop } from 'features/location/components/LocationWidgetWrapperDesktop'

export const LocationWidgetDesktop = () => (
  <LocationWidgetWrapperDesktop>
    {({ visible, dismissModal }) => (
      <HomeLocationModal visible={visible} dismissModal={dismissModal} />
    )}
  </LocationWidgetWrapperDesktop>
)
