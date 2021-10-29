import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { SadFace } from 'ui/svg/icons/SadFace'
import { ColorsEnum, Typo } from 'ui/theme'

export function ChangeEmailExpiredLink() {
  return (
    <GenericInfoPage title={t`Oups`} icon={SadFace}>
      <StyledBody>{t`Le lien est expiré !`}</StyledBody>
      <StyledBody>{t`Clique sur « Renvoyer l’e-mail » pour recevoir un nouveau lien.`}</StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
