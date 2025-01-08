import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

export const OnboardingGeneralPublicWelcome = () => {
  const { reset } = useNavigation<UseNavigationType>()
  const navigateToHomeWithReset = () => {
    reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
  }
  return (
    <GenericInfoPageWhite
      mobileBottomFlex={0.1}
      animation={QpiThanks}
      onSkip={navigateToHomeWithReset}
      title="Explore, découvre, profite">
      <StyledBody>
        Et si tu créais un compte pour des suggestions à venir&nbsp;? Sinon, explore librement le
        catalogue dès maintenant&nbsp;!
      </StyledBody>
      <Spacer.Flex flex={2} />
      <ButtonContainer>
        <InternalTouchableLink
          as={ButtonPrimary}
          wording="Créer un compte"
          navigateTo={{ screen: 'SignupForm', params: { from: 'OnboardingGeneralPublicWelcome' } }}
          key={1}
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
    </GenericInfoPageWhite>
  )
}

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
})

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})
