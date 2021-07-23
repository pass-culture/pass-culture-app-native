import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useRef } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { interpolationConfig } from 'ui/components/headers/animationHelpers'

import { useVenue } from '../api/useVenue'
import { VenueHeader } from '../components/VenueHeader'

import { VenueBody } from './VenueBody'

export const Venue: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Venue'>>()
  const { data: venueResponse } = useVenue(params.id)
  const headerScroll = useRef(new Animated.Value(0)).current

  if (!venueResponse) return <React.Fragment></React.Fragment>

  const headerTransition = headerScroll.interpolate(interpolationConfig)

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: headerScroll } } }], {
    useNativeDriver: false,
  })

  return (
    <Container testID={'Page de détail du lieu'}>
      <VenueBody venueId={params.id} onScroll={onScroll} />
      <VenueHeader
        headerTransition={headerTransition}
        title={venueResponse.name}
        venueId={venueResponse.id}
      />
    </Container>
  )
}

const Container = styled.View({})
