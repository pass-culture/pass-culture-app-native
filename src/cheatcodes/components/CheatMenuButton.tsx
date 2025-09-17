import React from 'react'
import styled from 'styled-components/native'

import { env } from 'libs/environment/env'
import { ButtonTertiaryNeutralInfo } from 'ui/components/buttons/ButtonTertiaryNeutralInfo'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const CheatMenuButton: React.FC = () => {
  const { top } = useCustomSafeInsets()

  return env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING ? (
    <CheatMenuButtonContainer topSafeInsets={top}>
      <InternalTouchableLink
        as={ButtonTertiaryNeutralInfo}
        buttonHeight="extraSmall"
        wording="Cheatcodes"
        navigateTo={{ screen: 'CheatcodesStackNavigator' }}
      />
    </CheatMenuButtonContainer>
  ) : null
}

const CheatMenuButtonContainer = styled.View<{ topSafeInsets: number }>(
  ({ theme, topSafeInsets }) => ({
    position: 'absolute',
    right: getSpacing(6),
    top: topSafeInsets + getSpacing(6),
    zIndex: theme.zIndex.cheatCodeButton,
    border: getSpacing(0.5),
    borderColor: theme.designSystem.color.border.default,
    borderRadius: theme.designSystem.size.borderRadius.m,
    paddingHorizontal: getSpacing(1),
  })
)
