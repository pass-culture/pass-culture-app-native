import React, { FC } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { FavoriteAuthModal } from 'features/offer/components/FavoriteAuthModal/FavoriteAuthModal'
import { FavoriteProps } from 'features/offer/types'
import { ModalSettings } from 'ui/components/modals/useModal'
import { Button } from 'ui/designSystem/Button/Button'
import { Favorite } from 'ui/svg/icons/Favorite'
import { FavoriteFilled } from 'ui/svg/icons/FavoriteFilled'
import { Typo } from 'ui/theme'

type Props = {
  offerId: number
  onPressFavoriteCTA: () => void
  favoriteAuthModal: ModalSettings
  caption?: string
} & Partial<FavoriteProps>

export const FavoritesCTA: FC<Props> = ({
  offerId,
  isAddFavoriteLoading,
  isRemoveFavoriteLoading,
  favorite,
  onPressFavoriteCTA,
  favoriteAuthModal,
  caption,
}) => {
  return (
    <Container>
      {caption ? <Caption>{caption}</Caption> : null}
      {favorite ? (
        <ButtonContainer>
          <Button
            wording="Retirer des favoris"
            onPress={onPressFavoriteCTA}
            icon={FavoriteFilled}
            isLoading={isRemoveFavoriteLoading}
            variant="secondary"
            color="brand"
            accessibilityLabel="Retirer des favoris"
            fullWidth
          />
        </ButtonContainer>
      ) : (
        <ButtonContainer>
          <Button
            wording="Mettre en favori"
            onPress={onPressFavoriteCTA}
            icon={Favorite}
            isLoading={isAddFavoriteLoading}
            accessibilityLabel="Mettre en favori"
            fullWidth
          />
          <FavoriteAuthModal
            visible={favoriteAuthModal.visible}
            offerId={offerId}
            dismissModal={favoriteAuthModal.hideModal}
          />
        </ButtonContainer>
      )}
    </Container>
  )
}

const Container = styled(View)(({ theme }) => ({
  ...(theme.isDesktopViewport
    ? {
        flexDirection: 'row-reverse',
        justifyContent: 'start',
        alignItems: 'center',
      }
    : {}),
  gap: theme.designSystem.size.spacing.s,
}))
const ButtonContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  ...(theme.isDesktopViewport ? { width: '50%' } : undefined),
}))

const Caption = styled(Typo.BodyAccentXs)({
  textAlign: 'center',
})
