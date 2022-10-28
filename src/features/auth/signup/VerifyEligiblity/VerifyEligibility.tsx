import React, { FunctionComponent, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { GenericOfficialPage } from 'ui/pages/GenericOfficialPage'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Spacer, Typo } from 'ui/theme'

export const VerifyEligibility: FunctionComponent = () => {
  const [error, setError] = useState<Error | undefined>()
  const { nextBeneficiaryValidationStepNavConfig } = useBeneficiaryValidationNavigation(setError)

  if (error) {
    throw error
  }

  return (
    <GenericOfficialPage
      title="Vérifie ton identité pour débloquer ton crédit"
      buttons={[
        !!nextBeneficiaryValidationStepNavConfig && (
          <TouchableLink
            key={1}
            as={ButtonPrimary}
            wording="Commencer la vérification"
            navigateTo={nextBeneficiaryValidationStepNavConfig}
          />
        ),
        <TouchableLink
          key={2}
          as={ButtonTertiaryBlack}
          icon={PlainArrowNext}
          wording="Vérifier mon identité plus tard"
          navigateTo={navigateToHomeConfig}
        />,
      ]}>
      <View>
        <StyledBody>
          Nous avons besoin de vérifier ton identité. Si tu es éligible tu pourras bénéficier de
          l’aide financière de l’État.
        </StyledBody>
        <Spacer.Column numberOfSpaces={4} />
        <Typo.ButtonText>
          Assure-toi que toutes les informations que tu nous transmets sont correctes pour faciliter
          ton inscription.
        </Typo.ButtonText>
      </View>
    </GenericOfficialPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
