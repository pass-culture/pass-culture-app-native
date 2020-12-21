import { t } from '@lingui/macro'
import React from 'react'

import { _ } from 'libs/i18n'
import { AppButton } from 'ui/components/buttons/AppButton'
import { ColorsEnum } from 'ui/theme'

export const CallToAction = () => {
  return (
    <AppButton
      title={_(t`Voir les disponibilités`)}
      onPress={() => null}
      textColor={ColorsEnum.WHITE}
      borderColor={ColorsEnum.WHITE}
      loadingIconColor={ColorsEnum.WHITE}
      backgroundColor={ColorsEnum.PRIMARY}
      buttonHeight="tall"
    />
  )
}
