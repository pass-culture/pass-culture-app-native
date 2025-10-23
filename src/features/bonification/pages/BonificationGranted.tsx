import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'

export function BonificationGranted() {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToProfile = () => navigate(...getTabHookConfig('Profile'))

  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const bonificationAmount = formatCurrencyFromCents(5000, currency, euroToPacificFrancRate) // get amount from backend

  return (
    <GenericInfoPage
      animation={QpiThanks}
      title="Bonne nouvelle&nbsp;!"
      subtitle={`Ton dossier est validé\u00a0! Tu fais partie des jeunes qui bénéficient d’une aide. 
${bonificationAmount} ont été ajoutés à ton crédit pour explorer la culture.`}
      buttonPrimary={{ wording: 'Consulter mon profil', onPress: navigateToProfile }}
      buttonSecondary={{ wording: 'Revenir à l’accueil', navigateTo: navigateToHomeConfig }}
    />
  )
}
