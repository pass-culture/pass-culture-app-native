import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { useVenue } from 'features/venue/api/useVenue'
import { VenueHeader } from 'features/venue/components/VenueHeader'
import { VenueBody } from 'features/venue/pages/VenueBody'
import { useHeaderTransition } from 'ui/components/headers/animationHelpers'

export const Venue: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Venue'>>()
  const { data: venue } = useVenue(params.id)
  const { headerTransition, onScroll } = useHeaderTransition()

  if (!venue) return <React.Fragment></React.Fragment>

  return (
    <Container>
      <VenueHeader
        headerTransition={headerTransition}
        title={venue.publicName || venue.name}
        venueId={venue.id}
        description={venue.description ?? undefined}
      />
      <VenueBody venueId={params.id} onScroll={onScroll} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))
