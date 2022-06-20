import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { useLogoutRoutine } from 'features/auth/AuthContext'
import { useAppSettings } from 'features/auth/settings'
import { useAccountSuspensionDate } from 'features/auth/suspendedAccount/SuspendedAccount/useAccountSuspensionDate'
import { useAccountUnsuspend } from 'features/auth/suspendedAccount/SuspendedAccount/useAccountUnsuspend'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers'
import { PageNotFound } from 'features/navigation/PageNotFound'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { formatToCompleteFrenchDateTime } from 'libs/parsers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { ProfileDeletionIllustration } from 'ui/svg/icons/ProfileDeletionIllustration'
import { Spacer, Typo } from 'ui/theme'

const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000
const addDaysToDate = (date: Date, days: number) => {
  return new Date(date.getTime() + days * MILLISECONDS_IN_A_DAY)
}

export const SuspendedAccount = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: settings } = useAppSettings()
  const { data: accountSuspensionDate } = useAccountSuspensionDate()
  const signOut = useLogoutRoutine()
  const { showErrorSnackBar } = useSnackBarContext()

  function onAccountUnsuspendSuccess() {
    navigate('AccountReactivationSuccess')
  }

  function onAccountUnsuspendFailure() {
    showErrorSnackBar({
      message: t`Une erreur s’est produite pendant la réactivation.`,
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

  useFocusEffect(
    useCallback(() => {
      if (!settings?.allowAccountUnsuspension) {
        navigateToHome()
      }
    }, [settings])
  )

  const unsuspensionDelay = settings?.accountUnsuspensionLimit || 60
  let formattedDate = ''

  if (accountSuspensionDate?.date) {
    const suspensionDate = new Date(accountSuspensionDate.date)
    const reactivationDeadline = addDaysToDate(suspensionDate, unsuspensionDelay)
    formattedDate = formatToCompleteFrenchDateTime(reactivationDeadline, false)
  }

  return settings?.allowAccountUnsuspension ? (
    <GenericInfoPage
      title={t`Ton compte est désactivé`}
      icon={ProfileDeletionIllustration}
      buttons={[
        <ButtonPrimaryWhite
          key={1}
          wording={t`Réactiver mon compte`}
          isLoading={unsuspendIsLoading}
          onPress={onReactivationPress}
        />,
        <TouchableLink
          key={2}
          as={ButtonTertiaryWhite}
          wording={t`Retourner à l'accueil`}
          navigateTo={{ ...navigateToHomeConfig, params: { ...navigateToHomeConfig.params } }}
          onPress={signOut}
          icon={PlainArrowPrevious}
          navigateBeforeOnPress
        />,
      ]}>
      <StyledBody>{t`Tu as jusqu'au ${formattedDate} pour réactiver ton compte.`}</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>
        {t`Une fois cette date passée, ton compte pass Culture sera définitivement supprimé.`}
      </StyledBody>
    </GenericInfoPage>
  ) : (
    <PageNotFound />
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
