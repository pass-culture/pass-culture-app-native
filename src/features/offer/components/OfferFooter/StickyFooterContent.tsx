import React, { useState } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { FavoriteProps } from 'features/offer/components/OfferHeader/OfferHeader'
import { SignUpSignInChoiceOfferModal } from 'features/offer/components/SignUpSignInChoiceOfferModal/SignUpSignInChoiceOfferModal'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { useModal } from 'ui/components/modals/useModal'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { Bell } from 'ui/svg/icons/Bell'
import { BellFilled } from 'ui/svg/icons/BellFilled'
import { Favorite } from 'ui/svg/icons/Favorite'
import { FavoriteFilled } from 'ui/svg/icons/FavoriteFilled'
import { getSpacing, getShadow, TypoDS } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  offerId: number
} & FavoriteProps

export const StickyFooterContent = ({
  offerId,
  addFavorite,
  isAddFavoriteLoading,
  removeFavorite,
  isRemoveFavoriteLoading,
  favorite,
}: Props) => {
  const { isLoggedIn } = useAuthContext()

  const { bottom } = useCustomSafeInsets()
  const [hasEnabledNotifications, setHasEnabledNotifications] = useState(false)

  const {
    visible: signInModalVisible,
    showModal: showSignInModal,
    hideModal: hideSignInModal,
  } = useModal(false)

  const handleAddToFavorites = () => {
    if (isLoggedIn) {
      addFavorite({ offerId })
    } else {
      showSignInModal()
    }
  }

  const handleRemoveFromFavorites = () => {
    if (favorite) removeFavorite(favorite?.id)
  }

  return (
    <StickyFooterWrapper bottom={bottom}>
      <Caption>Cette offre sera bientôt disponible</Caption>
      {favorite ? (
        <ButtonSecondary
          wording="Retirer des favoris"
          onPress={handleRemoveFromFavorites}
          icon={FavoriteFilled}
          isLoading={isRemoveFavoriteLoading}
        />
      ) : (
        <React.Fragment>
          <ButtonPrimary
            wording="Mettre en favori"
            onPress={handleAddToFavorites}
            icon={Favorite}
            isLoading={isAddFavoriteLoading}
          />
          <SignUpSignInChoiceOfferModal
            visible={signInModalVisible}
            offerId={offerId}
            dismissModal={hideSignInModal}
          />
        </React.Fragment>
      )}
      <ButtonTertiaryBlack
        wording={hasEnabledNotifications ? 'Désactiver le rappel' : 'Ajouter un rappel'}
        onPress={() => setHasEnabledNotifications(!hasEnabledNotifications)}
        icon={hasEnabledNotifications ? BellFilled : Bell}
      />
    </StickyFooterWrapper>
  )
}

const StickyFooterWrapper = styled(StickyBottomWrapper)(({ theme, bottom }) => ({
  bottom,
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

const Caption = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.black,
}))
