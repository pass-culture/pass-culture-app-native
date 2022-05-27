import { t } from '@lingui/macro'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Typo } from 'ui/theme'

export const VerifyEligibility: FunctionComponent = () => {
  const [error, setError] = useState<Error | undefined>()
  const { nextBeneficiaryValidationStepNavConfig } = useBeneficiaryValidationNavigation(setError)

  if (error) {
    throw error
  }

  return (
    <GenericInfoPage
      title={t`Vérifie ton identité`}
      icon={HappyFace}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording={t`Vérifier mon identité`}
          navigateTo={nextBeneficiaryValidationStepNavConfig}
        />,
        <TouchableLink
          key={2}
          as={ButtonTertiaryWhite}
          icon={PlainArrowPrevious}
          wording={t`Retourner à l'accueil`}
          navigateTo={navigateToHomeConfig}
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

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
