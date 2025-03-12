import React from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhiteLegacy } from 'ui/pages/GenericInfoPageWhiteLegacy'
import { BicolorUserFavorite } from 'ui/svg/icons/BicolorUserFavorite'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

const onBeforeSignupNavigate = () => {
  analytics.logSignUpFromFavorite()
  analytics.logSignUpClicked({ from: 'favorite' })
}

export const NotConnectedFavorites = () => (
  <GenericInfoPageWhiteLegacy
    title="Identifie-toi pour retrouver tes favoris"
    subtitle="Ton compte te permettra de retrouver tous tes bons plans en un clin d’oeil&nbsp;!"
    titleComponent={StyledTitle4}
    subtitleComponent={CenteredText}
    icon={BicolorUserFavorite}
    separateIconFromTitle={false}
    mobileBottomFlex={2}>
    <ButtonContainer>
      <InternalTouchableLink
        as={ButtonWithLinearGradient}
        wording="Créer un compte"
        navigateTo={{ screen: 'SignupForm', params: { from: StepperOrigin.FAVORITE } }}
        onBeforeNavigate={onBeforeSignupNavigate}
        buttonHeight="tall"
      />
      <Spacer.Column numberOfSpaces={4} />
      <StyledAuthenticationButton
        type="login"
        onAdditionalPress={analytics.logSignInFromFavorite}
        params={{ from: StepperOrigin.FAVORITE }}
      />
    </ButtonContainer>
    <Spacer.BottomScreen />
  </GenericInfoPageWhiteLegacy>
)

const StyledTitle4 = styled(TypoDS.Title4)({
  textAlign: 'center',
  marginBottom: getSpacing(4),
})

const ButtonContainer = styled.View({
  flex: 1,
  paddingBottom: getSpacing(10),
  minHeight: getSpacing(31), // To avoid button getting smashed on "square" screens
})

const CenteredText = styled(TypoDS.Body)({
  textAlign: 'center',
})

const StyledAuthenticationButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.colors.secondary,
}))``
