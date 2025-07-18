import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { getOnboardingPropConfig } from 'features/navigation/OnboardingStackNavigator/getOnboardingPropConfig'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { WELCOME_BACKGROUND_SOURCE } from 'features/onboarding/components/welcomeBackground'
import { analytics } from 'libs/analytics/provider'
import { storage } from 'libs/storage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Page } from 'ui/pages/Page'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const setHasSeenTutorials = () => storage.saveObject('has_seen_tutorials', true)

const onStartPress = () => {
  analytics.logOnboardingStarted({ type: 'start' })
  setHasSeenTutorials()
}

const onLoginPress = () => {
  analytics.logOnboardingStarted({ type: 'login' })
  setHasSeenTutorials()
}

export const OnboardingWelcome: FunctionComponent = () => {
  return (
    <Page>
      <ImageBackground source={WELCOME_BACKGROUND_SOURCE} />
      <StyledScrollView>
        <Spacer.Flex />
        <Gradient />
        <Content>
          <StyledTitle1>Bienvenue sur&nbsp;le&nbsp;pass&nbsp;Culture</StyledTitle1>
          <Spacer.Column numberOfSpaces={4} />
          <StyledBody>
            Plus de 3 millions d’offres culturelles et un crédit à dépenser sur l’application si tu
            as 17 ou 18 ans.
          </StyledBody>
          <Spacer.Column numberOfSpaces={6} />
          <InternalTouchableLink
            as={ButtonPrimary}
            wording="C’est parti&nbsp;!"
            icon={PlainArrowNext}
            iconAfterWording
            navigateTo={getOnboardingPropConfig('OnboardingGeolocation')}
            onBeforeNavigate={onStartPress}
          />
          <Spacer.Column numberOfSpaces={4} />
          <StyledAuthenticationButton
            type="login"
            onAdditionalPress={onLoginPress}
            params={{ from: StepperOrigin.ONBOARDING_WELCOME }}
          />
          <Spacer.BottomScreen />
        </Content>
      </StyledScrollView>
    </Page>
  )
}

const StyledScrollView = styled(ScrollView).attrs({
  contentContainerStyle: { flexGrow: 1 },
})``

const Content = styled.View(({ theme }) => ({
  width: '100%',
  alignSelf: 'center',
  position: 'static',
  bottom: 0,
  backgroundColor: theme.designSystem.color.background.default,
  paddingHorizontal: getSpacing(6),
  paddingBottom: getSpacing(8),
}))

const Gradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [
    colorAlpha(theme.designSystem.color.background.default, 0),
    theme.designSystem.color.background.default,
  ],
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
  linkColor: theme.designSystem.color.text.brandPrimary,
}))``
