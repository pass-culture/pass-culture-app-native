import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { mapSubscriptionThemeToIllustration } from 'features/subscription/helpers/mapSubscriptionThemeToIllustration'
import { SubscriptionTheme } from 'features/subscription/types'
import { getSpacing } from 'ui/theme'

interface Props {
  thematic: SubscriptionTheme
}

export const SubscriptionThematicIllustration = ({ thematic }: Props) => {
  const { illustration: Illustration, gradients } = mapSubscriptionThemeToIllustration(thematic)

  return (
    <IllustrationContainer>
      <StyledLinearGradient colors={[gradients[0] as string, gradients[1] as string]}>
        <IllustrationWrapper>
          <Illustration width={110} />
        </IllustrationWrapper>
      </StyledLinearGradient>
    </IllustrationContainer>
  )
}

const IllustrationContainer = styled.View({
  height: getSpacing(16),
  width: getSpacing(16),
  borderRadius: getSpacing(2),
  overflow: 'hidden',
})

const IllustrationWrapper = styled.View({
  position: 'absolute',
  top: -getSpacing(3),
})

const StyledLinearGradient = styled(LinearGradient)({
  flex: 1,
})
