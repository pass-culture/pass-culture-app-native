import { IdCheckHomePage, useIdCheckContext } from '@pass-culture/id-check'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { homeNavigateConfig } from 'features/navigation/helpers'
import { ScreenNavigationProp, UseNavigationType } from 'features/navigation/RootNavigator'

export const IdCheckV2 = (props: ScreenNavigationProp<'IdCheckV2'>) => {
  const { setContextValue } = useIdCheckContext()
  const { replace } = useNavigation<UseNavigationType>()

  function onAbandon() {
    replace(homeNavigateConfig.screen, homeNavigateConfig.params)
  }

  function onSuccess() {
    replace(homeNavigateConfig.screen, homeNavigateConfig.params)
  }

  useEffect(() => {
    if (setContextValue) {
      setContextValue({
        onAbandon,
        onSuccess,
      })
    }
  }, [setContextValue])

  // @ts-ignore : props typing issue with IdCheck screen from module.
  // Probably needs some change on the side of the module.
  return <IdCheckHomePage {...props} />
}
