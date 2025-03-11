import React from 'react'

import { ConfirmChangeEmailContent } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmailContent'
import { GenericInfoPageWhiteLegacy } from 'ui/pages/GenericInfoPageWhiteLegacy'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { Spacer, TypoDS } from 'ui/theme'

export function ConfirmChangeEmail() {
  return (
    <GenericInfoPageWhiteLegacy
      icon={BicolorPhonePending}
      titleComponent={TypoDS.Title3}
      title="Confirmes-tu la demande de changement d’e-mail&nbsp;?"
      separateIconFromTitle={false}
      mobileBottomFlex={0.3}>
      <Spacer.Column numberOfSpaces={40} />
      <ConfirmChangeEmailContent />
    </GenericInfoPageWhiteLegacy>
  )
}
