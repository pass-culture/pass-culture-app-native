import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { AUTHENTICATION_BACKGROUND_SOURCE } from 'features/onboarding/components/authenticationBackground'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const OnboardingAuthentication: FunctionComponent = () => (
  <Container>
    <ImageBackground source={AUTHENTICATION_BACKGROUND_SOURCE} />
    <Spacer.Flex />
    <Gradient />
    <Content>
      <StyledTitle1>Bienvenue sur&nbsp;le&nbsp;pass&nbsp;Culture</StyledTitle1>
      <Spacer.Column numberOfSpaces={4} />
      <StyledButtonText>Tu as entre 15 et 18 ans&nbsp;?</StyledButtonText>
      <Spacer.Column numberOfSpaces={2} />
      <StyledBody>
        Identifie-toi pour bénéficier de ton crédit et profiter des offres culturelles.
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <TouchableLink
        as={ButtonWithLinearGradient}
        wording="Créer un compte"
        navigateTo={{ screen: 'SignupForm', params: { preventCancellation: true } }}
      />
      <Spacer.Column numberOfSpaces={4} />
      <TouchableLink
        as={ButtonTertiaryBlack}
        wording="Plus tard"
        icon={ClockFilled}
        navigateTo={{ ...navigateToHomeConfig, fromRef: false }}
      />
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

const StyledButtonText = styled(Typo.ButtonText)({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
