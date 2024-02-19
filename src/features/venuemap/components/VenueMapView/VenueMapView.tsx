import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import MapView, { EdgePadding } from 'libs/maps/maps'

type Props = {
  padding: EdgePadding
}

export const VenueMapView: FunctionComponent<Props> = ({ padding }) => {
  return <StyledMapView showsUserLocation mapPadding={padding} />
}

const StyledMapView = styled(MapView)({ height: '100%', width: '100%' })
