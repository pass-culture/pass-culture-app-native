import React, { FC, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { FavoriteAuthModal } from 'features/offer/components/FavoriteAuthModal/FavoriteAuthModal'
import { FavoriteProps } from 'features/offer/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ModalSettings } from 'ui/components/modals/useModal'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { Favorite } from 'ui/svg/icons/Favorite'
import { FavoriteFilled } from 'ui/svg/icons/FavoriteFilled'
import { getSpacing, getShadow, Typo } from 'ui/theme'

export type StickyFooterContentProps = {
  offerId: number
  onPressFavoriteCTA: () => void
  favoriteAuthModal: ModalSettings
} & Partial<FavoriteProps>

type StickyFooterContentBaseProps = StickyFooterContentProps & PropsWithChildren

export const StickyFooterContentBase: FC<StickyFooterContentBaseProps> = ({
  offerId,
  isAddFavoriteLoading,
  isRemoveFavoriteLoading,
  favorite,
  onPressFavoriteCTA,
  favoriteAuthModal,
  children,
}) => {
  return (
    <StyledStickyFooterContentBase>
      <StickyFooterWrapper>
        <Caption>Cette offre sera bientôt disponible</Caption>
        {favorite ? (
          <ButtonSecondary
            wording="Retirer des favoris"
            onPress={onPressFavoriteCTA}
            icon={FavoriteFilled}
            isLoading={isRemoveFavoriteLoading}
          />
        ) : (
          <React.Fragment>
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
          </React.Fragment>
        )}
        {children}
      </StickyFooterWrapper>
    </StyledStickyFooterContentBase>
  )
}

const StyledStickyFooterContentBase = styled.View({
  marginTop: getSpacing(8),
})

const StickyFooterWrapper = styled(StickyBottomWrapper)(({ theme }) => ({
  backgroundColor: theme.colors.white,
  paddingTop: getSpacing(4),
  paddingHorizontal: getSpacing(6),
  paddingBottom: getSpacing(6),
  gap: getSpacing(2),
  ...getShadow({
    shadowOffset: { width: 0, height: getSpacing(1) },
    shadowRadius: getSpacing(5),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.25,
  }),
}))

const Caption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.black,
}))
