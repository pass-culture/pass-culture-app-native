import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useGetAllVenues } from 'features/venuemap/useGetAllVenues'
import MapView, { EdgePadding, Marker } from 'libs/maps/maps'

type Props = {
  padding: EdgePadding
}

export const VenueMapView: FunctionComponent<Props> = ({ padding }) => {
  const { data: venues = [] } = useGetAllVenues()

  return (
    <StyledMapView showsUserLocation mapPadding={padding}>
      {venues.map((venue) => (
        <React.Fragment key={venue.venueId}>
          {venue._geoloc?.lat && venue._geoloc.lng ? (
            <Marker
              coordinate={{
                latitude: venue._geoloc.lat,
                longitude: venue._geoloc.lng,
              }}
            />
          ) : null}
        </React.Fragment>
      ))}
    </StyledMapView>
  )
}

const StyledMapView = styled(MapView)({ height: '100%', width: '100%' })
