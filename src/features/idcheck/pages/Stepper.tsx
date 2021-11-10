import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { Spacer, Typo, ColorsEnum } from 'ui/theme'

export const IdCheckStepper = () => {
  const { goBack } = useGoBack(...homeNavConfig)

  return (
    <GenericInfoPage title={t`C’est très rapide !`}>
      <StyledBody>{t`Voici les 3 étapes que tu vas devoir suivre.`}</StyledBody>

      <Spacer.Column numberOfSpaces={6} />

      <ButtonTertiaryWhite title={t`Abandonner`} onPress={goBack} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
