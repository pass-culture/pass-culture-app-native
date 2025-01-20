import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { BicolorUserIdentification } from 'ui/svg/BicolorUserIdentification'
import { Spacer, Typo, TypoDS } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

type Props = {
  visible: boolean
  hideModal: () => void
  offerId: number
  from: StepperOrigin
  children?: never
}

export const AuthenticationModal: FunctionComponent<Props> = ({
  visible,
  hideModal,
  offerId,
  from,
}) => {
  const { data: settings } = useSettingsContext()
  const enableCreditV3 = settings?.wipEnableCreditV3
  const title = `Tu as ${enableCreditV3 ? '17 ou 18' : 'entre 15 et 18'} ans\u00a0?`

  const closeModal = useCallback(() => {
    analytics.logQuitAuthenticationModal(offerId)
    hideModal()
  }, [hideModal, offerId])

  const signUp = useCallback(() => {
    analytics.logSignUpFromAuthenticationModal(offerId)
    analytics.logSignUpClicked({ from: 'offer_booking' })
    hideModal()
  }, [hideModal, offerId])

  const signIn = useCallback(() => {
    analytics.logSignInFromAuthenticationModal(offerId)
    hideModal()
  }, [hideModal, offerId])

  return (
    <AppModalWithIllustration
      visible={visible}
      title={'Identifie-toi' + LINE_BREAK + 'pour réserver l’offre'}
      Illustration={BicolorUserIdentification}
      hideModal={closeModal}>
      <Typo.ButtonText>{title}</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={2} />
      <StyledBody>
        Identifie-toi pour bénéficier de ton crédit et profiter des offres culturelles.
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <StyledButtonContainer>
        <InternalTouchableLink
          as={ButtonWithLinearGradient}
          wording="Créer un compte"
          navigateTo={{
            screen: 'SignupForm',
            params: { offerId, from },
          }}
          onBeforeNavigate={signUp}
        />
      </StyledButtonContainer>
      <Spacer.Column numberOfSpaces={4} />
      <StyledAuthenticationButton
        type="login"
        onAdditionalPress={signIn}
        params={{ offerId, from }}
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
