import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { HeaderWithGreyContainer } from 'features/profile/components/Header/HeaderWithGreyContainer/HeaderWithGreyContainer'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

const onBeforeNavigate = () => {
  analytics.logProfilSignUp()
  analytics.logSignUpClicked({ from: 'profile' })
}

export function LoggedOutHeader() {
  const enableCreditV3 = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_CREDIT_V3)
  const subtitle = `Tu as ${enableCreditV3 ? '17 ou 18' : 'entre 15 et 18'} ans\u00a0?`

  const { isDesktopViewport, colors } = useTheme()

  return (
    <HeaderWithGreyContainer title="Mon profil" subtitle={subtitle}>
      <TypoDS.Body>Identifie-toi pour bénéficier de ton crédit pass Culture</TypoDS.Body>
      <Spacer.Column numberOfSpaces={5} />
      <Container>
        <InternalTouchableLink
          as={ButtonWithLinearGradient}
          wording="Créer un compte"
          navigateTo={{
            screen: 'SignupForm',
            params: { from: StepperOrigin.PROFILE },
          }}
          onBeforeNavigate={onBeforeNavigate}
          fitContentWidth={isDesktopViewport}
        />

        {isDesktopViewport ? <VerticalSeparator /> : <Spacer.Column numberOfSpaces={5} />}

        <AuthenticationButton
          type="login"
          linkColor={colors.secondary}
          params={{ from: StepperOrigin.PROFILE }}
        />
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
