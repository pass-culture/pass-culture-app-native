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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )
  return <LoadingPage />
}
