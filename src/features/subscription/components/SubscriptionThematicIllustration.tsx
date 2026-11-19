import React from 'react'
import styled from 'styled-components/native'

import { mapSubscriptionThemeToIllustration } from 'features/subscription/helpers/mapSubscriptionThemeToIllustration'
import { SubscriptionTheme } from 'features/subscription/types'
import { BackgroundColorKey } from 'theme/types'

interface Props {
  thematic: SubscriptionTheme
  size?: 'medium' | 'small'
}

export const SubscriptionThematicIllustration = ({ thematic, size = 'medium' }: Props) => {
  const { illustration: Illustration, fillColor } = mapSubscriptionThemeToIllustration(thematic)

  return (
    <IllustrationContainer size={size}>
      <StyledView fillColor={fillColor}>
        <IllustrationWrapper size={size}>
          <Illustration width={size === 'medium' ? 82 : 54} />
        </IllustrationWrapper>
      </StyledView>
    </IllustrationContainer>
  )
}

const IllustrationContainer = styled.View<{ size: 'medium' | 'small' }>(({ theme, size }) => ({
  height:
    size === 'medium'
      ? theme.designSystem.size.spacing['4xl']
      : theme.designSystem.size.spacing['2xl'],
  width:
    size === 'medium'
      ? theme.designSystem.size.spacing['4xl']
      : theme.designSystem.size.spacing['2xl'],
  borderRadius:
    size === 'medium'
      ? theme.designSystem.size.borderRadius.m
      : theme.designSystem.size.borderRadius.s,
  overflow: 'hidden',
}))

const IllustrationWrapper = styled.View<{ size: 'medium' | 'small' }>(({ size, theme }) => ({
  position: 'absolute',
  top:
    size === 'medium'
      ? -theme.designSystem.size.spacing.xl
      : -theme.designSystem.size.spacing['2xl'],
}))

const StyledView = styled.View<{ fillColor: BackgroundColorKey }>(({ fillColor, theme }) => ({
  backgroundColor: theme.designSystem.color.background[fillColor],
  flex: 1,
}))
