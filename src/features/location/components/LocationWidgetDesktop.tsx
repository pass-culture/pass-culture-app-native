import React from 'react'

import { LocationModal as HomeLocationModal } from 'features/location/components/LocationModal'
import { LocationWidgetWrapperDesktop } from 'features/location/components/LocationWidgetWrapperDesktop'
import { ScreenOrigin } from 'features/location/enums'

/**
 * One widget for the home
 */
export const LocationWidgetDesktop = () => (
  <LocationWidgetWrapperDesktop screenOrigin={ScreenOrigin.HOME}>
    {({ visible, dismissModal }) => (
      <HomeLocationModal visible={visible} dismissModal={dismissModal} />
    )}
  </LocationWidgetWrapperDesktop>
)
