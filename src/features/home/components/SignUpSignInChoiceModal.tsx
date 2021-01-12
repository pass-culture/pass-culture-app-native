import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
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
  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute()

  function goToSignUp() {
    dismissModal()
    navigate('SetEmail', {
      backNavigation: {
        from: 'Home',
        params: {
          // protect against a potential evolution of the current route params
          ...params,
          shouldDisplayLoginModal: true,
        },
      },
    })
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
            t`Si tu as 18 ans, tu es éligible pour obtenir une aide financière de 300\u00a0€ proposée par le Ministère de la Culture qui sera créditée directement sur ton compte pass Culture.`
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
