import React from 'react'
import styled from 'styled-components/native'

import { VenueMapBlock } from 'features/venueMap/components/VenueMapBlock/VenueMapBlock'
import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'

export const VenueMapModule = () => {
  const { shouldDisplayVenueMap } = useShouldDisplayVenueMap()

  return shouldDisplayVenueMap ? <StyledVenueMapBlock /> : null
}

const StyledVenueMapBlock = styled(VenueMapBlock)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  paddingBottom: theme.home.spaceBetweenModules,
}))
