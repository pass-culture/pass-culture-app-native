import { ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import LottieView from 'libs/lottie'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'

export default {
  title: 'Fondations/Animations',
  parameters: { chromatic: { disable: true } },
}

const LottieAnimations = {
  eighteen_birthday: {
    source: require('ui/animations/eighteen_birthday.json'),
    hasBackground: false,
  },
  geolocalisation: { source: require('ui/animations/geolocalisation.json'), hasBackground: false },
  government: { source: require('ui/animations/government.json'), hasBackground: false },
  lottie_illuminated_smiley: {
    source: require('ui/animations/lottie_illuminated_smiley.json'),
    hasBackground: true,
  },
  notif_basic_medium: {
    source: require('ui/animations/geolocalisation.json'),
    hasBackground: false,
  },
  onboarding_unlock: {
    source: require('ui/animations/onboarding_unlock.json'),
    hasBackground: false,
  },
  qpi_thanks: { source: require('ui/animations/qpi_thanks.json'), hasBackground: false },
  tutorial_offers: { source: require('ui/animations/tutorial_offers.json'), hasBackground: false },
  tutorial_pass_logo: {
    source: require('ui/animations/tutorial_pass_logo.json'),
    hasBackground: false,
  },
  tutorial_star: { source: require('ui/animations/tutorial_star.json'), hasBackground: false },
  lottie_loading: { source: require('ui/animations/lottie_loading.json'), hasBackground: false },
  onboarding_birthday_cake: {
    source: require('ui/animations/onboarding_birthday_cake.json'),
    hasBackground: false,
  },
}

const Template: ComponentStory<typeof LottieView> = () => (
  <GridContainer>
    {Object.entries(LottieAnimations).map(([name, { source, hasBackground }]) => (
      <AnimationContainer key={name} hasBackground={hasBackground}>
        <Animation source={source} autoPlay loop />
        <Spacer.Column numberOfSpaces={3} />
        <Name hasBackground={hasBackground}>{name}</Name>
      </AnimationContainer>
    ))}
  </GridContainer>
)

export const AllAnimations = Template.bind({})
AllAnimations.storyName = 'Animations'

const AnimationContainer = styled.View<{ hasBackground: boolean }>(({ theme, hasBackground }) => ({
  margin: getSpacing(2),
  padding: getSpacing(2),
  alignItems: 'center',
  justifyContent: 'center',
  width: getSpacing(65),
  border: `2px solid ${theme.colors.greyLight}`,
  borderRadius: getSpacing(2),
  backgroundColor: hasBackground ? theme.uniqueColors.brand : 'transparent',
}))

const Name = styled(TypoDS.Button)<{ hasBackground: boolean }>(({ theme, hasBackground }) => ({
  color: hasBackground ? theme.colors.white : theme.colors.black,
}))

const GridContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
})

const Animation = styled(LottieView)({
  width: getSpacing(37.5),
  height: getSpacing(37.5),
})
