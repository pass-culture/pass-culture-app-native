import { useRoute } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { Animated, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useAddFavorite, useFavorite, useRemoveFavorite } from 'features/favorites/api'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { SignUpSignInChoiceOfferModal } from 'features/offer/components/SignUpSignInChoiceOfferModal/SignUpSignInChoiceOfferModal'
import { analytics } from 'libs/firebase/analytics'
import { useWhiteStatusBar } from 'libs/hooks/useWhiteStatusBar'
import { WebShareModal } from 'libs/share/WebShareModal'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { getAnimationState } from 'ui/animations/helpers/getAnimationState'
import { HeaderIcon } from 'ui/components/headers/HeaderIcon'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spacer, Typo } from 'ui/theme'

import { useShareOffer } from '../../helpers/useShareOffer'

interface Props {
  headerTransition: Animated.AnimatedInterpolation
  title: string
  offerId: number
}

/**
 * @param props.headerTransition should be between animated between 0 and 1
 */
export const OfferHeader: React.FC<Props> = (props) => {
  useWhiteStatusBar()
  const { headerTransition, offerId, title } = props
  const { isLoggedIn } = useAuthContext()
  const theme = useTheme()
  const {
    visible: signInModalVisible,
    showModal: showSignInModal,
    hideModal: hideSignInModal,
  } = useModal(false)
  const {
    visible: shareOfferModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal(false)

  const { goBack } = useGoBack(...getTabNavConfig('Search'))
  const { share: shareOffer, shareContent } = useShareOffer(offerId)
  const { params } = useRoute<UseRouteType<'Offer'>>()
  const favorite = useFavorite({ offerId })
  const { showErrorSnackBar } = useSnackBarContext()
  const { top } = useSafeAreaInsets()

  const [ariaHiddenTitle, setAriaHiddenTitle] = useState(true)
  headerTransition.addListener((opacity) => setAriaHiddenTitle(opacity.value !== 1))

  const { mutate: addFavorite } = useAddFavorite({
    onSuccess: () => {
      if (typeof offerId === 'number') {
        const { from, moduleName, moduleId } = params
        analytics.logHasAddedOfferToFavorites({ from, offerId, moduleName, moduleId })
      }
    },
  })

  const { mutate: removeFavorite } = useRemoveFavorite({
    onError: () => {
      showErrorSnackBar({
        message: 'L’offre n’a pas été retirée de tes favoris',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const { animationState, backgroundColor } = getAnimationState(theme, headerTransition)
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

  const pressShareOffer = () => {
    shareOffer()
    showShareOfferModal()
  }

  return (
    <React.Fragment>
      <HeaderContainer style={{ backgroundColor }} safeAreaTop={top}>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={2} />
        <Row>
          <Spacer.Row numberOfSpaces={6} />
          <HeaderIcon
            animationState={animationState}
            iconName="back"
            onPress={goBack}
            accessibilityLabel="Revenir en arrière"
          />
          <Spacer.Row numberOfSpaces={3} />
          <Spacer.Row testID="leftShareIconPlaceholder" numberOfSpaces={10} />
          <Spacer.Flex />

          <Title
            testID="offerHeaderName"
            style={{ opacity: headerTransition }}
            accessibilityHidden={ariaHiddenTitle}>
            <Body>{title}</Body>
          </Title>

          <Spacer.Flex />
          <HeaderIcon
            animationState={animationState}
            iconName="share"
            onPress={pressShareOffer}
            accessibilityLabel="Partager"
          />
          <Spacer.Row numberOfSpaces={3} />
          <HeaderIcon
            animationState={animationState}
            scaleAnimatedValue={scaleFavoriteIconAnimatedValueRef.current}
            initialColor={favorite ? theme.colors.primary : undefined}
            iconName={favorite ? 'favorite-filled' : 'favorite'}
            onPress={pressFavorite}
            {...accessibleCheckboxProps({ checked: !!favorite, label: 'Mettre en favoris' })}
          />
          <Spacer.Row numberOfSpaces={6} />
        </Row>
        <Spacer.Column numberOfSpaces={2} />
      </HeaderContainer>
      {shareContent ? (
        <WebShareModal
          visible={shareOfferModalVisible}
          headerTitle="Partager l'offre"
          shareContent={shareContent}
          dismissModal={hideShareOfferModal}
        />
      ) : null}
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

const HeaderContainer = styled(Animated.View)<{ safeAreaTop: number }>(
  ({ theme, safeAreaTop }) => ({
    position: 'absolute',
    top: 0,
    height: theme.appBarHeight + safeAreaTop,
    width: '100%',
    zIndex: theme.zIndex.header,
  })
)

const Row = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})

const Title = styled(Animated.Text).attrs({
  numberOfLines: 2,
})(({ theme }) => ({
  flexShrink: 1,
  textAlign: 'center',
  color: theme.colors.white,
  ...(Platform.OS === 'web' ? { whiteSpace: 'pre-wrap' } : {}),
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
