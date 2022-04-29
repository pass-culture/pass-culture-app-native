import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { DeleteProfileSuccessV2 } from 'features/profile/pages/DeleteProfile/DeleteProfileSuccessV2'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ProfileDeletionIllustration } from 'ui/svg/icons/ProfileDeletionIllustration'
import { Spacer, Typo } from 'ui/theme'

export function DeleteProfileSuccess() {
  const { data: settings } = useAppSettings()
  return settings?.allowAccountReactivation ? (
    <DeleteProfileSuccessV2 />
  ) : (
    <GenericInfoPage
      title={t`Compte désactivé`}
      icon={ProfileDeletionIllustration}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording={t`Retourner à l'accueil`}
          navigateTo={navigateToHomeConfig}
        />,
      ]}>
      <StyledBody>{t`Tu as 30 jours pour te rétracter par e-mail à\u00a0: support@passculture.app`}</StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>{t`Une fois ce délai écoulé, ton compte pass Culture sera définitivement supprimé.`}</StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
