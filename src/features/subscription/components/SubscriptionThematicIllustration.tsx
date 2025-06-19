import React from 'react'
import styled from 'styled-components/native'

import { mapSubscriptionThemeToIllustration } from 'features/subscription/helpers/mapSubscriptionThemeToIllustration'
import { SubscriptionTheme } from 'features/subscription/types'
import { BackgroundColorKey } from 'theme/types'
import { getSpacing } from 'ui/theme'

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

const IllustrationContainer = styled.View<{ size: 'medium' | 'small' }>(({ size }) => ({
  height: size === 'medium' ? getSpacing(12) : getSpacing(8),
  width: size === 'medium' ? getSpacing(12) : getSpacing(8),
  borderRadius: size === 'medium' ? getSpacing(2) : getSpacing(1),
  overflow: 'hidden',
}))

const IllustrationWrapper = styled.View<{ size: 'medium' | 'small' }>(({ size }) => ({
  position: 'absolute',
  top: size === 'medium' ? -getSpacing(5) : -getSpacing(7),
}))

const StyledView = styled.View<{ fillColor: BackgroundColorKey }>(({ fillColor, theme }) => ({
  backgroundColor: theme.designSystem.color.background[fillColor],
  flex: 1,
}))
