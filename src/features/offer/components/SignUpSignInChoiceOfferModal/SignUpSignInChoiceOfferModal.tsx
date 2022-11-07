import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { analytics } from 'libs/firebase/analytics'
import { theme } from 'theme'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { BicolorUserIdentification } from 'ui/svg/BicolorUserIdentification'
import { Spacer, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

interface Props {
  visible: boolean
  offerId: number
  dismissModal: () => void
}

export const SignUpSignInChoiceOfferModal: FunctionComponent<Props> = ({
  visible,
  offerId,
  dismissModal,
}) => {
  return (
    <AppModalWithIllustration
      visible={visible}
      title={'Identifie-toi pour' + LINE_BREAK + 'retrouver tes favoris'}
      Illustration={BicolorUserIdentification}
      hideModal={() => {
        analytics.logQuitFavoriteModalForSignIn(offerId)
        dismissModal()
      }}>
      <StyledBody>
        Ton compte te permettra de retrouver tous tes bons plans en un clin d’oeil&nbsp;!
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <StyledButtonContainer>
        <TouchableLink
          as={ButtonWithLinearGradient}
          wording="Créer un compte"
          navigateTo={{ screen: 'SignupForm', params: { preventCancellation: true } }}
          onBeforeNavigate={() => {
            analytics.logSignUpFromOffer(offerId)
            dismissModal()
          }}
          fitContentWidth={theme.isDesktopViewport}
        />
      </StyledButtonContainer>
      <Spacer.Column numberOfSpaces={4} />
      <StyledAuthenticationButton
        type="login"
        onAdditionalPress={() => {
          analytics.logSignInFromOffer(offerId)
          dismissModal()
        }}
      />
    </AppModalWithIllustration>
  )
}

const StyledAuthenticationButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.colors.secondary,
}))``

const StyledButtonContainer = styled.View({
  width: '100%',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
