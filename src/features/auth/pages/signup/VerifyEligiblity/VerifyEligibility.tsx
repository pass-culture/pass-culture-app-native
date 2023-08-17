import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericOfficialPage } from 'ui/pages/GenericOfficialPage'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Spacer, Typo } from 'ui/theme'

export const VerifyEligibility: FunctionComponent = () => {
  return (
    <GenericOfficialPage
      title="Vérifie ton identité pour débloquer ton crédit"
      buttons={[
        <InternalTouchableLink
          key={1}
          as={ButtonPrimary}
          wording="Commencer la vérification"
          navigateTo={{ screen: 'Stepper' }}
        />,
        <InternalTouchableLink
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
