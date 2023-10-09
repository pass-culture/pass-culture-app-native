import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import { Animated } from 'react-native'
import { useTheme } from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  title?: string
  headerTransition: Animated.AnimatedInterpolation<string | number>
}

export const useGetThematicHeaderHeight = () => {
  const theme = useTheme()
  const { top } = useCustomSafeInsets()

  return theme.appBarHeight + top
}

export const ThematicHomeHeader: FunctionComponent<Props> = ({ title, headerTransition }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const onGoBack = useCallback(() => navigate(...homeNavConfig), [navigate])

  return (
    <ContentHeader headerTitle={title} headerTransition={headerTransition} onBackPress={onGoBack} />
  )
}
