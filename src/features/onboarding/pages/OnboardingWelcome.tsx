import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { WELCOME_BACKGROUND_SOURCE } from 'features/onboarding/components/welcomeBackground'
import { storage } from 'libs/storage'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const setHasSeenTutorials = () => storage.saveObject('has_seen_tutorials', true)

export const OnboardingWelcome: FunctionComponent = () => (
  <Container>
    <ImageBackground source={WELCOME_BACKGROUND_SOURCE} />
    <Spacer.Flex />
    <Gradient />
    <Content>
      <StyledTitle1>Bienvenue sur&nbsp;le&nbsp;pass&nbsp;Culture</StyledTitle1>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>
        Plus de 3 millions d’offres culturelles et un crédit à dépenser sur l’application si tu as
        entre 15 et 18 ans.
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <InternalTouchableLink
        as={ButtonWithLinearGradient}
        wording="C’est parti&nbsp;!"
        icon={PlainArrowNext}
        iconAfterWording
        navigateTo={{ screen: 'OnboardingGeolocation' }}
        onBeforeNavigate={setHasSeenTutorials}
      />
      <Spacer.Column numberOfSpaces={4} />
      <StyledAuthenticationButton type="login" onAdditionalPress={setHasSeenTutorials} />
      <Spacer.BottomScreen />
    </Content>
  </Container>
)

const Container = styled.View({
  flex: 1,
})

const Content = styled.View(({ theme }) => ({
  width: '100%',
  alignSelf: 'center',
  position: 'static',
  bottom: 0,
  backgroundColor: theme.colors.white,
  paddingHorizontal: getSpacing(6),
  paddingBottom: getSpacing(8),
}))

const Gradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [colorAlpha(theme.colors.white, 0), theme.colors.white],
  locations: [0, 0.85],
}))(({ theme }) => ({
  height: theme.isSmallScreen ? getSpacing(30) : getSpacing(50),
}))

const ImageBackground = styled.ImageBackground({
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
})

const StyledTitle1 = styled(Typo.Title1)({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledAuthenticationButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.colors.secondary,
  preventCancellation: true,
}))``
