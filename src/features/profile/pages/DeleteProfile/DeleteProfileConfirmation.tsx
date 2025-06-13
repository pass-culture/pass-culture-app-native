import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useAnonymizeAccountMutation } from 'features/profile/queries/useAnonymizeAccountMutation'
import { env } from 'libs/environment/env'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuaternarySecondary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { Spacer, Typo } from 'ui/theme'

export const DeleteProfileConfirmation = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const signOut = useLogoutRoutine()
  const { showErrorSnackBar } = useSnackBarContext()
  const { anonymizeAccount } = useAnonymizeAccountMutation({
    onSuccess: async () => {
      await signOut()
      navigate(...getProfileStackConfig('DeleteProfileSuccess'))
    },
    onError: () => {
      showErrorSnackBar({
        message:
          'Une erreur s’est produite lors de ta demande de suppression de compte. Réessaie plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const navigateToDeleteProfileReason = () =>
    navigate(...getProfileStackConfig('DeleteProfileReason'))

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
      <InfoBanner message="L’anonymisation de tes données personnelles empêche toute possibilité de te réidentifier à l’avenir.">
        <Spacer.Column numberOfSpaces={2} />
        <ExternalTouchableLink
          as={ButtonQuaternarySecondary}
          externalNav={{ url: env.FAQ_LINK_RIGHT_TO_ERASURE }}
          wording="Consultez notre FAQ"
          icon={ExternalSiteFilled}
          justifyContent="flex-start"
          inline
        />
      </InfoBanner>
    </GenericInfoPage>
  )
}
