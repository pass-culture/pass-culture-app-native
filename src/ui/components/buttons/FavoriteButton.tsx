import React, { useCallback, useRef } from 'react'
import { Animated } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { FavoriteProps } from 'features/offer/components/OfferHeader/OfferHeader'
import { SignUpSignInChoiceOfferModal } from 'features/offer/components/SignUpSignInChoiceOfferModal/SignUpSignInChoiceOfferModal'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { theme } from 'theme'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { useModal } from 'ui/components/modals/useModal'

export type FavoriteButtonProps = {
  offerId: number
  animationState?: {
    iconBackgroundColor: Animated.AnimatedInterpolation<string | number>
    iconBorderColor: Animated.AnimatedInterpolation<string | number>
    transition: Animated.AnimatedInterpolation<string | number>
  }
} & FavoriteProps

export const FavoriteButton: React.FC<FavoriteButtonProps> = (props) => {
  const {
    animationState,
    offerId,
    addFavorite,
    isAddFavoriteLoading,
    removeFavorite,
    isRemoveFavoriteLoading,
    favorite,
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
    } else if (favorite) {
      removeFavorite(favorite.id)
    } else {
      animateIcon(scaleFavoriteIconAnimatedValueRef.current)
      addFavorite({ offerId })
    }
  }, [addFavorite, favorite, isLoggedIn, offerId, removeFavorite, showSignInModal])
  return (
    <React.Fragment>
      <RoundedButton
        animationState={animationState}
        scaleAnimatedValue={scaleFavoriteIconAnimatedValueRef.current}
        initialColor={favorite ? theme.colors.primary : undefined}
        finalColor={favorite ? theme.colors.primary : theme.colors.black}
        iconName={favorite ? 'favorite-filled' : 'favorite'}
        onPress={pressFavorite}
        disabled={isRemoveFavoriteLoading || isAddFavoriteLoading}
        {...accessibleCheckboxProps({ checked: !!favorite, label: 'Mettre en favori' })}
      />
      <SignUpSignInChoiceOfferModal
        visible={signInModalVisible}
        offerId={offerId}
        dismissModal={hideSignInModal}
      />
    </React.Fragment>
  )
}

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
