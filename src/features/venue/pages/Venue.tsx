import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useRef } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { VenueHeader } from 'features/venue/components/VenueHeader'
import { testID } from 'tests/utils'
import { interpolationConfig } from 'ui/components/headers/animationHelpers'
import { Spacer, Typo } from 'ui/theme'

import { useVenue } from '../api/useVenue'

export const Venue: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Venue'>>()
  const { data: venue } = useVenue(params.id)
  const headerScroll = useRef(new Animated.Value(0)).current

  if (!venue) return <React.Fragment></React.Fragment>

  const headerTransition = headerScroll.interpolate(interpolationConfig)

  return (
    <React.Fragment>
      <Container {...testID('Page de détail du lieu')}>
        <Spacer.TopScreen />
        <Typo.Caption>{venue.id}</Typo.Caption>
        <Typo.Caption>{venue.name}</Typo.Caption>
      </Container>
      <VenueHeader headerTransition={headerTransition} />
    </React.Fragment>
  )
}

const Container = styled.ScrollView({})
