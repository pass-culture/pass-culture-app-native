import { useQueryClient } from '@tanstack/react-query'
import React, { memo } from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { VenueDetails } from 'features/home/components/modules/venues/VenueDetails'
import { VenueTypeLocationIcon } from 'features/home/components/modules/venues/VenueTypeLocationIcon'
import { VenueHit } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { getDistance } from 'libs/location/getDistance'
import { useLocation } from 'libs/location/location'
import { mapVenueTypeToIcon } from 'libs/parsers/venueType'
import { QueryKeys } from 'libs/queryKeys'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { ImageTile } from 'ui/components/ImageTile'
import { Tag } from 'ui/components/Tag/Tag'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export interface VenueTileProps {
  venue: VenueHit
  moduleName: string
  moduleId: string
  homeEntryId?: string
  width: number
  height: number
}

const mergeVenueData =
  (venueHit: VenueHit) =>
  (prevData: VenueResponse | undefined): VenueResponse => ({
    ...venueHit,
    isVirtual: false,
    timezone: '',
    ...(prevData ?? {}),
  })

const UnmemoizedVenueTile = (props: VenueTileProps) => {
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const { venue, width, height } = props
  const queryClient = useQueryClient()
  const { designSystem, tiles } = useTheme()
  const MAX_VENUE_CAPTION_HEIGHT = tiles.maxCaptionHeight.venue
  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()

  const distance = getDistance(
    { lat: venue.latitude, lng: venue.longitude },
    { userLocation, selectedPlace, selectedLocationMode }
  )

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.VENUE, { ...venue, distance })

  function handlePressVenue() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData([QueryKeys.VENUE, venue.id], mergeVenueData(venue))
    analytics.logConsultVenue({
      venueId: venue.id.toString(),
      moduleId: props.moduleId,
      moduleName: props.moduleName,
      from: 'home',
      homeEntryId: props.homeEntryId,
    })
  }

  return (
    <View {...getHeadingAttrs(3)}>
      <StyledTouchableLink
        height={height + MAX_VENUE_CAPTION_HEIGHT}
        width={width}
        navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
        onBeforeNavigate={handlePressVenue}
        onFocus={onFocus}
        onBlur={onBlur}
        isFocus={isFocus}
        accessibilityLabel={accessibilityLabel}>
        <View>
          {distance ? <StyledDistanceTag testID="distance-tag" label={`à ${distance}`} /> : null}
          {venue.bannerUrl ? (
            <ImageTile width={width} height={height} uri={venue.bannerUrl} />
          ) : (
            <VenueTypeTile width={width} height={height} testID="venue-type-tile">
              <VenueTypeLocationIcon
                VenueTypeIcon={mapVenueTypeToIcon(venue.venueTypeCode)}
                iconColor={designSystem.color.icon.subtle}
                backgroundColor={designSystem.color.background.subtle}
              />
            </VenueTypeTile>
          )}
          <VenueDetails
            width={width}
            name={venue.name}
            city={venue.city}
            postalCode={venue.postalCode}
          />
        </View>
      </StyledTouchableLink>
    </View>
  )
}

export const VenueTile = memo(UnmemoizedVenueTile)

const StyledTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  underlayColor: theme.designSystem.color.background.default,
}))<{
  height: number
  width: number
  isFocus?: boolean
}>(({ height, width, theme, isFocus }) => ({
  width,
  maxHeight: height,
  marginVertical: theme.outline.width + theme.outline.offSet,
  borderRadius: theme.designSystem.size.borderRadius.m,
  ...customFocusOutline({ isFocus }),
}))

const VenueTypeTile = styled.View<{ width: number; height: number }>(
  ({ theme, width, height }) => ({
    backgroundColor: theme.designSystem.color.background.subtle,
    width: width,
    height: height,
    borderRadius: theme.designSystem.size.borderRadius.m,
    border: `1px solid ${theme.designSystem.color.border.default}`,
    alignItems: 'center',
    justifyContent: 'center',
  })
)

const StyledDistanceTag = styled(Tag)({
  flex: 1,
  position: 'absolute',
  zIndex: 2,
  top: 8,
  right: 8,
})
