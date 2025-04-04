import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { storage } from 'libs/storage'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Typo } from 'ui/theme'

export function EighteenBirthday() {
  const { user } = useAuthContext()
  const pageWording = useGetPageWording(user?.requiresIdCheck)

  useEffect(() => {
    storage.saveObject('has_seen_eligible_card', true)
  }, [])

  return (
    <GenericInfoPage
      animation={TutorialPassLogo}
      title="Tu as 18 ans&nbsp;!"
      subtitle={pageWording.text}
      buttonPrimary={{
        wording: pageWording.buttonText,
        navigateTo: { screen: 'Stepper' },
      }}
      buttonTertiary={{
        wording: 'Plus tard',
        navigateTo: { screen: 'TabNavigator', params: { screen: 'Home' } },
        icon: ClockFilled,
      }}>
      <ResetText />
    </GenericInfoPage>
  )
}

const useGetPageWording = (userRequiresIdCheck?: boolean) => {
  const { eighteenYearsOldDeposit } = useDepositAmountsByAge()
  if (userRequiresIdCheck) {
    return {
      text: `Vérifie ton identité pour débloquer tes ${eighteenYearsOldDeposit}.`,
      buttonText: 'Vérifier mon identité',
    }
  }
  return {
    text: `Confirme tes informations personnelles pour débloquer tes ${eighteenYearsOldDeposit}.`,
    buttonText: 'Confirmer mes informations',
  }
}

function ResetText() {
  const { data: settings } = useSettingsContext()
  const enableCreditV3 = settings?.wipEnableCreditV3

  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const zero = formatCurrencyFromCents(0, currency, euroToPacificFrancRate)

  if (enableCreditV3) return null

  return <StyledBodyAccentXs>Ton crédit précédent a été remis à {zero}.</StyledBodyAccentXs>
}

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)({
  textAlign: 'center',
})
