import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { LoadingPage } from 'ui/components/LoadingPage'

export function AfterChangeEmailValidationBuffer() {
  const { navigate } = useNavigation<UseNavigationType>()
  const delayedNavigate: typeof navigate = (...args: Parameters<typeof navigate>) => {
    setTimeout(() => {
      navigate(...args)
    }, 2000)
  }
  const { params } = useRoute<UseRouteType<'AfterChangeEmailValidationBuffer'>>()

  useEffect(beforeEmailValidation, [])

  function beforeEmailValidation() {}

  async function onEmailValidationSuccess() {}

  function onEmailValidationFailure() {}

  return <LoadingPage />
}
