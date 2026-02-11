import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useAnonymizeAccountMutation } from 'features/profile/queries/useAnonymizeAccountMutation'
import { env } from 'libs/environment/env'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { Spacer, Typo } from 'ui/theme'

export const DeleteProfileConfirmation = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const signOut = useLogoutRoutine()
  const { anonymizeAccount } = useAnonymizeAccountMutation({
    onSuccess: async () => {
      await signOut()
      navigate(...getProfileHookConfig('DeleteProfileSuccess'))
    },
    onError: () => {
      showErrorSnackBar(
        'Une erreur s’est produite lors de ta demande de suppression de compte. Réessaie plus tard.'
      )
    },
  })

  const navigateToDeleteProfileReason = () =>
    navigate(...getProfileHookConfig('DeleteProfileReason'))

  return (
    <GenericInfoPage
      withGoBack
      illustration={ProfileDeletion}
      title="Ta demande de suppression de compte"
      buttonPrimary={{
        wording: 'Supprimer mon compte',
        onPress: anonymizeAccount,
      }}
      buttonTertiary={{
        wording: 'Annuler',
        onPress: navigateToDeleteProfileReason,
        icon: Invalidate,
      }}>
      <Typo.Body>
        Si tu confirmes ta demande, tu ne pourras plus accéder à ton compte et tes données
        personnelles seront supprimées (anonymisées).
      </Typo.Body>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>Tes réservations en cours seront également annulées et supprimées.</Typo.Body>
      <Spacer.Column numberOfSpaces={6} />
      <Banner
        label="L’anonymisation de tes données personnelles empêche toute possibilité de te réidentifier à l’avenir."
        links={[
          { wording: 'Consultez notre FAQ', externalNav: { url: env.FAQ_LINK_RIGHT_TO_ERASURE } },
        ]}
      />
    </GenericInfoPage>
  )
}
