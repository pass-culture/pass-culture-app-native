import { useRoute } from '@react-navigation/native'
import React, { useCallback, useRef } from 'react'
import { Animated } from 'react-native'

import { RecommendationApiParams } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useAddFavorite, useFavorite, useRemoveFavorite } from 'features/favorites/api'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SignUpSignInChoiceOfferModal } from 'features/offer/components/SignUpSignInChoiceOfferModal/SignUpSignInChoiceOfferModal'
import { analytics } from 'libs/analytics/provider'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { theme } from 'theme'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

interface Props {
  offerId: number
  animationState?: {
    iconBackgroundColor: Animated.AnimatedInterpolation<string | number>
    iconBorderColor: Animated.AnimatedInterpolation<string | number>
    transition: Animated.AnimatedInterpolation<string | number>
  }
  analyticsParams?: OfferAnalyticsParams
}

export const FavoriteButton: React.FC<Props> = (props) => {
  const { animationState, offerId } = props

  const {
    visible: signInModalVisible,
    showModal: showSignInModal,
    hideModal: hideSignInModal,
  } = useModal(false)

  const { isLoggedIn } = useAuthContext()
  const favorite = useFavorite({ offerId })
  const { showErrorSnackBar } = useSnackBarContext()
  const { params } = useRoute<UseRouteType<'Offer'>>()

  const apiRecoParams: RecommendationApiParams = params?.apiRecoParams
    ? JSON.parse(params?.apiRecoParams)
    : undefined

  const scaleFavoriteIconAnimatedValueRef = useRef(new Animated.Value(1))

  const { mutate: addFavorite, isLoading: addFavoriteIsLoading } = useAddFavorite({
    onSuccess: () => {
      if (typeof offerId === 'number' && (props.analyticsParams ?? params)) {
        const { from, moduleName, moduleId, searchId, playlistType } =
          props.analyticsParams ?? params
        analytics.logHasAddedOfferToFavorites({
          from,
          offerId,
          moduleName,
          moduleId,
          searchId,
          ...apiRecoParams,
          playlistType,
        })
      }
    },
  })

  const { mutate: removeFavorite, isLoading: removeFavoriteIsLoading } = useRemoveFavorite({
    onError: () => {
      showErrorSnackBar({
        message: 'L’offre n’a pas été retirée de tes favoris',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

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
        disabled={removeFavoriteIsLoading || addFavoriteIsLoading}
        {...accessibleCheckboxProps({ checked: !!favorite, label: 'Mettre en favoris' })}
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
