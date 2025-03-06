import React from 'react'
import styled from 'styled-components/native'

import { VenueMapBlockProxy } from 'features/venueMap/components/VenueMapBlock/VenueMapBlockProxy'
import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'

export const VenueMapModule = () => {
  const { shouldDisplayVenueMap } = useShouldDisplayVenueMap()

  return shouldDisplayVenueMap ? <StyledVenueMapBlock from="home" /> : null
}

const StyledVenueMapBlock = styled(VenueMapBlockProxy)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  paddingBottom: theme.home.spaceBetweenModules,
}))
