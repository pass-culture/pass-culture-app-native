import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useDepositAmountsByAge } from 'features/auth/api'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { HappyFaceStars } from 'ui/svg/icons/HappyFaceStars'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'VerifyEligibility'>

export const VerifyEligibility: FunctionComponent<Props> = ({ route }) => {
  const deposit = useDepositAmountsByAge().eighteenYearsOldDeposit
  const { error, navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation()

  if (error) {
    throw error
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
      <ButtonPrimaryWhite
        title={t`Vérifier mon éligibilité`}
        onPress={() => navigateToNextBeneficiaryValidationStep(route.params)}
      />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryWhite title={t`Retourner à l'accueil`} onPress={navigateToHome} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
