import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Again } from 'ui/svg/icons/Again'
import { ProfileDeletionIllustration } from 'ui/svg/icons/ProfileDeletionIllustration'
import { Spacer, Typo } from 'ui/theme'

export function DeleteProfileSuccessV2() {
  return (
    <GenericInfoPage
      title={t`Ton compte a été désactivé`}
      icon={ProfileDeletionIllustration}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording={t`Retourner à l'accueil`}
          navigateTo={navigateToHomeConfig}
        />,
        <ButtonTertiaryWhite key={2} wording={t`Réactiver mon compte`} icon={Again} />,
      ]}>
      <StyledBody>{t`😢 On est super triste de te voir partir.`}</StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>{t`Tu as 60 jours pour changer d’avis. Tu pourras facilement réactiver ton compte en te connectant.`}</StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>{t`Une fois ce délai écoulé, tu n’auras plus accès à ton compte pass Culture.`}</StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
