import React from 'react'
import styled from 'styled-components/native'

import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { Emoji } from 'ui/components/Emoji'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { Typo } from 'ui/theme'

export const DeleteProfileSuccess = () => {
  const signOut = useLogoutRoutine()

  return (
    <GenericInfoPage
      illustration={ProfileDeletion}
      remoteIllustration={{
        url: remoteIllustrationUrls.trashMosaic,
        backgroundColor: 'negative01',
      }}
      title="Ton compte a été supprimé"
      buttonPrimary={{
        wording: 'Retourner à l’accueil',
        navigateTo: {
          ...navigateToHomeConfig,
          withReset: true,
          params: { ...navigateToHomeConfig.params },
        },
        onAfterNavigate: () => {
          void signOut()
        },
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
