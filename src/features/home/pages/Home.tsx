import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { HomeHeader } from 'features/home/components/headers/HomeHeader'
import { SubscribeButton } from 'features/subscription/components/buttons/SubscribeButton'
import OnboardingUnlock from 'ui/animations/geolocalisation.json'
import { ThemedStyledLottieView } from 'ui/animations/ThemedStyledLottieView'
import { getSpacing } from 'ui/theme'

const Header = () => (
  <ListHeaderContainer>
    <HomeHeader />
  </ListHeaderContainer>
)

export const Home: FunctionComponent = () => {
  return (
    <React.Fragment>
      <SubscribeButton
        onPress={() => {}}
        active={false}
        label={{ active: 'Thème suivi', inactive: 'Suivre le thème' }}
      />
      <ThemedStyledLottieView
        height={getSpacing(8)}
        width={getSpacing(8)}
        source={OnboardingUnlock}
        autoPlay
        loop={false}
      />
    </React.Fragment>
  )
}

const ListHeaderContainer = styled.View(({ theme }) => ({
  flexGrow: 1,
  flexShrink: 0,
  zIndex: theme.zIndex.header,
}))
