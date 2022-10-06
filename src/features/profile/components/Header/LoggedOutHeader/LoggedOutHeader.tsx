import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { HeaderWithGreyContainer } from 'features/profile/components/Header/HeaderWithGreyContainer/HeaderWithGreyContainer'
import { analytics } from 'libs/firebase/analytics'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Connect } from 'ui/svg/icons/Connect'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export function LoggedOutHeader() {
  const { isDesktopViewport } = useTheme()

  return (
    <HeaderWithGreyContainer title="Mon profil" subtitle="Tu as entre 15 et 18 ans&nbsp;?">
      <Typo.Body>Identifie-toi pour bénéficier de ton crédit pass Culture</Typo.Body>
      <Spacer.Column numberOfSpaces={5} />
      <Container>
        <TouchableLink
          as={ButtonWithLinearGradient}
          wording="Créer un compte"
          navigateTo={{ screen: 'SignupForm', params: { preventCancellation: true } }}
          onPress={() => analytics.logProfilSignUp()}
          fitContentWidth={isDesktopViewport}
        />

        {isDesktopViewport ? <VerticalSeparator /> : <Spacer.Column numberOfSpaces={5} />}

        <LoginContainer>
          <StyledBody>
            Déjà un compte&nbsp;?
            <TouchableLink
              as={StyledButtonInsideText}
              navigateTo={{ screen: 'Login', params: { preventCancellation: true } }}
              wording="Se connecter"
              icon={Connect}
            />
          </StyledBody>
        </LoginContainer>
      </Container>
    </HeaderWithGreyContainer>
  )
}

const Container = styled.View(({ theme }) => ({
  flexDirection: theme.isDesktopViewport ? 'row' : 'column',
}))

const VerticalSeparator = styled.View(({ theme }) => ({
  borderRightWidth: getSpacing(0.25),
  marginHorizontal: getSpacing(6),
  borderRightColor: theme.colors.greyMedium,
}))

const LoginContainer = styled.View({
  justifyContent: 'center',
})

const StyledButtonInsideText = styled(ButtonInsideText).attrs(({ theme }) => ({
  color: theme.colors.secondary,
}))``

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
