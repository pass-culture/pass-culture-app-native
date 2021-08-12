import { initialRouteName as idCheckInitialRouteName } from '@pass-culture/id-check'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { LoadingPage } from 'ui/components/LoadingPage'

export const IdCheck: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  useFocusEffect(
    useCallback(() => {
      navigate(idCheckInitialRouteName)
    }, [])
  )
  return <LoadingPage />
}
