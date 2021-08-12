import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { homeNavigateConfig } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { LoadingPage } from 'ui/components/LoadingPage'

export const AppComponents: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  useFocusEffect(
    useCallback(() => {
      navigate(homeNavigateConfig.screen, homeNavigateConfig.params)
    }, [])
  )
  return <LoadingPage />
}
