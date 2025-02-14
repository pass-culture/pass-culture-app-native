import { ComponentStory } from '@storybook/react'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import LottieView from 'libs/lottie'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'

// Increase the timeout for animations
jest.setTimeout(10000)

export default {
  title: 'Fondations/Animations',
  parameters: { chromatic: { disable: true } },
}

const LottieAnimations = {
  achievements_success: {
    source: require('ui/animations/achievements_success.json'),
    hasBackground: false,
    isSmallAnimation: false,
  },
  eighteen_birthday: {
    source: require('ui/animations/eighteen_birthday.json'),
    hasBackground: false,
    isSmallAnimation: false,
  },
  geolocalisation: {
    source: require('ui/animations/geolocalisation.json'),
    hasBackground: false,
    isSmallAnimation: false,
  },
  lottie_illuminated_smiley: {
    source: require('ui/animations/lottie_illuminated_smiley.json'),
    hasBackground: true,
    isSmallAnimation: false,
  },
  lottie_loading: {
    source: require('ui/animations/lottie_loading.json'),
    hasBackground: false,
    isSmallAnimation: false,
  },
  notif_basic_medium: {
    source: require('ui/animations/notif_basic_medium.json'),
    hasBackground: false,
    isSmallAnimation: true,
  },
  onboarding_birthday_cake: {
    source: require('ui/animations/onboarding_birthday_cake.json'),
    hasBackground: false,
    isSmallAnimation: false,
  },
  onboarding_unlock: {
    source: require('ui/animations/onboarding_unlock.json'),
    hasBackground: false,
    isSmallAnimation: true,
  },
  qpi_thanks: {
    source: require('ui/animations/qpi_thanks.json'),
    hasBackground: false,
    isSmallAnimation: false,
  },
  tutorial_pass_logo: {
    source: require('ui/animations/tutorial_pass_logo.json'),
    hasBackground: false,
    isSmallAnimation: false,
  },
}

const Template: ComponentStory<typeof LottieView> = () => (
  <GridContainer>
    {Object.entries(LottieAnimations)
      .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
      .map(([name, { source, hasBackground, isSmallAnimation }]) => (
        <HoverAnimation
          key={name}
          name={name}
          source={source}
          hasBackground={hasBackground}
          isSmallAnimation={isSmallAnimation}
        />
      ))}
  </GridContainer>
)

interface HoverAnimationProps {
  name: string
  source: string
  hasBackground: boolean
  isSmallAnimation: boolean
}

const HoverAnimation: React.FC<HoverAnimationProps> = ({
  name,
  source,
  hasBackground,
  isSmallAnimation,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <AnimationContainer
      hasBackground={hasBackground}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <Cover isHovered={isHovered}>
        <Spacer.Flex />
        <TypoDS.Button>👆</TypoDS.Button>
        <Spacer.Flex />
        <TypoDS.Button>{name}</TypoDS.Button>
      </Cover>

      <Spacer.Flex />
      <Animation
        key={isHovered ? `${name}-hover` : `${name}-idle`}
        source={source}
        autoPlay={isHovered}
        loop
        isSmallAnimation={isSmallAnimation}
      />
      <Spacer.Flex />
      <Name hasBackground={hasBackground}>{name}</Name>
    </AnimationContainer>
  )
}

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
  cursor: 'pointer',
}))

const Name = styled(TypoDS.Button)<{ hasBackground: boolean }>(({ theme, hasBackground }) => ({
  color: hasBackground ? theme.colors.white : theme.colors.black,
}))

const GridContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
})

const Animation = styled(LottieView)<{ isSmallAnimation: boolean }>(({ isSmallAnimation }) => ({
  width: isSmallAnimation ? getSpacing(15) : getSpacing(37.5),
  height: isSmallAnimation ? getSpacing(15) : getSpacing(37.5),
}))

const Cover = styled.View<{ isHovered: boolean }>(({ theme, isHovered }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: theme.colors.white,
  opacity: isHovered ? 0 : 1,
  transition: 'opacity 0.3s ease-in-out',
  zIndex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: getSpacing(2),
}))
