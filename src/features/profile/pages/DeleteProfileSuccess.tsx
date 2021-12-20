import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { ProfileDeletionLight } from 'ui/svg/icons/ProfileDeletionLight'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function DeleteProfileSuccess() {
  return (
    <GenericInfoPage
      title={t`Compte désactivé`}
      icon={ProfileDeletionLight}
      iconSize={getSpacing(26)}>
      <StyledBody>{t`Tu as 30 jours pour te rétracter par e-mail à\u00a0: support@passculture.app`}</StyledBody>
      <Spacer.Column numberOfSpaces={4} />

      <StyledBody>{t`Une fois ce délai écoulé, ton compte pass Culture sera définitivement supprimé.`}</StyledBody>
      <Spacer.Column numberOfSpaces={15} />
      <ButtonPrimaryWhite title={t`Retourner à l'accueil`} onPress={navigateToHome} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
