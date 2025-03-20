import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { Emoji } from 'ui/components/Emoji'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { Spacer, Typo } from 'ui/theme'

export function DeleteProfileSuccess() {
  const signOut = useLogoutRoutine()

  useEffect(() => {
    signOut()
  }, [signOut])

  return (
    <GenericInfoPage
      title="Ton compte a été supprimé"
      icon={ProfileDeletion}
      buttons={[
        <InternalTouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording="Retourner à l’accueil"
          navigateTo={{ ...navigateToHomeConfig, params: { ...navigateToHomeConfig.params } }}
        />,
      ]}>
      <StyledBody>
        <Emoji.CryingFace withSpaceAfter />
        On est super triste de te voir partir.
      </StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>
        Tu peux malgré tout continuer à découvrir toute l’actu culturelle en consultant le
        catalogue&nbsp;!
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
