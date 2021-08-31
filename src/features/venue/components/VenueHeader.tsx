import { t } from '@lingui/macro'
import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { useGoBack } from 'features/navigation/useGoBack'
import { isSharingSupported } from 'features/offer/services/isSharingSupported'
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
  const { goBack } = useGoBack('Search')

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
        {/* TODO WEB : display button only if sharing is supported : https://passculture.atlassian.net/browse/PC-10510 */}
        {isSharingSupported() ? (
          <HeaderIcon
            animationState={animationState}
            iconName="share"
            onPress={shareVenue}
            testID={t`Partager`}
          />
        ) : null}
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
