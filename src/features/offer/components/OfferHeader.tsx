import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React, { useRef } from 'react'
import { Animated, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { isApiError } from 'api/apiHelpers'
import { useAuthContext } from 'features/auth/AuthContext'
import {
  useAddFavorite,
  useFavorite,
  useRemoveFavorite,
} from 'features/favorites/pages/useFavorites'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { SignUpSignInChoiceOfferModal } from 'features/offer/components/SignUpSignInChoiceOfferModal'
import { analytics } from 'libs/analytics'
import { WebShareModal } from 'libs/share/WebShareModal'
import { getAnimationState } from 'ui/components/headers/animationHelpers'
import { HeaderIcon } from 'ui/components/headers/HeaderIcon'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spacer, Typo } from 'ui/theme'

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
  const { colors } = useTheme()
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

  const { animationState, backgroundColor } = getAnimationState(headerTransition)
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
            testID={t`Revenir en arrière`}
          />
          <Spacer.Row numberOfSpaces={3} />
          <Spacer.Row testID="leftShareIconPlaceholder" numberOfSpaces={10} />
          <Spacer.Flex />

          <Title testID="offerHeaderName" style={{ opacity: headerTransition }}>
            <Body>{title}</Body>
          </Title>

          <Spacer.Flex />
          <HeaderIcon
            animationState={animationState}
            iconName="share"
            onPress={pressShareOffer}
            testID={t`Partager`}
          />
          <Spacer.Row numberOfSpaces={3} />
          <HeaderIcon
            animationState={animationState}
            scaleAnimatedValue={scaleFavoriteIconAnimatedValueRef.current}
            initialColor={favorite ? colors.primary : undefined}
            iconName={favorite ? 'favorite-filled' : 'favorite'}
            onPress={pressFavorite}
            testID={t`Mettre en favoris`}
          />
          <Spacer.Row numberOfSpaces={6} />
        </Row>
        <Spacer.Column numberOfSpaces={2} />
      </HeaderContainer>
      {shareContent ? (
        <WebShareModal
          visible={shareOfferModalVisible}
          headerTitle={t`Partager l'offre`}
          shareContent={shareContent}
          dismissModal={hideShareOfferModal}
        />
      ) : null}
      <SignUpSignInChoiceOfferModal visible={signInModalVisible} dismissModal={hideSignInModal} />
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
const Title = styled(Animated.Text).attrs({ numberOfLines: 2 })(({ theme }) => ({
  flexShrink: 1,
  textAlign: 'center',
  color: theme.colors.white,
  ...(Platform.OS === 'web' ? { whiteSpace: 'pre-wrap' } : {}),
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
