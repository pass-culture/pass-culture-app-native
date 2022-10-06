import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

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
    <AppModal
      visible={visible}
      title="Connecte-toi pour profiter de cette fonctionnalité"
      titleNumberOfLines={3}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={() => {
        analytics.logQuitFavoriteModalForSignIn(offerId)
        dismissModal()
      }}>
      <Description>
        <Typo.Body>
          Ton compte te permettra de retrouver tous tes favoris en un clin d’oeil&nbsp;!
        </Typo.Body>
      </Description>

      <TouchableLink
        as={ButtonPrimary}
        wording="S’inscrire"
        navigateTo={{ screen: 'SignupForm' }}
        onBeforeNavigate={() => {
          analytics.logSignUpFromOffer(offerId)
          dismissModal()
        }}
      />
      <Spacer.Column numberOfSpaces={3} />
      <TouchableLink
        as={ButtonTertiaryPrimary}
        wording="Se connecter"
        navigateTo={{ screen: 'Login' }}
        onBeforeNavigate={() => {
          analytics.logSignInFromOffer(offerId)
          dismissModal()
        }}
      />
    </AppModal>
  )
}

const Description = styled(Typo.Body)({
  textAlign: 'center',
  paddingBottom: 30,
})
