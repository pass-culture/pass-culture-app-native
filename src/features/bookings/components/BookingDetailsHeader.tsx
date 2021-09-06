import { t } from '@lingui/macro'
import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { useGoBack } from 'features/navigation/useGoBack'
import { getAnimationState } from 'ui/components/headers/animationHelpers'
import { HeaderIcon } from 'ui/components/headers/HeaderIcon'
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
  const { goBack } = useGoBack('Bookings')

  const { animationState, backgroundColor } = getAnimationState(headerTransition)

  return (
    <React.Fragment>
      <HeaderContainer style={{ backgroundColor }}>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={2} />
        <Row>
          <IconContainer>
            <HeaderIcon
              animationState={animationState}
              iconName="back"
              onPress={goBack}
              testID={t`Revenir en arrière`}
            />
          </IconContainer>

          <Title style={{ opacity: headerTransition }}>
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
  flex: 5,
})
