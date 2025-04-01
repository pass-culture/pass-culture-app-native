import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { Emoji } from 'ui/components/Emoji'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { Typo } from 'ui/theme'

export function DeleteProfileSuccess() {
  const signOut = useLogoutRoutine()

  useEffect(() => {
    signOut()
  }, [signOut])

  return (
    <GenericInfoPage
      illustration={ProfileDeletion}
      title="Ton compte a été supprimé"
      buttonPrimary={{
        wording: 'Retourner à l’accueil',
        navigateTo: { ...navigateToHomeConfig, params: { ...navigateToHomeConfig.params } },
      }}>
      <ViewGap gap={4}>
        <StyledBody>
          <Emoji.CryingFace withSpaceAfter />
          On est super triste de te voir partir.
        </StyledBody>
        <StyledBody>
          Tu peux malgré tout continuer à découvrir toute l’actu culturelle en consultant le
          catalogue&nbsp;!
        </StyledBody>
      </ViewGap>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
