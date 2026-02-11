import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { useAccountSuspensionDateQuery } from 'features/auth/queries/useAccountSuspensionDateQuery'
import { useAccountUnsuspendMutation } from 'features/auth/queries/useAccountUnsuspendMutation'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { formatToCompleteFrenchDateTime } from 'libs/parsers/formatDates'
import { useAccountUnsuspensionLimit } from 'queries/settings/useSettings'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
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
  const { data: accountUnsuspensionLimit } = useAccountUnsuspensionLimit()
  const { data: accountSuspensionDate } = useAccountSuspensionDateQuery()
  const signOut = useLogoutRoutine()

  function onAccountUnsuspendSuccess() {
    replace('AccountReactivationSuccess')
  }

  const { mutate: unsuspendAccount, isPending: unsuspendIsLoading } = useAccountUnsuspendMutation(
    onAccountUnsuspendSuccess,
    onAccountUnsuspendFailure
  )

  const onReactivationPress = () => {
    void analytics.logAccountReactivation('suspendedaccountuponuserrequest')
    unsuspendAccount()
  }

  const unsuspensionDelay = accountUnsuspensionLimit ?? 60
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

const onAccountUnsuspendFailure = () => {
  showErrorSnackBar('Une erreur s’est produite pendant la réactivation.')
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
