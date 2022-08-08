import React, { memo, useState } from 'react'
import { View } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { VenueCaption } from 'features/home/atoms/VenueCaption'
import { analytics } from 'libs/firebase/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { formatDistance } from 'libs/parsers'
import { QueryKeys } from 'libs/queryKeys'
import { VenueHit } from 'libs/search'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { ImageTile } from 'ui/components/ImageTile'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
export interface VenueTileProps {
  venue: VenueHit
  moduleName: string
  moduleId: string
  width: number
  height: number
  userPosition: GeoCoordinates | null
}

const mergeVenueData =
  (venueHit: VenueHit) =>
  (prevData: VenueResponse | undefined): VenueResponse => ({
    ...venueHit,
    isVirtual: false,
    ...(prevData || {}),
  })

const UnmemoizedVenueTile = (props: VenueTileProps) => {
  const [isFocus, setIsFocus] = useState(false)
  const { venue, width, height, userPosition } = props
  const queryClient = useQueryClient()

  const distance = formatDistance({ lat: venue.latitude, lng: venue.longitude }, userPosition)
  const accessibilityLabel = tileAccessibilityLabel(TileContentType.VENUE, { ...venue, distance })

  function handlePressVenue() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData([QueryKeys.VENUE, venue.id], mergeVenueData(venue))
    analytics.logConsultVenue({
      venueId: venue.id,
      moduleId: props.moduleId,
      moduleName: props.moduleName,
      from: 'home',
    })
  }

  return (
    <View {...getHeadingAttrs(3)}>
      <StyledTouchableLink
        height={height + MAX_VENUE_CAPTION_HEIGHT}
        width={width}
        navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
        onPress={handlePressVenue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        isFocus={isFocus}
        accessibilityLabel={accessibilityLabel}
        testID="venueTile">
        <Container>
          <VenueCaption
            width={width}
            name={venue.name}
            venueType={venue.venueTypeCode || null}
            distance={distance}
          />
          <ImageTile width={width} height={height} uri={venue.bannerUrl} />
        </Container>
      </StyledTouchableLink>
    </View>
  )
}

export const VenueTile = memo(UnmemoizedVenueTile)

const MAX_VENUE_CAPTION_HEIGHT = getSpacing(18)

const Container = styled.View({ flexDirection: 'column-reverse' })

const StyledTouchableLink = styled(TouchableLink).attrs(({ theme }) => ({
  underlayColor: theme.colors.white,
}))<{
  height: number
  width: number
  isFocus?: boolean
}>(({ height, width, theme, isFocus }) => ({
  width,
  maxHeight: height,
  marginVertical: theme.outline.width + theme.outline.offSet,
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline(theme, theme.colors.black, isFocus),
}))
