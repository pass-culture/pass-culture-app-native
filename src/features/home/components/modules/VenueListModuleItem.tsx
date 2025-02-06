import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { VenueHit } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location'
import { getDistance } from 'libs/location/getDistance'
import { Tag } from 'ui/components/Tag/Tag'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VenuePreview } from 'ui/components/VenuePreview/VenuePreview'
import { getSpacing } from 'ui/theme'

const IMAGE_SIZE = 72
const isWeb = Platform.OS === 'web'

type Props = {
  item: VenueHit
  moduleId: string
  homeVenuesListEntryId?: string
}

export const VenueListModuleItem: FunctionComponent<Props> = ({
  item,
  moduleId,
  homeVenuesListEntryId,
}) => {
  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()
  const distanceFromOffer = getDistance(
    { lat: item.latitude, lng: item.longitude },
    { userLocation, selectedPlace, selectedLocationMode }
  )
  const address = [item.city, item.postalCode].filter(Boolean).join(', ')

  const handlePressVenue = () => {
    analytics.logConsultVenue({
      venueId: item.id,
      from: 'venueList',
      moduleId,
      homeEntryId: homeVenuesListEntryId,
    })
  }

  return (
    <StyledInternalTouchableLink
      navigateTo={{ screen: 'Venue', params: { id: item.id } }}
      onBeforeNavigate={handlePressVenue}>
      <VenuePreview
        address={address}
        venueName={item.name}
        imageHeight={IMAGE_SIZE}
        imageWidth={IMAGE_SIZE}
        bannerUrl={item.bannerUrl}>
        {distanceFromOffer ? <StyledTag label={distanceFromOffer} /> : null}
      </VenuePreview>
    </StyledInternalTouchableLink>
  )
}
const StyledTag = styled(Tag)(({ theme }) => ({
  backgroundColor: theme.colors.white,
}))

const StyledInternalTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  ...(isWeb && theme.isDesktopViewport ? { marginVertical: getSpacing(4), flex: 1 } : {}),
}))
