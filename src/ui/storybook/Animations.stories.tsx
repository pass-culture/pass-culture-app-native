// remove this after rename without old.tsx
// eslint-disable-next-line import/no-extraneous-dependencies
import { StoryFn } from '@storybook/react-vite'
import React, { useState } from 'react'
import styled from 'styled-components'

import achievements_success from 'ui/animations/achievements_success.json'
import french_republic_animation from 'ui/animations/french_republic_animation.json'
import geolocalisation from 'ui/animations/geolocalisation.json'
import lottie_loading from 'ui/animations/lottie_loading.json'
import notif_basic_medium from 'ui/animations/notif_basic_medium.json'
import onboarding_birthday_cake from 'ui/animations/onboarding_birthday_cake.json'
import onboarding_unlock from 'ui/animations/onboarding_unlock.json'
import qpi_thanks from 'ui/animations/qpi_thanks.json'
import { ThemedStyledLottieView } from 'ui/animations/ThemedStyledLottieView'
import { AnimationObject } from 'ui/animations/type'
import { Spacer, Typo, getSpacing } from 'ui/theme'

export default {
  title: 'Fondations/Animations',
  parameters: {
    chromatic: { disable: true },
    axe: { timeout: 5000 }, // Increase timeout for animations to finish
  },
}

type LottieStoryConfig = {
  source: AnimationObject
  hasBackground: boolean
  isSmallAnimation: boolean
  coloringMode?: 'global' | 'targeted'
  targetShapeNames?: string[]
  targetLayerNames?: string[]
}

const LottieAnimations: Record<string, LottieStoryConfig> = {
  achievements_success: {
    source: achievements_success,
    hasBackground: false,
    isSmallAnimation: false,
    coloringMode: 'targeted',
    targetShapeNames: ['Fond 1'],
  },
  geolocalisation: {
    source: geolocalisation,
    hasBackground: false,
    isSmallAnimation: false,
    coloringMode: 'targeted',
    targetShapeNames: ['Fond 1', 'Gradient Fill 1'],
  },
  lottie_loading: {
    source: lottie_loading,
    hasBackground: false,
    isSmallAnimation: false,
    coloringMode: 'global',
  },
  notif_basic_medium: {
    source: notif_basic_medium,
    hasBackground: false,
    isSmallAnimation: true,
    coloringMode: 'global',
  },
  onboarding_birthday_cake: {
    source: onboarding_birthday_cake,
    hasBackground: false,
    isSmallAnimation: false,
    coloringMode: 'targeted',
    targetShapeNames: ['Fond 1', 'Gradient Fill 1'],
  },
  onboarding_unlock: {
    source: onboarding_unlock,
    hasBackground: false,
    isSmallAnimation: true,
    coloringMode: 'global',
  },
  qpi_thanks: {
    source: qpi_thanks,
    hasBackground: false,
    isSmallAnimation: false,
    coloringMode: 'targeted',
    targetShapeNames: ['Fond 1', 'Gradient Fill 1'],
    targetLayerNames: ['étoile', 'cadre'],
  },
  french_republic_animation: {
    source: french_republic_animation,
    hasBackground: false,
    isSmallAnimation: false,
    coloringMode: 'targeted',
    targetShapeNames: ['Fond 1', 'Gradient Fill 1'],
    targetLayerNames: ['étoile', 'cadre'],
  },
}

const Template: StoryFn<typeof ThemedStyledLottieView> = () => (
  <GridContainer>
    {Object.entries(LottieAnimations)
      .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
      .map(([name, config]) => (
        <HoverAnimation key={name} name={name} config={config} />
      ))}
  </GridContainer>
)

interface HoverAnimationProps {
  name: string
  config: LottieStoryConfig
}

const HoverAnimation: React.FC<HoverAnimationProps> = ({
  name,
  config: {
    source,
    hasBackground,
    isSmallAnimation,
    coloringMode,
    targetShapeNames,
    targetLayerNames,
  },
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <AnimationContainer
      hasBackground={hasBackground}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <Cover isHovered={isHovered}>
        <Typo.Button>👆{name} (Hover)</Typo.Button>
      </Cover>

      <Spacer.Flex />
      <ThemedStyledLottieView
        key={isHovered ? `${name}-hover` : `${name}-idle`}
        source={source}
        autoPlay={isHovered}
        loop
        coloringMode={coloringMode}
        targetShapeNames={targetShapeNames}
        targetLayerNames={targetLayerNames}
        height={isSmallAnimation ? getSpacing(15) : getSpacing(37.5)}
        width={isSmallAnimation ? getSpacing(15) : getSpacing(37.5)}
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
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  margin: theme.designSystem.size.spacing.s,
  padding: theme.designSystem.size.spacing.s,
  alignItems: 'center',
  justifyContent: 'center',
  width: getSpacing(65),
  border: `2px solid ${theme.designSystem.color.border.subtle}`,
  borderRadius: theme.designSystem.size.borderRadius.m,
  backgroundColor: hasBackground ? theme.designSystem.color.background.brandPrimary : 'transparent',
  cursor: 'pointer',
  overflow: 'hidden',
}))

const Name = styled(Typo.Button)<{ hasBackground: boolean }>(({ theme, hasBackground }) => ({
  color: hasBackground
    ? theme.designSystem.color.text.inverted
    : theme.designSystem.color.text.default,
}))

const GridContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
})

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
  padding: theme.designSystem.size.spacing.s,
  borderRadius: theme.designSystem.size.borderRadius.m,
}))
