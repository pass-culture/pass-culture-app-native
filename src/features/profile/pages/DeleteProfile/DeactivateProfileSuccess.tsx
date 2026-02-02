import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useAccountUnsuspensionLimit } from 'queries/settings/useSettings'
import { Emoji } from 'ui/components/Emoji'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Again } from 'ui/svg/icons/Again'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { Typo } from 'ui/theme'

export function DeactivateProfileSuccess() {
  const signOut = useLogoutRoutine()
  const { data: reactivationLimit } = useAccountUnsuspensionLimit()

  useEffect(() => {
    signOut()
  }, [signOut])

  return (
    <GenericInfoPage
      illustration={ProfileDeletion}
      title="Ton compte a été désactivé"
      buttonPrimary={{
        wording: 'Retourner à l’accueil',
        navigateTo: { ...navigateToHomeConfig, params: { ...navigateToHomeConfig.params } },
      }}
      buttonSecondary={{
        wording: 'Réactiver mon compte',
        navigateTo: { screen: 'Login', params: { from: StepperOrigin.DEACTIVATE_PROFILE_SUCCESS } },
        onBeforeNavigate: () => analytics.logAccountReactivation('deactivateprofilesuccess'),
        icon: Again,
      }}>
      <ViewGap gap={4}>
        <StyledBody>
          <Emoji.CryingFace withSpaceAfter />
          On est super triste de te voir partir.
        </StyledBody>
        <StyledBody>
          Tu as {reactivationLimit} jours pour changer d’avis. Tu pourras facilement réactiver ton
          compte en te connectant.
        </StyledBody>
        <StyledBody>
          Une fois ce délai écoulé, tu n’auras plus accès à ton compte pass Culture.
        </StyledBody>
      </ViewGap>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
