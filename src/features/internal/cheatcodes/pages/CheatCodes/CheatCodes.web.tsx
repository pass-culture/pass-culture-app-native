import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { LoadingPage } from 'ui/components/LoadingPage'

export const CheatCodes: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  useFocusEffect(
    useCallback(() => {
      navigate(...homeNavConfig)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )
  return <LoadingPage />
}
