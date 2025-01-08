import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { BicolorUserFavorite } from 'ui/svg/icons/BicolorUserFavorite'
import { Spacer, TypoDS } from 'ui/theme'
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
  const closeModal = useCallback(() => {
    analytics.logQuitFavoriteModalForSignIn(offerId)
    dismissModal()
  }, [dismissModal, offerId])

  const signUp = useCallback(() => {
    analytics.logSignUpFromOffer(offerId)
    analytics.logSignUpClicked({ from: 'offer_favorite' })
    dismissModal()
  }, [dismissModal, offerId])

  const signIn = useCallback(() => {
    analytics.logSignInFromOffer(offerId)
    dismissModal()
  }, [dismissModal, offerId])

  return (
    <AppModalWithIllustration
      visible={visible}
      title={'Identifie-toi pour' + LINE_BREAK + 'retrouver tes favoris'}
      Illustration={BicolorUserFavorite}
      hideModal={closeModal}>
      <StyledBody>
        Ton compte te permettra de retrouver tous tes bons plans en un clin d’oeil&nbsp;!
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <StyledButtonContainer>
        <InternalTouchableLink
          as={ButtonWithLinearGradient}
          wording="Créer un compte"
          navigateTo={{
            screen: 'SignupForm',
            params: { from: StepperOrigin.OFFER, offerId },
          }}
          onBeforeNavigate={signUp}
        />
      </StyledButtonContainer>
      <Spacer.Column numberOfSpaces={4} />
      <StyledAuthenticationButton
        type="login"
        params={{ from: StepperOrigin.OFFER, offerId }}
        onAdditionalPress={signIn}
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

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})
