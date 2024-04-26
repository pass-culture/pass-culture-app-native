import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { mapSubscriptionThemeToIllustration } from 'features/subscription/helpers/mapSubscriptionThemeToIllustration'
import { SubscriptionTheme } from 'features/subscription/types'
import { getSpacing } from 'ui/theme'

interface Props {
  thematic: SubscriptionTheme
  size?: 'L' | 'M'
}

export const SubscriptionThematicIllustration = ({ thematic, size = 'L' }: Props) => {
  const { illustration: Illustration, gradients } = mapSubscriptionThemeToIllustration(thematic)

  return (
    <IllustrationContainer size={size}>
      <StyledLinearGradient colors={[gradients[0] as string, gradients[1] as string]}>
        <IllustrationWrapper size={size}>
          <Illustration width={size === 'L' ? 110 : 82} />
        </IllustrationWrapper>
      </StyledLinearGradient>
    </IllustrationContainer>
  )
}

const IllustrationContainer = styled.View<{ size: 'L' | 'M' }>(({ size }) => ({
  height: size === 'L' ? getSpacing(16) : getSpacing(12),
  width: size === 'L' ? getSpacing(16) : getSpacing(12),
  borderRadius: getSpacing(2),
  overflow: 'hidden',
}))

const IllustrationWrapper = styled.View<{ size: 'L' | 'M' }>(({ size }) => ({
  position: 'absolute',
  top: size === 'L' ? -getSpacing(3) : -getSpacing(5),
}))

const StyledLinearGradient = styled(LinearGradient)({
  flex: 1,
})
