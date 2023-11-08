import React from 'react'

import { HomeLocationModal } from 'features/location/components/HomeLocationModal'
import { LocationWidgetWrapperDesktop } from 'features/location/components/LocationWidgetWrapperDesktop'

/**
 * One widget for the home
 */
export const LocationWidgetDesktop = () => (
  <LocationWidgetWrapperDesktop>
    {({ visible, dismissModal }) => (
      <HomeLocationModal visible={visible} dismissModal={dismissModal} />
    )}
  </LocationWidgetWrapperDesktop>
)
