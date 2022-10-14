import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { useNextSubscriptionStep } from 'features/auth/signup/useNextSubscriptionStep'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { EmailSent } from 'ui/svg/icons/EmailSent'

export const IdentityCheckEnd = () => {
  const { data: subscription } = useNextSubscriptionStep()
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToStepper = () => navigate('IdentityCheckStepper')

  useEffect(() => {
    const timeout = setTimeout(
      !subscription?.nextSubscriptionStep ? navigateToHome : navigateToStepper,
      3000
    )
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription?.nextSubscriptionStep])

  return (
    <GenericInfoPage title="Ta pièce d’identité a bien été transmise&nbsp;!" icon={EmailSent} />
  )
}
