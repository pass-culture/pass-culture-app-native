import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import styled from 'styled-components/native'

import { useDepositAmount } from 'features/auth/api'
import { DenyAccessToIdCheckModal } from 'features/auth/signup/idCheck/DenyAccessToIdCheck'
import { useNavigateToIdCheck } from 'features/auth/signup/idCheck/useNavigateToIdCheck'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { useModal } from 'ui/components/modals/useModal'
import { HappyFaceStars } from 'ui/svg/icons/HappyFaceStars'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'VerifyEligibility'>

export function VerifyEligibility(props: Props) {
  const {
    visible: denyAccessToIdCheckModalVisible,
    showModal: showDenyAccessToIdCheckModal,
    hideModal: hideDenyAccessToIdCheckModal,
  } = useModal(false)
  const deposit = useDepositAmount()

  const navigateToIdCheck = useNavigateToIdCheck({
    onIdCheckNavigationBlocked: showDenyAccessToIdCheckModal,
  })

  function goToIdCheckWebView() {
    const { email, licenceToken } = props.route.params
    navigateToIdCheck(email, licenceToken)
  }

  return (
    <GenericInfoPage
      title={t`Plus que quelques étapes !`}
      icon={HappyFaceStars}
      iconSize={getSpacing(65)}>
      <StyledBody>
        {t({
          id: 'need verify eligibility',
          values: { deposit },
          message:
            'Pour que tu puisses bénéficier de l’aide financière de {deposit} offerte par le Ministère de la Culture, nous avons besoin de vérifier ton éligibilité.',
        })}
      </StyledBody>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimaryWhite title={t`Vérifier mon éligibilité`} onPress={goToIdCheckWebView} />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryWhite title={t`Retourner à l'accueil`} onPress={navigateToHome} />
      <DenyAccessToIdCheckModal
        visible={denyAccessToIdCheckModalVisible}
        dismissModal={hideDenyAccessToIdCheckModal}
      />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
