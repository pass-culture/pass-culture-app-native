import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment'
import { getSpacing, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const CheatMenuButton: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { top } = useCustomSafeInsets()

  return env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING ? (
    <CheatMenuButtonContainer
      onPress={() => navigate(Platform.OS === 'web' ? 'Navigation' : 'CheatMenu')}
      style={{ top: getSpacing(3) + top }}>
      <Typo.Body>CheatMenu</Typo.Body>
    </CheatMenuButtonContainer>
  ) : null
}

const CheatMenuButtonContainer = styled(TouchableOpacity)(({ theme }) => ({
  position: 'absolute',
  right: getSpacing(2),
  zIndex: theme.zIndex.cheatCodeButton,
  border: 1,
  padding: getSpacing(1),
}))
