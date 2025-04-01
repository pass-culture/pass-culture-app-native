import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'

export const OnboardingGeneralPublicWelcome = () => {
  const { reset } = useNavigation<UseNavigationType>()
  const navigateToHomeWithReset = () => {
    reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
  }

  return (
    <GenericInfoPage
      withSkipAction={navigateToHomeWithReset}
      animation={QpiThanks}
      title="Explore, découvre, profite"
      subtitle="Et si tu créais un compte pour suivre l’actualité culturelle autour de toi&nbsp;?"
      buttonPrimary={{
        wording: 'Créer un compte',
        navigateTo: {
          screen: 'SignupForm',
          params: { from: StepperOrigin.ONBOARDING_GENERAL_PUBLIC_WELCOME },
        },
      }}
      buttonSecondary={{
        wording: 'Accéder au catalogue',
        navigateTo: {
          screen: homeNavConfig[0],
          withPush: true,
        },
      }}
    />
  )
}
