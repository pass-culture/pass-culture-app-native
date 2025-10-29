// remove this after rename without old.tsx
// eslint-disable-next-line import/no-extraneous-dependencies
import { StoryFn } from '@storybook/react-vite'
import React, { useState } from 'react'
import styled from 'styled-components'

import LottieView from 'libs/lottie'
import achievements_success from 'ui/animations/achievements_success.json'
import french_republic_animation from 'ui/animations/french_republic_animation.json'
import geolocalisation from 'ui/animations/geolocalisation.json'
import lottie_loading from 'ui/animations/lottie_loading.json'
import notif_basic_medium from 'ui/animations/notif_basic_medium.json'
import onboarding_birthday_cake from 'ui/animations/onboarding_birthday_cake.json'
import onboarding_unlock from 'ui/animations/onboarding_unlock.json'
import qpi_thanks from 'ui/animations/qpi_thanks.json'
import { AnimationObject } from 'ui/animations/type'
import { Spacer, Typo, getSpacing } from 'ui/theme'

export default {
  title: 'Fondations/Animations',
  parameters: {
    chromatic: { disable: true },
    axe: { timeout: 5000 }, // Increase timeout for animations to finish
  },
}

const LottieAnimations = {
  achievements_success: {
    source: achievements_success,
    hasBackground: false,
    isSmallAnimation: false,
  },
  geolocalisation: {
    source: geolocalisation,
    hasBackground: false,
    isSmallAnimation: false,
  },
  lottie_loading: {
    source: lottie_loading,
    hasBackground: false,
    isSmallAnimation: false,
  },
  notif_basic_medium: {
    source: notif_basic_medium,
    hasBackground: false,
    isSmallAnimation: true,
  },
  onboarding_birthday_cake: {
    source: onboarding_birthday_cake,
    hasBackground: false,
    isSmallAnimation: false,
  },
  onboarding_unlock: {
    source: onboarding_unlock,
    hasBackground: false,
    isSmallAnimation: true,
  },
  qpi_thanks: {
    source: qpi_thanks,
    hasBackground: false,
    isSmallAnimation: false,
  },
  french_republic_animation: {
    source: french_republic_animation,
    hasBackground: false,
    isSmallAnimation: false,
  },
}

const Template: StoryFn<typeof LottieView> = () => (
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
  source: AnimationObject
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
        <Typo.Button>👆</Typo.Button>
        <Spacer.Flex />
        <Typo.Button>{name}</Typo.Button>
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

export const AllAnimations = {
  name: 'Animations',
  render: Template,
}

const AnimationContainer = styled.div<{ hasBackground: boolean }>(({ theme, hasBackground }) => ({
  margin: getSpacing(2),
  padding: getSpacing(2),
  alignItems: 'center',
  justifyContent: 'center',
  width: getSpacing(65),
  border: `2px solid ${theme.designSystem.color.border.subtle}`,
  borderRadius: theme.designSystem.size.borderRadius.m,
  backgroundColor: hasBackground ? theme.designSystem.color.background.brandPrimary : 'transparent',
  cursor: 'pointer',
}))

const Name = styled(Typo.Button)<{ hasBackground: boolean }>(({ theme, hasBackground }) => ({
  color: hasBackground
    ? theme.designSystem.color.text.inverted
    : theme.designSystem.color.text.default,
}))

const GridContainer = styled.div({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
})

const Animation = styled(LottieView)<{ isSmallAnimation: boolean }>(({ isSmallAnimation }) => ({
  width: isSmallAnimation ? getSpacing(15) : getSpacing(37.5),
  height: isSmallAnimation ? getSpacing(15) : getSpacing(37.5),
}))

const Cover = styled.div<{ isHovered: boolean }>(({ theme, isHovered }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: theme.designSystem.color.background.default,
  opacity: isHovered ? 0 : 1,
  transition: 'opacity 0.3s ease-in-out',
  zIndex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: getSpacing(2),
  borderRadius: theme.designSystem.size.borderRadius.m,
}))
