import React from 'react'
import styled from 'styled-components/native'

import { env } from 'libs/environment/env'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const CheatMenuButton: React.FC = () => {
  const { top } = useCustomSafeInsets()

  return env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING ? (
    <CheatMenuButtonContainer topSafeInsets={top}>
      <InternalTouchableLink
        as={Button}
        variant="secondary"
        size="small"
        wording="Cheatcodes"
        navigateTo={{ screen: 'CheatcodesStackNavigator' }}
      />
    </CheatMenuButtonContainer>
  ) : null
}

const CheatMenuButtonContainer = styled.View<{ topSafeInsets: number }>(
  ({ theme, topSafeInsets }) => ({
    position: 'absolute',
    right: theme.contentPage.marginHorizontal,
    top: topSafeInsets + theme.contentPage.marginHorizontal,
    zIndex: theme.zIndex.cheatCodeButton,
  })
)
