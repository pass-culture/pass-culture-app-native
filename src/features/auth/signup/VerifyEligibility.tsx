import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import styled from 'styled-components/native'

import { useDepositAmount } from 'features/auth/api'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { HappyFaceStars } from 'ui/svg/icons/HappyFaceStars'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'VerifyEligibility'>

export function VerifyEligibility(props: Props) {
  const { navigate } = useNavigation<UseNavigationType>()
  const deposit = useDepositAmount()

  function goToHomeWithoutModal() {
    navigate('Home', { shouldDisplayLoginModal: false })
  }

  function goToIdCheckWebView() {
    const { email, licenceToken } = props.route.params
    navigate('IdCheck', { email, licenceToken })
  }

  return (
    <GenericInfoPage
      title={t`Plus que quelques étapes !`}
      icon={HappyFaceStars}
      iconSize={getSpacing(65)}>
      <StyledBody>
        {t`Pour que tu puisses bénéficier de l’aide financière de ${deposit} offerte par le Ministère de la Culture, nous avons besoin de vérifier ton éligibilité.`}
      </StyledBody>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimaryWhite title={t`Vérifier mon éligibilité`} onPress={goToIdCheckWebView} />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryWhite title={t`Retourner à l'accueil`} onPress={goToHomeWithoutModal} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
