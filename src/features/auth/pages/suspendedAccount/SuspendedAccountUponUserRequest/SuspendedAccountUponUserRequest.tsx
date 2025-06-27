import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { useAccountSuspensionDateQuery } from 'features/auth/queries/useAccountSuspensionDateQuery'
import { useAccountUnsuspendMutation } from 'features/auth/queries/useAccountUnsuspendMutation'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { formatToCompleteFrenchDateTime } from 'libs/parsers/formatDates'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { Typo } from 'ui/theme'

const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000
const addDaysToDate = (date: Date, days: number) => {
  return new Date(date.getTime() + days * MILLISECONDS_IN_A_DAY)
}

export const SuspendedAccountUponUserRequest = () => {
  const { replace } = useNavigation<UseNavigationType>()
  const { data: settings } = useSettingsContext()
  const { data: accountSuspensionDate } = useAccountSuspensionDateQuery()
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

  const { mutate: unsuspendAccount, isLoading: unsuspendIsLoading } = useAccountUnsuspendMutation(
    onAccountUnsuspendSuccess,
    onAccountUnsuspendFailure
  )

  const onReactivationPress = () => {
    analytics.logAccountReactivation('suspendedaccountuponuserrequest')
    unsuspendAccount()
  }

  const unsuspensionDelay = settings?.accountUnsuspensionLimit ?? 60
  let formattedDate = ''

  if (accountSuspensionDate?.date) {
    const suspensionDate = new Date(accountSuspensionDate.date)
    const reactivationDeadline = addDaysToDate(suspensionDate, unsuspensionDelay)
    formattedDate = formatToCompleteFrenchDateTime({
      date: reactivationDeadline,
      shouldDisplayWeekDay: false,
    })
  }

  return (
    <GenericInfoPage
      illustration={ProfileDeletion}
      title="Ton compte est désactivé"
      subtitle={`Tu as jusqu’au ${formattedDate} pour réactiver ton compte.`}
      buttonPrimary={{
        wording: 'Réactiver mon compte',
        isLoading: unsuspendIsLoading,
        onPress: onReactivationPress,
      }}
      buttonTertiary={{
        wording: 'Retourner à l’accueil',
        navigateTo: navigateToHomeConfig,
        onAfterNavigate: signOut,
        icon: PlainArrowPrevious,
      }}>
      <StyledBody>
        Une fois cette date passée, ton compte pass Culture sera définitivement supprimé.
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
