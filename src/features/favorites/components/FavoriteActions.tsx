import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { FavoriteArtistResponse, FavoriteOfferResponseV2, FavoriteVenueResponse } from 'api/gen'
import { FavoriteButton } from 'ui/components/buttons/FavoriteButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Share } from 'ui/svg/icons/Share'

export type FavoriteActionsProps = {
  primaryAction?: React.ReactNode
  onSharePress: () => void
  shareAccessibilityLabel: string
  favorite: FavoriteOfferResponseV2 | FavoriteArtistResponse | FavoriteVenueResponse
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
  const favoriteButtonProps = {
    removeFavorite: onRemove,
    isRemoveFavoriteLoading: isRemoving,
  }

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
      {'offer' in favorite ? (
        <FavoriteButton offerId={favorite.offer.id} favorite={favorite} {...favoriteButtonProps} />
      ) : null}
      {'artist' in favorite ? (
        <FavoriteButton
          artistId={favorite.artist.id}
          favorite={favorite}
          {...favoriteButtonProps}
        />
      ) : null}
      {'venue' in favorite ? (
        <FavoriteButton venueId={favorite.venue.id} favorite={favorite} {...favoriteButtonProps} />
      ) : null}
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
