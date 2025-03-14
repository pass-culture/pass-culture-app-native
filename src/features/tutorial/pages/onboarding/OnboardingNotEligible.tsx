import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import BirthdayCakeAnimation from 'ui/animations/onboarding_birthday_cake.json'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'

export const OnboardingNotEligible = () => {
  const { reset } = useNavigation<UseNavigationType>()
  const navigateToHomeWithReset = () => {
    reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
  }

  return (
    <GenericInfoPageWhite
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
