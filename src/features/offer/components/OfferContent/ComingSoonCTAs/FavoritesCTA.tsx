import React, { FC } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { FavoriteAuthModal } from 'features/offer/components/FavoriteAuthModal/FavoriteAuthModal'
import { FavoriteProps } from 'features/offer/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ModalSettings } from 'ui/components/modals/useModal'
import { Favorite } from 'ui/svg/icons/Favorite'
import { FavoriteFilled } from 'ui/svg/icons/FavoriteFilled'
import { Typo, getSpacing } from 'ui/theme'

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
          <ButtonSecondary
            wording="Retirer des favoris"
            onPress={onPressFavoriteCTA}
            icon={FavoriteFilled}
            isLoading={isRemoveFavoriteLoading}
          />
        </ButtonContainer>
      ) : (
        <ButtonContainer>
          <ButtonPrimary
            wording="Mettre en favori"
            onPress={onPressFavoriteCTA}
            icon={Favorite}
            isLoading={isAddFavoriteLoading}
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
  gap: getSpacing(2),
}))
const ButtonContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  ...(theme.isDesktopViewport ? { width: '50%' } : undefined),
}))

const Caption = styled(Typo.BodyAccentXs)({
  textAlign: 'center',
})
