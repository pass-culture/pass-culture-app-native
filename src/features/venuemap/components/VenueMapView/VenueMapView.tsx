import React, { FunctionComponent } from 'react'
import MapView from 'react-native-maps'
import styled from 'styled-components/native'

type Props = {
  headerHeight: number
}

export const VenueMapView: FunctionComponent<Props> = ({ headerHeight }) => {
  return (
    <StyledMapView
      showsUserLocation
      mapPadding={{ top: headerHeight, right: 0, bottom: 0, left: 0 }}
    />
  )
}

const StyledMapView = styled(MapView)({ height: '100%', width: '100%' })
