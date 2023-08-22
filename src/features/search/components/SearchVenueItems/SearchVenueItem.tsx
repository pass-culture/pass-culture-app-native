import React, { memo } from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { VenueTypeLocationIcon } from 'features/home/components/modules/venues/VenueTypeLocationIcon'
import { DistanceTag } from 'features/offer/components/DistanceTag/DistanceTag'
import { SearchVenueItemDetails } from 'features/search/components/SearchVenueItemsDetails/SearchVenueItemDetails'
import { AlgoliaVenue } from 'libs/algolia'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { mapVenueTypeToIcon, VenueTypeCode } from 'libs/parsers'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { ImageTile } from 'ui/components/ImageTile'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export interface SearchVenueItemProps {
  venue: AlgoliaVenue
  width: number
  height: number
}

const MAX_VENUE_CAPTION_HEIGHT = getSpacing(18)

const mergeVenueData = (venue: AlgoliaVenue) => (prevData: AlgoliaVenue | undefined) => ({
  ...venue,
  accessibility: {},
  ...(prevData ?? {}),
})

const UnmemoizedSearchVenueItem = ({ venue, height, width }: SearchVenueItemProps) => {
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const { colors } = useTheme()
  const { lat, lng } = venue._geoloc
  const distance = useDistance({ lat, lng })

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.VENUE, { ...venue, distance })

  const hasVenueImage = !!venue.banner_url
  const imageUri = venue.banner_url ?? ''

  function handlePressVenue() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData([QueryKeys.VENUE, venue.objectID], mergeVenueData(venue))
  }

  return (
    <View {...getHeadingAttrs(3)}>
      <SearchVenueTouchableLink
        height={height + MAX_VENUE_CAPTION_HEIGHT}
        width={width}
        navigateTo={{ screen: 'Venue', params: { id: Number(venue.objectID) } }}
        onBeforeNavigate={handlePressVenue}
        onFocus={onFocus}
        onBlur={onBlur}
        isFocus={isFocus}
        accessibilityLabel={accessibilityLabel}>
        <View>
          {!!distance && <StyledDistanceTag distance={distance} />}
          {hasVenueImage ? (
            <ImageTile width={width} height={height} uri={imageUri} />
          ) : (
            <SearchVenueTypeTile width={width} height={height} testID="venue-type-tile">
              <VenueTypeLocationIcon
                VenueTypeIcon={mapVenueTypeToIcon(venue.venue_type as VenueTypeCode)}
                iconColor={colors.greySemiDark}
                backgroundColor={colors.greyLight}
              />
            </SearchVenueTypeTile>
          )}
          <SearchVenueItemDetails width={width} name={venue.name} city={venue.city} />
        </View>
      </SearchVenueTouchableLink>
    </View>
  )
}

export const SearchVenueItem = memo(UnmemoizedSearchVenueItem)

const SearchVenueTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
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
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))

const SearchVenueTypeTile = styled.View<{ width: number; height: number }>(
  ({ theme, width, height }) => ({
    width: width,
    height: height,
    borderRadius: theme.borderRadius.radius,
    border: `1px solid ${theme.colors.greySemiDark}`,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.greyLight,
  })
)

const StyledDistanceTag = styled(DistanceTag)({
  flex: 1,
  position: 'absolute',
  zIndex: 2,
  top: 8,
  right: 8,
})
