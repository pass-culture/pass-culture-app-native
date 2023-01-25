import React from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { analytics } from 'libs/firebase/analytics'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorUserFavorite } from 'ui/svg/icons/BicolorUserFavorite'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const NotConnectedFavorites = () => (
  <GenericInfoPageWhite
    title="Identifie-toi pour retrouver tes favoris"
    subtitle="Ton compte te permettra de retrouver tous tes bons plans en un clin d’oeil&nbsp;!"
    titleComponent={StyledTitle4}
    subtitleComponent={CenteredText}
    icon={BicolorUserFavorite}
    separateIconFromTitle={false}
    mobileBottomFlex={2}>
    <Row>
      <ButtonContainer>
        <InternalTouchableLink
          as={ButtonWithLinearGradient}
          wording="Créer un compte"
          navigateTo={{ screen: 'SignupForm' }}
          onBeforeNavigate={analytics.logSignUpFromFavorite}
          buttonHeight="tall"
        />
        <Spacer.Column numberOfSpaces={4} />
        <StyledAuthenticationButton
          type="login"
          onAdditionalPress={analytics.logSignInFromFavorite}
        />
      </ButtonContainer>
    </Row>
    <Spacer.BottomScreen />
  </GenericInfoPageWhite>
)

const Row = styled.View({ flexDirection: 'row' })

const StyledTitle4 = styled(Typo.Title4)({
  textAlign: 'center',
  marginBottom: getSpacing(4),
})

const ButtonContainer = styled.View({ flex: 1, paddingBottom: getSpacing(10) })

const CenteredText = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledAuthenticationButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.colors.secondary,
}))``
