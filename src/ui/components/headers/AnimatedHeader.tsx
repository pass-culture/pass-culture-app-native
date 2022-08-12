import { t } from '@lingui/macro'
import React, { useRef, useState } from 'react'
import { Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { FavoriteResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { SignUpSignInChoiceOfferModal } from 'features/offer/components/SignUpSignInChoiceOfferModal'
import { WebHead } from 'features/offer/components/WebHead'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ShareContent } from 'libs/share'
import { WebShareModal } from 'libs/share/WebShareModal'
import { getAnimationState } from 'ui/components/headers/animationHelpers'
import { HeaderIcon, HEADER_ICON_WIDTH } from 'ui/components/headers/HeaderIcon'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer, Typo } from 'ui/theme'
import { getTextAttrs } from 'ui/theme/typographyAttrs/getTextAttrs'

type ShareButton = {
  onSharePress: (id: number) => { share: () => Promise<void>; shareContent?: ShareContent }
  shareContentTitle?: string
}

type FavoriteButton = {
  onFavoritePress: () => void
  favoriteInformations?: FavoriteResponse
}

interface Props {
  headerTransition: Animated.AnimatedInterpolation
  title: string
  id: number
  shareButton: ShareButton
  favoriteButton?: FavoriteButton
  metaDescription?: string
}

/**
 * @param props.headerTransition should be between animated between 0 and 1
 */

const SPACING_BETWEEN_HEADER_ICONS = 3

export const AnimatedHeader: React.FC<Props> = ({
  headerTransition,
  title,
  id,
  metaDescription,
  shareButton,
  favoriteButton,
}: Props) => {
  const theme = useTheme()
  const { goBack } = useGoBack(...getTabNavConfig('Search'))
  const { animationState, backgroundColor } = getAnimationState(theme, headerTransition)
  const { top } = useSafeAreaInsets()

  const scaleFavoriteIconAnimatedValueRef = useRef(new Animated.Value(1))

  const {
    visible: shareModalVisible,
    showModal: showShareModal,
    hideModal: hideShareModal,
  } = useModal(false)

  const {
    visible: signInModalVisible,
    showModal: showSignInModal,
    hideModal: hideSignInModal,
  } = useModal(false)

  const { onSharePress, shareContentTitle } = shareButton
  const { share, shareContent } = onSharePress(id)
  const pressShare = () => {
    share()
    showShareModal()
  }

  const { isLoggedIn } = useAuthContext()
  const pressFavorite = () => {
    if (!favoriteButton) return
    if (!isLoggedIn) {
      showSignInModal()
    } else favoriteButton.onFavoritePress()
  }

  const [ariaHiddenTitle, setAriaHiddenTitle] = useState(true)
  headerTransition.addListener((opacity) => setAriaHiddenTitle(opacity.value !== 1))

  return (
    <React.Fragment>
      <WebHead title={title} description={metaDescription} />
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

          {!!favoriteButton && (
            <React.Fragment>
              <Spacer.Row numberOfSpaces={SPACING_BETWEEN_HEADER_ICONS} />
              <Spacer.Row numberOfSpaces={HEADER_ICON_WIDTH} testID="leftFavoriteIconPlaceholder" />
            </React.Fragment>
          )}

          <Spacer.Flex />

          <Title
            testID="headerTitle"
            style={{ opacity: headerTransition }}
            aria-hidden={ariaHiddenTitle}>
            <Body>{title}</Body>
          </Title>

          <Spacer.Flex />

          <HeaderIcon
            animationState={animationState}
            iconName="share"
            onPress={pressShare}
            testID={t`Partager`}
          />

          {!!favoriteButton && (
            <React.Fragment>
              <Spacer.Row numberOfSpaces={SPACING_BETWEEN_HEADER_ICONS} />
              <HeaderIcon
                animationState={animationState}
                scaleAnimatedValue={scaleFavoriteIconAnimatedValueRef.current}
                initialColor={
                  favoriteButton.favoriteInformations ? theme.colors.primary : undefined
                }
                iconName={favoriteButton.favoriteInformations ? 'favorite-filled' : 'favorite'}
                onPress={pressFavorite}
                testID={t`Mettre en favoris`}
                accessibilityRole={AccessibilityRole.CHECKBOX}
                accessibilityState={{ checked: !!favoriteButton.favoriteInformations }}
              />
            </React.Fragment>
          )}
          <Spacer.Row numberOfSpaces={6} />
        </Row>
        <Spacer.Column numberOfSpaces={2} />
      </HeaderContainer>

      {!!shareContent && (
        <WebShareModal
          visible={shareModalVisible}
          headerTitle={shareContentTitle ?? t`Partager`}
          shareContent={shareContent}
          dismissModal={hideShareModal}
        />
      )}

      {!!favoriteButton && (
        <SignUpSignInChoiceOfferModal
          visible={signInModalVisible}
          offerId={id}
          dismissModal={hideSignInModal}
        />
      )}
    </React.Fragment>
  )
}

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))

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
  numberOfLines: 1,
  ...getTextAttrs(),
})({
  flexShrink: 1,
  textAlign: 'center',
})
