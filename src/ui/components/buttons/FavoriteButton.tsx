import React, { useCallback, useRef } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { FavoriteAuthModal } from 'features/offer/components/FavoriteAuthModal/FavoriteAuthModal'
import { ArtistFavoriteProps, OfferFavoriteProps } from 'features/offer/types'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { useModal } from 'ui/components/modals/useModal'
import { Button } from 'ui/designSystem/Button/Button'
import { Favorite } from 'ui/svg/icons/Favorite'
import { FavoriteFilled } from 'ui/svg/icons/FavoriteFilled'

export type FavoriteButtonProps =
  | ({ offerId: number; artistId?: never; venueId?: never } & OfferFavoriteProps)
  | ({ artistId: string; offerId?: never; venueId?: never } & ArtistFavoriteProps)

export const FavoriteButton: React.FC<FavoriteButtonProps> = (props) => {
  const {
    offerId,
    artistId,
    favorite,
    addFavorite,
    removeFavorite,
    isAddFavoriteLoading,
    isRemoveFavoriteLoading,
  } = props

  const {
    visible: signInModalVisible,
    showModal: showSignInModal,
    hideModal: hideSignInModal,
  } = useModal(false)

  const { isLoggedIn } = useAuthContext()

  const scaleFavoriteIconAnimatedValueRef = useRef(new Animated.Value(1))

  const pressFavorite = useCallback(async () => {
    if (!isLoggedIn) {
      showSignInModal()
      return
    }

    if (favorite) {
      removeFavorite(favorite.id)
      return
    }

    animateIcon(scaleFavoriteIconAnimatedValueRef.current)

    if (artistId) {
      addFavorite?.({ artistId })
    } else if (offerId) {
      addFavorite?.({ offerId })
    }
  }, [addFavorite, artistId, favorite, isLoggedIn, offerId, removeFavorite, showSignInModal])

  const accessibilityLabel = favorite ? 'Retirer des favoris' : 'Mettre en favori'
  const checkboxProps = accessibleCheckboxProps({ checked: !!favorite, label: accessibilityLabel })
  return (
    <React.Fragment>
      <Button
        iconButton
        variant="secondary"
        color={favorite ? 'brand' : 'neutral'}
        icon={favorite ? FavoriteFilled : Favorite}
        onPress={pressFavorite}
        disabled={isRemoveFavoriteLoading || isAddFavoriteLoading}
        {...checkboxProps}
        accessibilityLabel={checkboxProps.accessibilityLabel ?? accessibilityLabel}
      />
      {/*  TODO(PC-35063): Fix this dirty style hack by removing this modal outside the button ! */}
      <ModalWrapper>
        <FavoriteAuthModal
          visible={signInModalVisible}
          offerId={offerId}
          artistId={artistId}
          dismissModal={hideSignInModal}
        />
      </ModalWrapper>
    </React.Fragment>
  )
}

const ModalWrapper = styled.View({
  position: 'absolute',
})

function animateIcon(animatedValue: Animated.Value): void {
  Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 1.3,
      duration: 200,
      useNativeDriver: false,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }),
  ]).start()
}
