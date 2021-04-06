import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useRef } from 'react'
import { Animated, Easing } from 'react-native'
import styled from 'styled-components/native'

import { isApiError } from 'api/helpers'
import { useAuthContext } from 'features/auth/AuthContext'
import {
  useAddFavorite,
  useFavorite,
  useRemoveFavorite,
} from 'features/favorites/pages/useFavorites'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { SignUpSignInChoiceOfferModal } from 'features/offer/components/SignUpSignInChoiceOfferModal'
import { analytics } from 'libs/analytics'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

import { HeaderIcon } from '../atoms'
import { useShareOffer } from '../services/useShareOffer'

interface Props {
  headerTransition: Animated.AnimatedInterpolation
  title: string
  offerId: number
}
/**
 * @param props.headerTransition should be between animated between 0 and 1
 */
export const OfferHeader: React.FC<Props> = (props) => {
  const { headerTransition, offerId, title } = props
  const { isLoggedIn } = useAuthContext()
  const { visible: signInModalVisible, showModal: showSignInModal, hideModal } = useModal(false)
  const { goBack, setParams } = useNavigation<UseNavigationType>()
  const shareOffer = useShareOffer(offerId)
  const { params } = useRoute<UseRouteType<'Offer'>>()
  const favorite = useFavorite({ offerId })
  const { showErrorSnackBar } = useSnackBarContext()

  const { mutate: addFavorite } = useAddFavorite({
    onSuccess: () => {
      if (typeof offerId === 'number') {
        const { from, moduleName } = params
        analytics.logHasAddedOfferToFavorites({ from, offerId, moduleName })
      }
    },
    onError: (error) => {
      showErrorSnackBar({
        message:
          isApiError(error) && error.content.code === 'MAX_FAVORITES_REACHED'
            ? t`Trop de favoris enregistrés. Supprime des favoris pour en ajouter de nouveaux.`
            : t`L'offre n'a pas été ajoutée à tes favoris`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const { mutate: removeFavorite } = useRemoveFavorite({
    onError: () => {
      showErrorSnackBar({
        message: t`L'offre n'a pas été retirée de tes favoris`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const iconBackgroundColor = headerTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [ColorsEnum.WHITE, 'rgba(255, 255, 255, 0)'],
    easing: Easing.bezier(0, 0.75, 0, 0.75),
  })
  const iconBorderColor = headerTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [ColorsEnum.GREY_LIGHT, 'rgba(255, 255, 255, 0)'],
    easing: Easing.bezier(0, 1, 0, 1),
  })
  const headerBackgroundColor = headerTransition.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0)', ColorsEnum.PRIMARY],
  })

  const animationState = { iconBackgroundColor, iconBorderColor, transition: headerTransition }

  const scaleFavoriteIconAnimatedValueRef = useRef(new Animated.Value(1))
  function pressFavorite() {
    if (!isLoggedIn) {
      showSignInModal()
    } else if (!favorite) {
      animateIcon(scaleFavoriteIconAnimatedValueRef.current)
      addFavorite({ offerId })
    } else if (favorite) {
      removeFavorite(favorite.id)
    }
  }

  function hideSignInModal() {
    setParams({ shouldDisplayLoginModal: false })
    hideModal()
  }

  useFocusEffect(() => {
    if (params.shouldDisplayLoginModal) {
      showSignInModal()
    }
  })

  return (
    <React.Fragment>
      <HeaderContainer style={{ backgroundColor: headerBackgroundColor }}>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={2} />
        <Row>
          <Spacer.Row numberOfSpaces={6} />
          <HeaderIcon animationState={animationState} iconName="back" onPress={goBack} />
          <Spacer.Row numberOfSpaces={3} />
          <Spacer.Row testID="leftShareIconPlaceholder" numberOfSpaces={10} />
          <Spacer.Flex />

          <Title testID="offerHeaderName" style={{ opacity: headerTransition }}>
            <Typo.Body color={ColorsEnum.WHITE}>{title}</Typo.Body>
          </Title>

          <Spacer.Flex />
          <HeaderIcon animationState={animationState} iconName="share" onPress={shareOffer} />
          <Spacer.Row numberOfSpaces={3} />
          <HeaderIcon
            animationState={animationState}
            scaleAnimatedValue={scaleFavoriteIconAnimatedValueRef.current}
            initialColor={favorite ? ColorsEnum.PRIMARY : undefined}
            iconName={favorite ? 'favorite-filled' : 'favorite'}
            onPress={pressFavorite}
          />
          <Spacer.Row numberOfSpaces={6} />
        </Row>
        <Spacer.Column numberOfSpaces={2} />
      </HeaderContainer>
      <SignUpSignInChoiceOfferModal
        visible={signInModalVisible}
        dismissModal={hideSignInModal}
        id={params.id}
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

const HeaderContainer = styled(Animated.View)({
  position: 'absolute',
  top: 0,
  width: '100%',
})
const Row = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})
const Title = styled(Animated.Text).attrs({ numberOfLines: 1 })({
  flexShrink: 1,
  textAlign: 'center',
})
