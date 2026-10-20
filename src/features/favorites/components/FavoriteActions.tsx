import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { FavoriteResponse } from 'api/gen'
import { FavoriteButton } from 'ui/components/buttons/FavoriteButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Share } from 'ui/svg/icons/Share'

export type FavoriteActionsProps = {
  primaryAction?: React.ReactNode
  onSharePress: () => void
  shareAccessibilityLabel: string
  favorite: FavoriteResponse
  onRemove: () => void
  isRemoving: boolean
}

export const FavoriteActions: FunctionComponent<FavoriteActionsProps> = ({
  primaryAction,
  onSharePress,
  shareAccessibilityLabel,
  favorite,
  onRemove,
  isRemoving,
}) => {
  const entityId = favorite.offer.id

  return (
    <FavoriteActionsContainer gap={2}>
      {primaryAction}
      <Button
        variant="secondary"
        color="neutral"
        onPress={onSharePress}
        icon={StyledShare}
        accessibilityLabel={shareAccessibilityLabel}
        iconButton
      />
      <FavoriteButton
        offerId={entityId}
        removeFavorite={onRemove}
        isRemoveFavoriteLoading={isRemoving}
        favorite={favorite}
      />
    </FavoriteActionsContainer>
  )
}

export const FavoriteActionsContainer = styled(ViewGap)(({ theme }) => ({
  flexWrap: 'wrap',
  flexDirection: 'row',
  marginHorizontal: theme.designSystem.size.spacing.xl,
}))

const StyledShare = styled(Share).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``
