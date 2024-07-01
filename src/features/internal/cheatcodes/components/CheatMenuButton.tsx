import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment'
import { ButtonTertiaryNeutralInfo } from 'ui/components/buttons/ButtonTertiaryNeutralInfo'
import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const CheatMenuButton: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { top } = useCustomSafeInsets()

  return env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING ? (
    <CheatMenuButtonContainer topSafeInsets={top}>
      <ButtonTertiaryNeutralInfo
        buttonHeight="extraSmall"
        wording="CheatMenu"
        onPress={() => navigate(Platform.OS === 'web' ? 'Navigation' : 'CheatMenu')}
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
    borderColor: theme.buttons.tertiaryNeutralInfo.textColor,
    borderRadius: getSpacing(2),
    paddingHorizontal: getSpacing(1),
  })
)
