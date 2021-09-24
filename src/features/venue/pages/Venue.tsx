import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { useHeaderTransition } from 'ui/components/headers/animationHelpers'

import { useVenue } from '../api/useVenue'
import { VenueHeader } from '../components/VenueHeader'

import { VenueBody } from './VenueBody'

export const Venue: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Venue'>>()
  const { data: venue } = useVenue(params.id)
  const { headerTransition, onScroll } = useHeaderTransition()

  if (!venue) return <React.Fragment></React.Fragment>

  return (
    <React.Fragment>
      <VenueBody venueId={params.id} onScroll={onScroll} />
      <VenueHeader headerTransition={headerTransition} title={venue.name} venueId={venue.id} />
    </React.Fragment>
  )
}
