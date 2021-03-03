import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  dismissModal: () => void
  id: number
}

export const SignUpSignInChoiceOfferModal: FunctionComponent<Props> = ({
  visible,
  dismissModal,
  id,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'Offer'>>()

  function goToSignUp() {
    dismissModal()
    navigate('SetEmail', {
      backNavigation: {
        from: 'Offer',
        params: {
          // protect against a potential evolution of the current route params
          ...params,
          shouldDisplayLoginModal: true,
          id,
        },
      },
    })
  }

  function goToLogin() {
    dismissModal()
    navigate('Login', {
      backNavigation: {
        from: 'Offer',
        params: {
          // protect against a potential evolution of the current route params
          ...params,
          shouldDisplayLoginModal: true,
          id,
        },
      },
    })
  }

  return (
    <AppModal
      visible={visible}
      title={_(t`Connecte-toi pour profiter de cette fonctionnalité`)}
      titleNumberOfLines={3}
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <Description>
        <Typo.Body>
          {_(t`Ton compte te permettra de retrouver tous tes favoris en un clin d'oeil !`)}
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
