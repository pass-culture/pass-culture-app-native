import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import BirthdayCakeAnimation from 'ui/animations/onboarding_birthday_cake.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhiteLegacy } from 'ui/pages/GenericInfoPageWhiteLegacy'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

export const OnboardingNotEligible = () => {
  const { reset } = useNavigation<UseNavigationType>()
  const navigateToHomeWithReset = () => {
    reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
  }

  return (
    <GenericInfoPageWhiteLegacy
      mobileBottomFlex={0.1}
      animation={BirthdayCakeAnimation}
      title="Encore un peu de patience&nbsp;!"
      onSkip={navigateToHomeWithReset}>
      <StyledBody>
        Ton crédit t’attend à partir de tes 17 ans. En attendant, crée-toi un compte pour découvrir
        les bons plans autour de toi.
      </StyledBody>
      <Spacer.Flex flex={1} />
      <ButtonContainer>
        <InternalTouchableLink
          key={1}
          as={ButtonPrimary}
          wording="Créer un compte"
          navigateTo={{
            screen: 'SignupForm',
            params: { from: StepperOrigin.ONBOARDING_NOT_ELIGIBLE },
          }}
        />
        <Spacer.Column numberOfSpaces={4} />
        <InternalTouchableLink
          key={2}
          as={ButtonSecondary}
          wording="Accéder au catalogue"
          navigateTo={{
            screen: homeNavConfig[0],
            withReset: true,
          }}
        />
      </ButtonContainer>
    </GenericInfoPageWhiteLegacy>
  )
}

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
})
