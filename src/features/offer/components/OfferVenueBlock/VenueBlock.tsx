import React, { ComponentProps, FunctionComponent, useMemo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VenueInfoHeader } from 'ui/components/VenueInfoHeader/VenueInfoHeader'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { getSpacing } from 'ui/theme'

type Props = {
  venueId: number
  venueImageUrl?: string
  title?: string
  subtitle?: string
  onSeeVenuePress?: VoidFunction
  distance?: string | null
  thumbnailSize?: number
  hasVenuePage?: boolean
  shouldShowDistances?: boolean
}
const VENUE_THUMBNAIL_SIZE = getSpacing(14)

export const VenueBlock: FunctionComponent<Props> = ({
  venueId,
  venueImageUrl = '',
  title,
  subtitle,
  onSeeVenuePress,
  distance,
  thumbnailSize,
  hasVenuePage,
  shouldShowDistances = true,
}) => {
  const TouchableContainer: FunctionComponent<ComponentProps<typeof InternalTouchableLink>> =
    useMemo(
      () =>
        styled(hasVenuePage ? InternalTouchableLink : View)({
          flexDirection: 'row',
          maxWidth: 500,
        }),
      [hasVenuePage]
    )

  const shouldDisplayDistanceTag = shouldShowDistances && distance

  return (
    <React.Fragment>
      {shouldDisplayDistanceTag ? <StyledTag label={`à ${distance}`} /> : null}

      <TouchableContainer
        navigateTo={{ screen: 'Venue', params: { id: venueId } }}
        onBeforeNavigate={onSeeVenuePress}>
        <VenueInfoHeader
          title={title}
          subtitle={subtitle}
          imageSize={thumbnailSize ?? VENUE_THUMBNAIL_SIZE}
          showArrow={hasVenuePage}
          imageURL={venueImageUrl}
        />
      </TouchableContainer>
    </React.Fragment>
  )
}

const StyledTag = styled(Tag)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))
