import React, { FunctionComponent } from 'react'
import MapView from 'react-native-maps'
import styled from 'styled-components/native'

export const VenueMapView: FunctionComponent = () => {
  return <StyledMapView showsUserLocation mapPadding={{ top: 70, right: 0, bottom: 0, left: 0 }} />
}

const StyledMapView = styled(MapView)({ height: '100%', width: '100%' })
