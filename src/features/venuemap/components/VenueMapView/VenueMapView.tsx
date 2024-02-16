import React, { FunctionComponent } from 'react'
import MapView, { EdgePadding } from 'react-native-maps'
import styled from 'styled-components/native'

type Props = {
  padding: EdgePadding
}

export const VenueMapView: FunctionComponent<Props> = ({ padding }) => {
  return <StyledMapView showsUserLocation mapPadding={padding} />
}

const StyledMapView = styled(MapView)({ height: '100%', width: '100%' })
