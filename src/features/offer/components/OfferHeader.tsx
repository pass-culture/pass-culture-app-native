import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Animated, Easing } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { ColorsEnum, Spacer } from 'ui/theme'

import { HeaderIcon } from '../atoms'

interface Props {
  headerTransition: Animated.AnimatedInterpolation
}
/**
 * @param headerTransition should be between animated between 0 and 1
 */
export const OfferHeader: React.FC<Props> = ({ headerTransition }) => {
  const { isLoggedIn } = useAuthContext()
  const { goBack } = useNavigation()

  const iconBackgroundColor = headerTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [ColorsEnum.WHITE, 'rgba(255, 255, 255, 0)'],
    easing: Easing.bezier(0, 0.75, 0, 0.75),
  })
  const iconBorderColor = headerTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [ColorsEnum.GREY_LIGHT, 'rgba(255, 255, 255, 0)'],
    easing: Easing.bezier(0, 0.75, 0, 0.75),
  })
  const headerBackgroundColor = headerTransition.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0)', ColorsEnum.PRIMARY],
  })

  return (
    <HeaderContainer style={{ backgroundColor: headerBackgroundColor }}>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={4} />
      <Row>
        <Spacer.Row numberOfSpaces={6} />
        <HeaderIcon
          animationState={{ iconBackgroundColor, iconBorderColor, transition: headerTransition }}
          iconName="back"
          onPress={goBack}
        />
        <RightIcons>
          <HeaderIcon
            animationState={{ iconBackgroundColor, iconBorderColor, transition: headerTransition }}
            iconName="share"
            onPress={() => null}
          />
          {isLoggedIn && (
            <React.Fragment>
              <Spacer.Row numberOfSpaces={3} />
              <HeaderIcon
                animationState={{
                  iconBackgroundColor,
                  iconBorderColor,
                  transition: headerTransition,
                }}
                iconName="favorite"
                onPress={() => null}
              />
            </React.Fragment>
          )}
        </RightIcons>
        <Spacer.Row numberOfSpaces={6} />
      </Row>
      <Spacer.Column numberOfSpaces={2} />
    </HeaderContainer>
  )
}
const HeaderContainer = styled(Animated.View)({
  position: 'absolute',
  top: 0,
  width: '100%',
})
const Row = styled.View({ flex: 1, flexDirection: 'row' })
const RightIcons = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'flex-end',
})
