import React, { memo } from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { VenueTypeCodeKey } from 'api/gen'
import { VenueTypeLocationIcon } from 'features/home/components/modules/venues/VenueTypeLocationIcon'
import { SearchVenueItemDetails } from 'features/search/components/SearchVenueItemsDetails/SearchVenueItemDetails'
import { AlgoliaVenue } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { getDistance } from 'libs/location/getDistance'
import { useLocation } from 'libs/location/location'
import { mapVenueTypeToIcon } from 'libs/parsers/venueType'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { ImageTile } from 'ui/components/ImageTile'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface SearchVenueItemProps {
  venue: AlgoliaVenue
  width: number
  height: number
  searchId?: string
  searchGroupLabel?: ContentfulLabelCategories
}

const mergeVenueData = (venue: AlgoliaVenue) => (prevData: AlgoliaVenue | undefined) => ({
  ...venue,
  accessibility: {},
  ...(prevData ?? {}),
})

const UnmemoizedSearchVenueItem = ({
  venue,
  height,
  width,
  searchId,
  searchGroupLabel,
}: SearchVenueItemProps) => {
  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const { designSystem } = useTheme()
  const { lat, lng } = venue._geoloc
  const distance = getDistance({ lat, lng }, { userLocation, selectedPlace, selectedLocationMode })

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.VENUE, {
    ...venue,
    distance,
  })

  const hasVenueImage = !!venue.banner_url
  const imageUri = venue.banner_url ?? ''

  const handlePressVenue = () => {
    void analytics.logConsultVenue({
      venueId: venue.objectID,
      searchId,
      from: 'searchVenuePlaylist',
    })
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData([QueryKeys.VENUE, venue.objectID], mergeVenueData(venue))
  }

  return (
    <View {...getHeadingAttrs(3)}>
      <SearchVenueTouchableLink
        width={width}
        navigateTo={{
          screen: 'Venue',
          params: {
            id: Number(venue.objectID),
            from: 'venue',
            searchId,
            fromThematicSearch: searchGroupLabel,
          },
        }}
        onBeforeNavigate={handlePressVenue}
        onFocus={onFocus}
        onBlur={onBlur}
        isFocus={isFocus}
        accessibilityLabel={accessibilityLabel}>
        <View>
          {distance ? <StyledDistanceTag label={`à ${distance}`} /> : null}
          {hasVenueImage ? (
            <ImageTile width={width} height={height} uri={imageUri} />
          ) : (
            <SearchVenueTypeTile width={width} height={height} testID="venue-type-tile">
              <VenueTypeLocationIcon
                VenueTypeIcon={mapVenueTypeToIcon(venue.venue_type as VenueTypeCodeKey)}
                iconColor={designSystem.color.icon.subtle}
                backgroundColor={designSystem.color.background.subtle}
              />
            </SearchVenueTypeTile>
          )}
          <SearchVenueItemDetails
            width={width}
            name={venue.name}
            shortAddress={[venue.city, venue.postalCode].filter(Boolean).join(', ')}
          />
        </View>
      </SearchVenueTouchableLink>
    </View>
  )
}

export const SearchVenueItem = memo(UnmemoizedSearchVenueItem)

const SearchVenueTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  underlayColor: theme.designSystem.color.background.default,
}))<{
  width: number
  isFocus?: boolean
}>(({ width, theme, isFocus }) => ({
  width,
  marginVertical: theme.outline.width + theme.outline.offSet,
  borderRadius: theme.designSystem.size.borderRadius.m,
  ...customFocusOutline({ isFocus }),
}))

const SearchVenueTypeTile = styled.View<{ width: number; height: number }>(
  ({ theme, width, height }) => ({
    width: width,
    height: height,
    borderRadius: theme.designSystem.size.borderRadius.m,
    border: `1px solid ${theme.designSystem.color.border.subtle}`,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.designSystem.color.background.subtle,
  })
)

const StyledDistanceTag = styled(Tag)({
  flex: 1,
  position: 'absolute',
  zIndex: 2,
  top: 8,
  right: 8,
})
