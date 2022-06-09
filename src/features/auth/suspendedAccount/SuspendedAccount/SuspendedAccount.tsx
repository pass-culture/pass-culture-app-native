import { t } from '@lingui/macro'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { useLogoutRoutine } from 'features/auth/AuthContext'
import { useAppSettings } from 'features/auth/settings'
import { useAccountSuspensionDate } from 'features/auth/suspendedAccount/SuspendedAccount/useAccountSuspensionDate'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers'
import { PageNotFound } from 'features/navigation/PageNotFound'
import { formatToCompleteFrenchDateTime } from 'libs/parsers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { ProfileDeletionIllustration } from 'ui/svg/icons/ProfileDeletionIllustration'
import { Spacer, Typo } from 'ui/theme'

const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000
const addDaysToDate = (date: Date, days: number) => {
  return new Date(date.getTime() + days * MILLISECONDS_IN_A_DAY)
}

export const SuspendedAccount = () => {
  const { data: settings } = useAppSettings()
  const { data: accountSuspensionDate } = useAccountSuspensionDate()
  const signOut = useLogoutRoutine()

  useFocusEffect(
    useCallback(() => {
      if (!settings?.allowAccountReactivation || accountSuspensionDate === undefined) {
        navigateToHome()
      }
    }, [settings, accountSuspensionDate])
  )

  const reactivationLimit = settings?.accountReactivationLimit || 60
  let formattedDate = ''

  if (accountSuspensionDate) {
    const suspensionDate = new Date(accountSuspensionDate.date)
    const reactivationDeadline = addDaysToDate(suspensionDate, reactivationLimit)
    formattedDate = formatToCompleteFrenchDateTime(reactivationDeadline, false)
  }

  return settings?.allowAccountReactivation ? (
    <GenericInfoPage
      onGoBackPress={signOut}
      title={t`Ton compte est désactivé`}
      icon={ProfileDeletionIllustration}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording={t`Réactiver mon compte`}
          navigateTo={{ screen: 'AccountReactivationSuccess' }}
        />,
        <TouchableLink
          key={2}
          as={ButtonTertiaryWhite}
          wording={t`Retourner à l'accueil`}
          navigateTo={navigateToHomeConfig}
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
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>
        {t`Pour réactiver ton compte, nous allons te demander de réinitialiser ton mot de passe.`}
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
