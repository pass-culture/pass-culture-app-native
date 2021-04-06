import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { HeaderIcon } from 'features/offer/atoms'
import { _ } from 'libs/i18n'
import {
  headerBackgroundInterpolation,
  iconBackgroundInterpolation,
  iconBorderInterpolation,
} from 'ui/components/headers/animationHelpers'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  headerTransition: Animated.AnimatedInterpolation
  title: string
}
/**
 * @param props.headerTransition should be between animated between 0 and 1
 */
export const BookingDetailsHeader: React.FC<Props> = (props) => {
  const { headerTransition, title } = props
  const { goBack } = useNavigation<UseNavigationType>()

  const iconBackgroundColor = headerTransition.interpolate(iconBackgroundInterpolation)
  const iconBorderColor = headerTransition.interpolate(iconBorderInterpolation)
  const headerBackgroundColor = headerTransition.interpolate(headerBackgroundInterpolation)

  const animationState = { iconBackgroundColor, iconBorderColor, transition: headerTransition }

  return (
    <React.Fragment>
      <HeaderContainer style={{ backgroundColor: headerBackgroundColor }}>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={2} />
        <Row>
          <IconContainer>
            <HeaderIcon animationState={animationState} iconName="back" onPress={goBack} />
          </IconContainer>

          <Title testID="offerHeaderName" style={{ opacity: headerTransition }}>
            <Typo.Body color={ColorsEnum.WHITE}>{title}</Typo.Body>
          </Title>

          <Spacer.Row numberOfSpaces={3} />
          <Spacer.Flex />
        </Row>
        <Spacer.Column numberOfSpaces={2} />
      </HeaderContainer>
    </React.Fragment>
  )
}

const HeaderContainer = styled(Animated.View)({
  position: 'absolute',
  top: 0,
  width: '100%',
  zIndex: 1,
})

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const IconContainer = styled.View({
  paddingLeft: getSpacing(3),
  flex: 1,
})

const Title = styled(Animated.Text).attrs({ numberOfLines: 1 })({
  textAlign: 'center',
})
