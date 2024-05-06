import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { mapSubscriptionThemeToIllustration } from 'features/subscription/helpers/mapSubscriptionThemeToIllustration'
import { SubscriptionTheme } from 'features/subscription/types'
import { getSpacing } from 'ui/theme'

interface Props {
  thematic: SubscriptionTheme
  size?: 'medium' | 'small'
}

export const SubscriptionThematicIllustration = ({ thematic, size = 'medium' }: Props) => {
  const { illustration: Illustration, gradients } = mapSubscriptionThemeToIllustration(thematic)

  return (
    <IllustrationContainer size={size}>
      <StyledLinearGradient colors={[gradients[0] as string, gradients[1] as string]}>
        <IllustrationWrapper size={size}>
          <Illustration width={size === 'medium' ? 82 : 54} />
        </IllustrationWrapper>
      </StyledLinearGradient>
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

const StyledLinearGradient = styled(LinearGradient)({
  flex: 1,
})
