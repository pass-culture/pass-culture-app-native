import { t } from '@lingui/macro'
import { useGoBack } from 'features/navigation/useGoBack'
import React from 'react'
import styled from 'styled-components/native'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'

import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { IdCardError } from 'ui/svg/icons/IdCardError'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function IdentityCheckPending() {
  const { goBack } = useGoBack('IdentityCheckPending', undefined)
  return (
    <GenericInfoPage
      title={t`Oups !`}
      icon={({ color }) => <IdCardError size={getSpacing(36)} color={color} />}>
      <StyledBody>{t`Il y a déjà une demande de crédit pass Culture en cours sur ton compte.`}</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>{t`Ton inscription est en cours de vérification. Tu recevras une notification dès que ton dossier sera validé.`}</StyledBody>
      <Spacer.Column numberOfSpaces={12} />
      <ButtonPrimaryWhite title={t`Retourner à l'accueil`} onPress={goBack} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
