import React from 'react'

import { useNavigateToHomeWithReset } from 'features/navigation/helpers/useNavigateToHomeWithReset'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useAnimationToDisplay } from 'libs/styled/useAnimationToDisplay'
import BirthdayCakeAnimation from 'ui/animations/onboarding_birthday_cake.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'

export const OnboardingNotEligible = () => {
  // TODO(PC-36293): use BirthdayCakeAnimationDark and BirthdayCakeAnimationLight
  const animation = useAnimationToDisplay({
    light: BirthdayCakeAnimation,
    dark: BirthdayCakeAnimation,
  })

  const { navigateToHomeWithReset } = useNavigateToHomeWithReset()

  return (
    <GenericInfoPage
      withSkipAction={navigateToHomeWithReset}
      animation={animation}
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
          screen: homeNavigationConfig[0],
          withReset: true,
        },
      }}
    />
  )
}
