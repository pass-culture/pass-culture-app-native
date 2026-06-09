import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { accessibilityRoleInternalNavigation } from 'shared/accessibility/helpers/accessibilityRoleInternalNavigation'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VenueInfoHeader } from 'ui/components/VenueInfoHeader/VenueInfoHeader'
import { Tag } from 'ui/designSystem/Tag/Tag'

type Props = {
  venueId: number
  isOfferAtSameAddressAsVenue: boolean
  venueImageUrl?: string
  title?: string
  subtitle?: string
  onSeeVenuePress?: VoidFunction
  distance?: string | null
  thumbnailSize?: number
  hasVenuePage?: boolean
  shouldShowDistances?: boolean
}

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
  isOfferAtSameAddressAsVenue,
}) => {
  const { designSystem } = useTheme()
  const shouldDisplayDistanceTag = shouldShowDistances && distance
  const isClickableVenueLink = isOfferAtSameAddressAsVenue && hasVenuePage

  const renderVenueHeader = (showArrow: boolean) => (
    <VenueInfoHeader
      title={title}
      subtitle={subtitle}
      imageSize={thumbnailSize ?? designSystem.size.image.s}
      imageURL={venueImageUrl}
      showArrow={showArrow}
    />
  )

  const computedAccessibilityLabel = getComputedAccessibilityLabel(title, subtitle)

  return (
    <React.Fragment>
      {shouldDisplayDistanceTag ? <StyledTag label={`à ${distance}`} /> : null}

      {isClickableVenueLink ? (
        <VenueRowLinkContainer
          navigateTo={{ screen: 'Venue', params: { id: venueId } }}
          onBeforeNavigate={onSeeVenuePress}
          accessibilityLabel={computedAccessibilityLabel}
          accessibilityRole={accessibilityRoleInternalNavigation()}>
          {renderVenueHeader(true)}
        </VenueRowLinkContainer>
      ) : null}

      {isOfferAtSameAddressAsVenue && !hasVenuePage ? (
        <VenueRowViewContainer>{renderVenueHeader(false)}</VenueRowViewContainer>
      ) : null}

      {!isOfferAtSameAddressAsVenue && renderVenueHeader(false)}
    </React.Fragment>
  )
}

const VenueRowBaseStyles = {
  flexDirection: 'row' as const,
  maxWidth: 500,
}

const VenueRowLinkContainer = styled(InternalTouchableLink)(VenueRowBaseStyles)

const VenueRowViewContainer = styled.View(VenueRowBaseStyles)

const StyledTag = styled(Tag)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))
