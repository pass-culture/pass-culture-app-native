import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { RightFilled } from 'ui/svg/icons/RightFilled'

type FavoriteArtistVenueProps = {
  title: string
  subtitle: string
  navigateTo: InternalNavigationProps['navigateTo']
  shareAccessibilityLabel: string
  thumbnailComponent?: React.ReactNode
  onPress?: () => void
}

export const FavoriteArtistVenue: FunctionComponent<FavoriteArtistVenueProps> = ({
  title,
  subtitle,
  navigateTo,
  shareAccessibilityLabel: _shareAccessibilityLabel,
  thumbnailComponent,
  onPress,
}) => {
  const { designSystem } = useTheme()

  const accessibilityLabel = getComputedAccessibilityLabel(title, subtitle)

  return (
    // Ajouter FavoriteAnimatedWrapper une fois le back prêt
    <ViewGap gap={4}>
      <StyledTouchableLink
        navigateTo={navigateTo}
        onBeforeNavigate={onPress}
        accessibilityLabel={accessibilityLabel}>
        <InfoHeader
          title={title}
          subtitle={subtitle}
          rightComponent={<RightFilled size={designSystem.size.icon.s} testID="RightFilled" />}
          thumbnailComponent={thumbnailComponent}
          defaultThumbnailSize={designSystem.size.image.xxs}
        />
      </StyledTouchableLink>
      {/* Ajouter FavoriteActions une fois le back prêt */}
    </ViewGap>
  )
}

const StyledTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
