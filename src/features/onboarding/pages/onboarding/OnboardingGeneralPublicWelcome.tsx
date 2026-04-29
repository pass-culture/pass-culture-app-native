import React from 'react'

import { useNavigateToHomeWithReset } from 'features/navigation/helpers/useNavigateToHomeWithReset'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'

export const OnboardingGeneralPublicWelcome = () => {
  const { navigateToHomeWithReset } = useNavigateToHomeWithReset()

  return (
    <GenericInfoPage
      withSkipAction={navigateToHomeWithReset}
      animation={QpiThanks}
      animationColoringMode="targeted"
      animationTargetShapeNames={['Fond 1', 'Gradient Fill 1']}
      animationTargetLayerNames={['étoile', 'cadre']}
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
          screen: homeNavigationConfig[0],
          withPush: true,
        },
      }}
    />
  )
}
