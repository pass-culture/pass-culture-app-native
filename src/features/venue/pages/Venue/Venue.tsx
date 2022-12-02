import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useVenue } from 'features/venue/api/useVenue'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { VenueHeader } from 'features/venue/components/VenueHeader/VenueHeader'
import { VenueWebHeader } from 'features/venue/components/VenueWebHeader'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

export const Venue: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Venue'>>()
  const { data: venue } = useVenue(params.id)
  const { headerTransition, onScroll } = useOpacityTransition()

  if (!venue) return <React.Fragment></React.Fragment>

  return (
    <Container>
      <VenueWebHeader venue={venue} />
      <VenueHeader
        headerTransition={headerTransition}
        title={venue.publicName || venue.name}
        venueId={venue.id}
      />
      <VenueBody venueId={params.id} onScroll={onScroll} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))
