import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { HomeHeader } from 'features/home/components/headers/HomeHeader'
import { SubscribeButton } from 'features/subscription/components/buttons/SubscribeButton'
import achievement from 'ui/animations/achievements_success.json'
import geo from 'ui/animations/geolocalisation.json'
import loading from 'ui/animations/lottie_loading.json'
import cake from 'ui/animations/onboarding_birthday_cake.json'
import qpi from 'ui/animations/qpi_thanks.json'
import { ThemedStyledLottieView } from 'ui/animations/ThemedStyledLottieView'
import logo from 'ui/animations/tutorial_pass_logo.json'
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
      <View style={{ flexDirection: 'row' }}>
        <ThemedStyledLottieView
          height={getSpacing(80)}
          width={getSpacing(80)}
          source={geo}
          autoPlay
          loop={false}
        />
        <ThemedStyledLottieView
          height={getSpacing(80)}
          width={getSpacing(80)}
          source={qpi}
          autoPlay
          loop={false}
        />
        <ThemedStyledLottieView
          height={getSpacing(80)}
          width={getSpacing(80)}
          source={achievement}
          autoPlay
          loop={false}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <ThemedStyledLottieView
          height={getSpacing(80)}
          width={getSpacing(80)}
          source={cake}
          autoPlay
          loop={false}
        />
        <ThemedStyledLottieView
          height={getSpacing(80)}
          width={getSpacing(80)}
          source={logo}
          autoPlay
          loop={false}
        />
        <ThemedStyledLottieView
          height={getSpacing(80)}
          width={getSpacing(80)}
          source={loading}
          autoPlay
          loop={false}
        />
      </View>
    </React.Fragment>
  )
}

const ListHeaderContainer = styled.View(({ theme }) => ({
  flexGrow: 1,
  flexShrink: 0,
  zIndex: theme.zIndex.header,
}))
