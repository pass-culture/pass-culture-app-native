import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { VenueCaption } from 'features/home/atoms/VenueCaption'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { formatDistance } from 'libs/parsers'
import { QueryKeys } from 'libs/queryKeys'
import { VenueHit } from 'libs/search'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { ImageTile } from 'ui/components/ImageTile'
import { getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typography'
import { Link } from 'ui/web/link/Link'
export interface VenueTileProps {
  venue: VenueHit
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

export const VenueTile = (props: VenueTileProps) => {
  const [isFocus, setIsFocus] = useState(false)
  const { venue, width, height, userPosition } = props
  const navigation = useNavigation<UseNavigationType>()
  const queryClient = useQueryClient()

  const distance = formatDistance({ lat: venue.latitude, lng: venue.longitude }, userPosition)
  const accessibilityLabel = tileAccessibilityLabel(TileContentType.VENUE, { ...venue, distance })

  function handlePressVenue() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData([QueryKeys.VENUE, venue.id], mergeVenueData(venue))
    analytics.logConsultVenue({ venueId: venue.id, from: 'home' })
    navigation.navigate('Venue', { id: venue.id })
  }

  return (
    <View {...getHeadingAttrs(3)}>
      <TouchableHighlight
        height={height + MAX_VENUE_CAPTION_HEIGHT}
        width={width}
        onPress={handlePressVenue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        isFocus={isFocus}
        accessibilityLabel={accessibilityLabel}
        testID="venueTile">
        <Link
          to={{ screen: 'Venue', params: { id: venue.id } }}
          style={styles.link}
          accessible={false}>
          <Container>
            <VenueCaption
              width={width}
              name={venue.name}
              venueType={venue.venueTypeCode || null}
              distance={distance}
            />
            <ImageTile width={width} height={height} uri={venue.bannerUrl} />
          </Container>
        </Link>
      </TouchableHighlight>
    </View>
  )
}

const MAX_VENUE_CAPTION_HEIGHT = getSpacing(18)

const Container = styled.View({ flexDirection: 'column-reverse' })

const TouchableHighlight = styled.TouchableHighlight.attrs(({ theme }) => ({
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
  ...customFocusOutline(theme, undefined, isFocus),
}))

const styles = StyleSheet.create({
  link: {
    flexDirection: 'column-reverse',
    display: 'flex',
  },
})
