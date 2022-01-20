import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { AppModal } from 'ui/components/modals/AppModal'
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
  const { navigate } = useNavigation<UseNavigationType>()

  function goToSignUp() {
    dismissModal()
    navigate('SignupForm')
  }

  function goToLogin() {
    dismissModal()
    navigate('Login')
  }

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

      <ButtonPrimary wording={t`S'inscrire`} onPress={goToSignUp} />
      <Spacer.Column numberOfSpaces={3} />
      <ButtonTertiary wording={t`Se connecter`} onPress={goToLogin} />
    </AppModal>
  )
}

const Description = styled.Text({
  textAlign: 'center',
  paddingBottom: 30,
})
