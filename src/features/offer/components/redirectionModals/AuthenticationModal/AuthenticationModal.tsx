import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { analytics } from 'libs/firebase/analytics'
import { theme } from 'theme'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { AppBottomSheetModal } from 'ui/components/modals/AppBottomSheetModal'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { BicolorUserIdentification } from 'ui/svg/BicolorUserIdentification'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  visible: boolean
  hideModal: () => void
}

export const AuthenticationModal: FunctionComponent<Props> = ({ visible, hideModal }) => {
  const title = "Identifie-toi pour réserver l'offre"
  const TextComponent: React.FC = () => {
    return (
      <React.Fragment>
        <Typo.ButtonText>Tu as entre 15 et 18 ans&nbsp;?</Typo.ButtonText>
        <Spacer.Column numberOfSpaces={2} />
        <StyledBody>
          Identifie-toi pour bénéficier de ton crédit et profiter des offres culturelles.
        </StyledBody>
      </React.Fragment>
    )
  }
  const CTAComponent: React.FC = () => {
    return (
      <React.Fragment>
        <StyledButtonContainer>
          <TouchableLink
            as={ButtonWithLinearGradient}
            wording="Créer un compte"
            navigateTo={{ screen: 'SignupForm', params: { preventCancellation: true } }}
            onBeforeNavigate={() => {
              analytics.logProfilSignUp()
              hideModal()
            }}
            fitContentWidth={theme.isDesktopViewport}
          />
        </StyledButtonContainer>
        <Spacer.Column numberOfSpaces={4} />
        <AuthenticationButton type="login" onAdditionalPress={hideModal} />
      </React.Fragment>
    )
  }

  return (
    <AppBottomSheetModal
      visible={visible}
      title={title}
      Illustration={BicolorUserIdentification}
      TextComponent={TextComponent}
      CTAComponent={CTAComponent}
      hideModal={hideModal}
    />
  )
}

const StyledButtonContainer = styled.View({
  width: '100%',
})
const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
