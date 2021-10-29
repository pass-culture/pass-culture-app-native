import { useIdCheckContext } from '@pass-culture/id-check'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'

export const useSetIdCheckNavigationContext = () => {
  const { setContextValue } = useIdCheckContext()
  const { navigate } = useNavigation<UseNavigationType>()
  useEffect(() => {
    if (setContextValue) {
      setContextValue({
        onAbandon: () => navigate(...homeNavConfig),
      })
    }
  }, [setContextValue])
}
