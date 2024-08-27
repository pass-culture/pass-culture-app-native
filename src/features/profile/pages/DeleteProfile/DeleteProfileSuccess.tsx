import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { Emoji } from 'ui/components/Emoji'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Again } from 'ui/svg/icons/Again'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { Spacer, Typo } from 'ui/theme'

export function DeleteProfileSuccess() {
  const signOut = useLogoutRoutine()
  const { data: settings } = useSettingsContext()
  const reactivationLimit = settings?.accountUnsuspensionLimit

  useEffect(() => {
    signOut()
  }, [signOut])

  return (
    <GenericInfoPage
      title="Ton compte a été désactivé"
      icon={ProfileDeletion}
      buttons={[
        <InternalTouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording="Retourner à l’accueil"
          navigateTo={{ ...navigateToHomeConfig, params: { ...navigateToHomeConfig.params } }}
        />,
        <InternalTouchableLink
          key={2}
          as={ButtonTertiaryWhite}
          wording="Réactiver mon compte"
          onBeforeNavigate={() => analytics.logAccountReactivation('deleteprofilesuccess')}
          icon={Again}
          navigateTo={{ screen: 'Login', params: { from: StepperOrigin.DELETE_PROFILE_SUCCESS } }}
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
