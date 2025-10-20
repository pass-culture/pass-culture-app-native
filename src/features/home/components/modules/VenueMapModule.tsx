import React from 'react'
import styled from 'styled-components/native'

import { VenueMapBlock } from 'features/venueMap/components/VenueMapBlock/VenueMapBlock'
import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'

export const VenueMapModule = () => {
  const { shouldDisplayVenueMap } = useShouldDisplayVenueMap()

  return shouldDisplayVenueMap ? (
    <Container>
      <VenueMapBlock from="home" />
    </Container>
  ) : null
}

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  paddingBottom: theme.home.spaceBetweenModules,
}))
