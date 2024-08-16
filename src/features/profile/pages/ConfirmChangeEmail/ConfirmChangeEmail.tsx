import React from 'react'

import { ConfirmChangeEmailContent } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmailContent'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { Spacer, Typo } from 'ui/theme'

export function ConfirmChangeEmail() {
  return (
    <GenericInfoPageWhite
      icon={BicolorPhonePending}
      titleComponent={Typo.Title3}
      title="Confirmes-tu la demande de changement d’e-mail&nbsp;?"
      separateIconFromTitle={false}
      mobileBottomFlex={0.3}>
      <Spacer.Column numberOfSpaces={40} />
      <ConfirmChangeEmailContent />
    </GenericInfoPageWhite>
  )
}
