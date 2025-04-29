import React from 'react'

import { useNavigateToHomeWithReset } from 'features/navigation/helpers/useNavigateToHomeWithReset'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import BirthdayCakeAnimation from 'ui/animations/onboarding_birthday_cake.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'

export const OnboardingNotEligible = () => {
  const { navigateToHomeWithReset } = useNavigateToHomeWithReset()

  return (
    <GenericInfoPage
      withSkipAction={navigateToHomeWithReset}
      animation={BirthdayCakeAnimation}
      title="Encore un peu de patience&nbsp;!"
      subtitle="Ton crédit t’attend à partir de tes 17 ans. En attendant, crée-toi un compte pour découvrir les bons plans autour de toi."
      buttonPrimary={{
        wording: 'Créer un compte',
        navigateTo: {
          screen: 'SignupForm',
          params: { from: StepperOrigin.ONBOARDING_NOT_ELIGIBLE },
        },
      }}
      buttonSecondary={{
        wording: 'Accéder au catalogue',
        navigateTo: {
          screen: homeNavConfig[0],
          withReset: true,
        },
      }}
    />
  )
}
