import React from 'react'

import { LocationWidgetWrapperDesktop } from 'features/location/components/LocationWidgetWrapperDesktop'
import { ScreenOrigin } from 'features/location/enums'

export const SearchLocationWidgetDesktop = () => (
  <LocationWidgetWrapperDesktop screenOrigin={ScreenOrigin.SEARCH} />
)
