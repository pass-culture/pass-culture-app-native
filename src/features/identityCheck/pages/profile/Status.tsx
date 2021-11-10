import { t } from '@lingui/macro'
import React from 'react'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { Spacer } from 'ui/theme'

export const Status = () => {
  const { goBack } = useGoBack(...homeNavConfig)

  return (
    <GenericInfoPage title={t`Page de status`}>
      <Spacer.Column numberOfSpaces={6} />

      <ButtonTertiaryWhite title={t`Abandonner`} onPress={goBack} />
    </GenericInfoPage>
  )
}
