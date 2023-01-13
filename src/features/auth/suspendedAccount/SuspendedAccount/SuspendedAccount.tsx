import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { useLogoutRoutine } from 'features/auth/logout/useLogoutRoutine'
import { useAccountSuspensionDate } from 'features/auth/suspendedAccount/SuspendedAccount/useAccountSuspensionDate'
import { useAccountUnsuspend } from 'features/auth/suspendedAccount/SuspendedAccount/useAccountUnsuspend'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/firebase/analytics'
import { formatToCompleteFrenchDateTime } from 'libs/parsers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { ProfileDeletionIllustration } from 'ui/svg/icons/ProfileDeletionIllustration'
import { Spacer, Typo } from 'ui/theme'

const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000
const addDaysToDate = (date: Date, days: number) => {
  return new Date(date.getTime() + days * MILLISECONDS_IN_A_DAY)
}

export const SuspendedAccount = () => {
  const { replace } = useNavigation<UseNavigationType>()
  const { data: settings } = useSettingsContext()
  const { data: accountSuspensionDate } = useAccountSuspensionDate()
  const signOut = useLogoutRoutine()
  const { showErrorSnackBar } = useSnackBarContext()

  function onAccountUnsuspendSuccess() {
    replace('AccountReactivationSuccess')
  }

  function onAccountUnsuspendFailure() {
    showErrorSnackBar({
      message: 'Une erreur s’est produite pendant la réactivation.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  const { mutate: unsuspendAccount, isLoading: unsuspendIsLoading } = useAccountUnsuspend(
    onAccountUnsuspendSuccess,
    onAccountUnsuspendFailure
  )

  const onReactivationPress = () => {
    analytics.logAccountReactivation('suspendedaccount')
    unsuspendAccount()
  }

  const unsuspensionDelay = settings?.accountUnsuspensionLimit || 60
  let formattedDate = ''

  if (accountSuspensionDate?.date) {
    const suspensionDate = new Date(accountSuspensionDate.date)
    const reactivationDeadline = addDaysToDate(suspensionDate, unsuspensionDelay)
    formattedDate = formatToCompleteFrenchDateTime(reactivationDeadline, false)
  }

  return (
    <GenericInfoPage
      title="Ton compte est désactivé"
      icon={ProfileDeletionIllustration}
      buttons={[
        <ButtonPrimaryWhite
          key={1}
          wording="Réactiver mon compte"
          isLoading={unsuspendIsLoading}
          onPress={onReactivationPress}
        />,
        <InternalTouchableLink
          key={2}
          as={ButtonTertiaryWhite}
          wording="Retourner à l’accueil"
          navigateTo={{ ...navigateToHomeConfig, params: { ...navigateToHomeConfig.params } }}
          onAfterNavigate={signOut}
          icon={PlainArrowPrevious}
        />,
      ]}>
      <StyledBody>Tu as jusqu’au {formattedDate} pour réactiver ton compte.</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>
        Une fois cette date passée, ton compte pass Culture sera définitivement supprimé.
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
