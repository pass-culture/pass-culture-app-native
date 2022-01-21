import { t } from '@lingui/macro'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { navigateToHome } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { HappyFaceDeprecated as HappyFace } from 'ui/svg/icons/HappyFace_deprecated'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Typo } from 'ui/theme'
import { ColorsEnum } from 'ui/theme/colors'
export const VerifyEligibility: FunctionComponent = () => {
  const [error, setError] = useState<Error | undefined>()
  const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation(setError)

  if (error) {
    throw error
  }

  return (
    <GenericInfoPage
      title={t`Vérifie ton identité`}
      icon={HappyFace}
      buttons={[
        <ButtonPrimaryWhite
          key={1}
          title={t`Vérifier mon identité`}
          onPress={navigateToNextBeneficiaryValidationStep}
        />,
        <ButtonTertiaryWhite
          key={2}
          icon={PlainArrowPrevious}
          title={t`Retourner à l'accueil`}
          onPress={navigateToHome}
        />,
      ]}>
      <StyledBody>
        {t({
          id: 'need verify identity',
          message:
            'Nous avons besoin de vérifier ton identité. Si tu es éligible tu pourras bénéficier de l’aide financière du Gouvernement. \n\n Assure-toi que toutes les informations que tu nous transmets sont correctes pour faciliter ton inscription.',
        })}
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
