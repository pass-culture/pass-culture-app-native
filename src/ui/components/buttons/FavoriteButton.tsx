import React, { useCallback, useRef } from 'react'
import { Animated } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { FavoriteAuthModal } from 'features/offer/components/FavoriteAuthModal/FavoriteAuthModal'
import { FavoriteProps } from 'features/offer/types'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
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
  const { designSystem } = useTheme()

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
        initialColor={favorite ? designSystem.color.background.brandPrimary : undefined}
        finalColor={
          favorite
            ? designSystem.color.background.brandPrimary
            : designSystem.color.background.inverted
        }
        iconName={favorite ? 'favorite-filled' : 'favorite'}
        onPress={pressFavorite}
        disabled={isRemoveFavoriteLoading || isAddFavoriteLoading}
        {...accessibleCheckboxProps({ checked: !!favorite, label: 'Mettre en favori' })}
      />
      {/*  TODO(PC-35063): Fix this dirty style hack by removing this modal outside the button ! */}
      <ModalWrapper>
        <FavoriteAuthModal
          visible={signInModalVisible}
          offerId={offerId}
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
