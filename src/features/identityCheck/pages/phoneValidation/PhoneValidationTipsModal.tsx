import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InformationWithIcon } from 'ui/components/InformationWithIcon'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { BicolorSignal } from 'ui/svg/icons/BicolorSignal'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  isVisible: boolean
  dismissModal: () => void
  onGoBack: () => void
}

export const PhoneValidationTipsModal: FunctionComponent<Props> = (props) => {
  return (
    <AppModal
      visible={props.isVisible}
      title="Quelques conseils"
      onLeftIconPress={props.onGoBack}
      leftIcon={ArrowPrevious}
      leftIconAccessibilityLabel="Revenir à l’étape précédente">
      <React.Fragment>
        <StyledBody>
          Pour que la validation de ton numéro de téléphone se passe au mieux&nbsp;:
        </StyledBody>
        <Spacer.Column numberOfSpaces={8} />
        <InformationWithIcon
          Icon={BicolorSignal}
          text="Vérifie que tu as un bon réseau"
          subtitle="Tu vas recevoir un code de validation par SMS"
        />
        <Spacer.Column numberOfSpaces={8} />
        <InformationWithIcon
          Icon={BicolorSmartphone}
          text="Assure-toi d'indiquer ton numéro de téléphone personnel"
          subtitle="Il ne peut être associé qu’à un seul compte"
        />
        <Spacer.Column numberOfSpaces={13} />
        <ButtonPrimary
          wording="J'ai compris"
          onPress={props.dismissModal}
          testID="dismiss-phone-validation-tips-modal"
        />
      </React.Fragment>
    </AppModal>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
  textAlign: 'center',
}))
