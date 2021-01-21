import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Animated, Easing } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { SignUpSignInChoiceModal } from 'features/home/components/SignUpSignInChoiceModal'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useModal } from 'ui/components/modals/useModal'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

import { HeaderIcon } from '../atoms'
import { useShareOffer } from '../services/useShareOffer'

interface Props {
  headerTransition: Animated.AnimatedInterpolation
  title: string
  offerId: number
}
/**
 * @param headerTransition should be between animated between 0 and 1
 */
export const OfferHeader: React.FC<Props> = (props) => {
  const { headerTransition, offerId, title } = props
  const { isLoggedIn } = useAuthContext()
  const { visible: signInModalVisible, showModal: showSignInModal, hideModal } = useModal(false)
  const { goBack } = useNavigation<UseNavigationType>()
  const shareOffer = useShareOffer(offerId)

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

  const pressFavorite = () => {
    if (!isLoggedIn) {
      showSignInModal()
    }
  }

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
          <HeaderIcon animationState={animationState} iconName="favorite" onPress={pressFavorite} />
          <Spacer.Row numberOfSpaces={6} />
        </Row>
        <Spacer.Column numberOfSpaces={2} />
      </HeaderContainer>
      <SignUpSignInChoiceModal visible={signInModalVisible} dismissModal={hideModal} />
    </React.Fragment>
  )
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
const Title = styled(Animated.Text).attrs({ numberOfLines: 2 })({
  flexShrink: 1,
  textAlign: 'center',
})
