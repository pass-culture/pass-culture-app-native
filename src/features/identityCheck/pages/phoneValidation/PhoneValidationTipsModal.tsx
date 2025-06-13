import React, { FunctionComponent } from 'react'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InformationWithIcon } from 'ui/components/InformationWithIcon'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Signal } from 'ui/svg/icons/Signal'
import { Smartphone } from 'ui/svg/icons/Smartphone'
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
        <Typo.Body>
          Pour que la validation de ton numéro de téléphone se passe au mieux&nbsp;:
        </Typo.Body>
        <Spacer.Column numberOfSpaces={8} />
        <InformationWithIcon
          Icon={Signal}
          text="Vérifie que tu as un bon réseau"
          subtitle="Tu vas recevoir un code de validation par SMS"
        />
        <Spacer.Column numberOfSpaces={8} />
        <InformationWithIcon
          Icon={Smartphone}
          text="Assure-toi d’indiquer ton numéro de téléphone personnel"
          subtitle="Il ne peut être associé qu’à un seul compte"
        />
        <Spacer.Column numberOfSpaces={13} />
        <ButtonPrimary wording="J’ai compris" onPress={props.dismissModal} />
      </React.Fragment>
    </AppModal>
  )
}
