import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { FavoriteArtistResponse, FavoriteVenueResponse } from 'api/gen'
import { FavoriteActions } from 'features/favorites/components/FavoriteActions'
import { FavoriteAnimatedWrapper } from 'features/favorites/components/FavoriteAnimatedWrapper'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { RightFilled } from 'ui/svg/icons/RightFilled'

type FavoriteArtistVenueProps = {
  favorite: FavoriteArtistResponse | FavoriteVenueResponse
  title: string
  subtitle?: string
  navigateTo: InternalNavigationProps['navigateTo']
  shareAccessibilityLabel: string
  isRemoving: boolean
  onRemove: () => void
  onSharePress: () => void
  thumbnailComponent?: React.ReactNode
  onPress?: () => void
}

export const FavoriteArtistVenue: FunctionComponent<FavoriteArtistVenueProps> = ({
  favorite,
  title,
  subtitle,
  navigateTo,
  shareAccessibilityLabel,
  isRemoving,
  onRemove,
  onSharePress,
  thumbnailComponent,
  onPress,
}) => {
  const { designSystem } = useTheme()

  const accessibilityLabel = getComputedAccessibilityLabel(title, subtitle)

  return (
    <FavoriteAnimatedWrapper onAnimationEnd={onRemove}>
      {(triggerRemoveAnimation) => (
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
              defaultThumbnailSize={designSystem.size.image['2xs']}
            />
          </StyledTouchableLink>
          <FavoriteActions
            favorite={favorite}
            isRemoving={isRemoving}
            onRemove={triggerRemoveAnimation}
            onSharePress={onSharePress}
            shareAccessibilityLabel={shareAccessibilityLabel}
          />
        </ViewGap>
      )}
    </FavoriteAnimatedWrapper>
  )
}

const StyledTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
