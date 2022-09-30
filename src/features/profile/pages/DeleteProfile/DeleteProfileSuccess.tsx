import React from 'react'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { Emoji } from 'ui/components/Emoji'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Again } from 'ui/svg/icons/Again'
import { ProfileDeletionIllustration } from 'ui/svg/icons/ProfileDeletionIllustration'
import { Spacer, Typo } from 'ui/theme'

export function DeleteProfileSuccess() {
  const { data: settings } = useAppSettings()
  const reactivationLimit = settings?.accountUnsuspensionLimit
  return (
    <GenericInfoPage
      title="Ton compte a été désactivé"
      icon={ProfileDeletionIllustration}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording="Retourner à l’accueil"
          navigateTo={{ ...navigateToHomeConfig, params: { ...navigateToHomeConfig.params } }}
        />,
        <TouchableLink
          key={2}
          as={ButtonTertiaryWhite}
          wording="Réactiver mon compte"
          onPress={() => analytics.logAccountReactivation('deleteprofilesuccess')}
          icon={Again}
          navigateTo={{ screen: 'Login' }}
        />,
      ]}>
      <StyledBody>
        <Emoji.CryingFace withSpaceAfter />
        On est super triste de te voir partir.
      </StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>
        Tu as {reactivationLimit} jours pour changer d’avis. Tu pourras facilement réactiver ton
        compte en te connectant.
      </StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>
        Une fois ce délai écoulé, tu n’auras plus accès à ton compte pass Culture.
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
