import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  dismissModal: () => void
}

export const SignUpSignInChoiceModal: FunctionComponent<Props> = ({ visible, dismissModal }) => {
  const { navigate } = useNavigation()

  function goToSignUp() {
    dismissModal()
    navigate('SetEmail')
  }

  function goToLogin() {
    dismissModal()
    navigate('Login')
  }

  return (
    <AppModal
      visible={visible}
      title={_(t`Le pass Culture est accessible à tous ! `)}
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <Description>
        <Typo.Body>
          {_(
            t`Si tu es dans l’année de tes 18 ans, le Ministère de la Culture t’offre également 300€ à dépenser dans l’application.`
          )}
        </Typo.Body>
      </Description>

      <ButtonPrimary title={_(t`S'inscrire`)} onPress={goToSignUp} />
      <Spacer.Column numberOfSpaces={3} />
      <ButtonTertiary title={_(t`Se connecter`)} onPress={goToLogin} />
    </AppModal>
  )
}

const Description = styled.Text({
  textAlign: 'center',
  paddingBottom: 30,
})
