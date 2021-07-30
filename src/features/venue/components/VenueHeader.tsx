import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getAnimationState } from 'ui/components/headers/animationHelpers'
import { HeaderIcon } from 'ui/components/headers/HeaderIcon'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

import { useShareVenue } from '../services/useShareVenue'

interface Props {
  headerTransition: Animated.AnimatedInterpolation
  title: string
  venueId: number
}

/**
 * @param props.headerTransition should be between animated between 0 and 1
 */
export const VenueHeader: React.FC<Props> = (props) => {
  const { headerTransition, title, venueId } = props
  const { goBack } = useNavigation<UseNavigationType>()
  const shareVenue = useShareVenue(venueId)

  const { animationState, backgroundColor } = getAnimationState(headerTransition)

  return (
    <HeaderContainer style={{ backgroundColor }}>
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

        <Title testID="venueHeaderName" style={{ opacity: headerTransition }}>
          <Typo.Body color={ColorsEnum.WHITE}>{title}</Typo.Body>
        </Title>

        <Spacer.Flex />
        <HeaderIcon
          animationState={animationState}
          iconName="share"
          onPress={shareVenue}
          testID={t`Partager`}
        />
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
const Row = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})
const Title = styled(Animated.Text).attrs({ numberOfLines: 1 })({
  flexShrink: 1,
  textAlign: 'center',
})
