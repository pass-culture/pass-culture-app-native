import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { VenueHit } from 'libs/algolia/types'
import { analytics } from 'libs/analytics'
import { useLocation } from 'libs/location'
import { formatDistance } from 'libs/parsers/formatDistance'
import { Tag } from 'ui/components/Tag/Tag'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VenuePreview } from 'ui/components/VenuePreview/VenuePreview'
import { getSpacing } from 'ui/theme'

const IMAGE_SIZE = 72
const isWeb = Platform.OS === 'web'

type Props = {
  item: VenueHit
}

export const VenueListModuleItem: FunctionComponent<Props> = ({ item }) => {
  const { userLocation } = useLocation()
  const distance = formatDistance({ lat: item.latitude, lng: item.longitude }, userLocation)
  const address = [item.city, item.postalCode].filter(Boolean).join(', ')

  const handlePressVenue = () => {
    analytics.logConsultVenue({
      venueId: item.id,
      from: 'venueList',
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
        {distance ? <StyledTag label={distance} /> : null}
      </VenuePreview>
    </StyledInternalTouchableLink>
  )
}
const StyledTag = styled(Tag)(({ theme }) => ({
  backgroundColor: isWeb ? theme.colors.greyLight : theme.colors.white,
}))

const StyledInternalTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  ...(isWeb && theme.isDesktopViewport ? { marginVertical: getSpacing(4), flex: 1 } : {}),
}))
