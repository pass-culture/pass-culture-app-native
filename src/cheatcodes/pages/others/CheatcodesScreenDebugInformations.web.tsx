import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { LoadingPage } from 'ui/pages/LoadingPage'

export const CheatcodesScreenDebugInformations: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  useFocusEffect(
    useCallback(() => {
      navigate(...homeNavConfig)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )
  return <LoadingPage />
}
