import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import {
  headerBackgroundInterpolation,
  iconBackgroundInterpolation,
  iconBorderInterpolation,
} from 'ui/components/headers/animationHelpers'
import { HeaderIcon } from 'ui/components/headers/HeaderIcon'
import { Spacer } from 'ui/theme'

interface Props {
  headerTransition: Animated.AnimatedInterpolation
}

/**
 * @param props.headerTransition should be between animated between 0 and 1
 */
export const VenueHeader: React.FC<Props> = (props) => {
  const { headerTransition } = props
  const { goBack } = useNavigation<UseNavigationType>()

  const iconBackgroundColor = headerTransition.interpolate(iconBackgroundInterpolation)
  const iconBorderColor = headerTransition.interpolate(iconBorderInterpolation)
  const headerBackgroundColor = headerTransition.interpolate(headerBackgroundInterpolation)

  const animationState = { iconBackgroundColor, iconBorderColor, transition: headerTransition }

  return (
    <HeaderContainer style={{ backgroundColor: headerBackgroundColor }}>
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
        <Spacer.Flex />
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
const Row = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})
