import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { navigateToHome } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const VerifyEligibility: FunctionComponent = () => {
  const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation()

  return (
    <GenericInfoPage title={t`Vérifie ton identité`} icon={HappyFace} iconSize={getSpacing(30)}>
      <StyledBody>
        {t({
          id: 'need verify identity',
          message:
            'Nous avons besoin de vérifier ton identité. Si tu es éligible tu pourras bénéficier de l’aide financière du Gouvernement. \n\n Assure-toi que toutes les informations que tu nous transmets sont correctes pour faciliter ton inscription.',
        })}
      </StyledBody>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimaryWhite
        title={t`Vérifier mon identité`}
        onPress={navigateToNextBeneficiaryValidationStep}
      />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryWhite
        icon={PlainArrowPrevious}
        title={t`Retourner à l'accueil`}
        onPress={navigateToHome}
      />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
