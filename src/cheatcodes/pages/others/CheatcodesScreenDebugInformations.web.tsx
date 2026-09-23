import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { LoadingPage } from 'ui/pages/LoadingPage'

export const CheatcodesScreenDebugInformations: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  useFocusEffect(
    useCallback(() => {
      navigate(...homeNavigationConfig)
    }, [])
  )
  return <LoadingPage />
}
