import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useAccountSuspend } from 'features/auth/api'
import { useLogoutRoutine } from 'features/auth/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'
import { Typo } from 'ui/theme'

export function ConfirmDeleteProfile() {
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  const signOut = useLogoutRoutine()
  const { showErrorSnackBar } = useSnackBarContext()

  function onAccountSuspendSuccess() {
    navigate('DeleteProfileSuccess')
    signOut()
  }

  function onAccountSuspendFailure() {
    showErrorSnackBar({
      message: t`Une erreur s’est produite pendant le chargement.`,
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  const { mutate: notifyAccountSuspend, isLoading } = useAccountSuspend(
    onAccountSuspendSuccess,
    onAccountSuspendFailure
  )

  return (
    <GenericInfoPage
      title={t`Es-tu sûr de vouloir supprimer ton compte\u00a0?`}
      icon={ErrorIllustration}
      buttons={[
        <ButtonPrimaryWhite
          key={1}
          isLoading={isLoading}
          wording={t`Supprimer mon compte`}
          onPress={notifyAccountSuspend}
        />,
        <ButtonTertiaryWhite key={2} wording={t`Abandonner`} onPress={goBack} />,
      ]}>
      <StyledBody>{t`Cela entraînera l'annulation de l'ensemble de tes réservations en cours, ainsi que la suppression définitive de ton crédit pass Culture si tu en bénéficies.`}</StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
