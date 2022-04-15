import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { AppModal } from 'ui/components/modals/AppModal'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  dismissModal: () => void
}

export const SignUpSignInChoiceOfferModal: FunctionComponent<Props> = ({
  visible,
  dismissModal,
}) => {
  return (
    <AppModal
      visible={visible}
      title={t`Connecte-toi pour profiter de cette fonctionnalité`}
      titleNumberOfLines={3}
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={t`Fermer la modale`}
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <Description>
        <Typo.Body>
          {t`Ton compte te permettra de retrouver tous tes favoris en un clin d'oeil\u00a0!`}
        </Typo.Body>
      </Description>

      <TouchableLink
        as={ButtonPrimary}
        wording={t`S'inscrire`}
        navigateTo={{ screen: 'SignupForm' }}
        onPress={() => dismissModal()}
      />
      <Spacer.Column numberOfSpaces={3} />
      <TouchableLink
        as={ButtonTertiary}
        wording={t`Se connecter`}
        navigateTo={{ screen: 'Login' }}
        onPress={() => dismissModal()}
      />
    </AppModal>
  )
}

const Description = styled(Typo.Body)({
  textAlign: 'center',
  paddingBottom: 30,
})
