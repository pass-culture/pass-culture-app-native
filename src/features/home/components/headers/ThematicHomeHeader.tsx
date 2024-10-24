import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import { Animated } from 'react-native'
import { useTheme } from 'styled-components/native'

import { SubscribeButtonWithModals } from 'features/home/components/SubscribeButtonWithModals'
import { ThematicHeader, ThematicHeaderType } from 'features/home/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'
type Props = {
  thematicHeader?: ThematicHeader
  headerTransition: Animated.AnimatedInterpolation<string | number>
  homeId: string
}

export const useGetThematicHeaderHeight = () => {
  const theme = useTheme()
  const { top } = useCustomSafeInsets()

  return theme.appBarHeight + top
}

export const ThematicHomeHeader: FunctionComponent<Props> = ({
  thematicHeader,
  headerTransition,
  homeId,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const onGoBack = useCallback(() => navigate(...homeNavConfig), [navigate])

  return (
    <ContentHeader
      headerTitle={thematicHeader?.title}
      headerTransition={headerTransition}
      onBackPress={onGoBack}
      RightElement={
        thematicHeader?.type === ThematicHeaderType.Category ? (
          <SubscribeButtonWithModals homeId={homeId} />
        ) : null
      }
    />
  )
}
