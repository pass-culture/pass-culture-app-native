/* eslint-disable local-rules/no-euro-usage */
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/location'
import { useGetPacificFrancToEuroRate } from 'queries/settings/useSettings'
import { convertEuroToPacificFranc, RoundUnit } from 'shared/currency/convertEuroToPacificFranc'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'
import { Separator } from 'ui/components/Separator'
import { TextInput } from 'ui/designSystem/TextInput/TextInput'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export const CheatcodesScreenNewCaledonia = () => {
  const { data: pacificFrancToEuroRate } = useGetPacificFrancToEuroRate()
  const enablePacificFrancCurrency = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY
  )

  const [inputEuro, setInputEuro] = useState('')
  const priceInEuro = parseFloat(inputEuro) || 0

  const { selectedPlace } = useLocation()
  const { user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()

  return (
    <CheatcodesTemplateScreen title="Nouvelle-Calédonie 🇳🇨" flexDirection="column">
      <Typo.Body>
        FeatureFlag
        {SPACE}
        <Typo.Title4>enablePacificFrancCurrency</Typo.Title4>
        &nbsp;:
      </Typo.Body>
      <StyledTitle3 active={enablePacificFrancCurrency}>
        {enablePacificFrancCurrency === true ? 'Actif' : 'Inactif'}
      </StyledTitle3>
      <Separator.HorizontalWithMargin />
      <Typo.Body>Localisation de l’utilisateur&nbsp;:</Typo.Body>
      <Typo.Title3>{selectedPlace ? selectedPlace?.info : 'Non localisé'}</Typo.Title3>
      <Typo.Body>Code postal renseigné par l’utilisateur&nbsp;:</Typo.Body>
      <Typo.Title3>
        {user ? (user.postalCode ? `${user.postalCode}` : 'Non renseigné') : 'Non connecté'}
      </Typo.Title3>
      <Typo.Body>Devise renvoyé par l’API&nbsp;:</Typo.Body>
      <Typo.Title3>{user?.currency ? `${user.currency}` : 'Non connecté'}</Typo.Title3>
      <Separator.HorizontalWithMargin />
      <Typo.Body>Devise affichée à l’utilisateur&nbsp;:</Typo.Body>
      <Typo.Title3>{currency}</Typo.Title3>
      <Separator.HorizontalWithMargin />
      <Typo.Body>Taux de change depuis le backend&nbsp;:</Typo.Body>
      <Typo.Title3>{pacificFrancToEuroRate}</Typo.Title3>
      <Separator.HorizontalWithMargin />
      <Typo.Body>Taux de change par défaut côté frontend&nbsp;:</Typo.Body>
      <Typo.Title3>{DEFAULT_PACIFIC_FRANC_TO_EURO_RATE}</Typo.Title3>
      <Separator.HorizontalWithMargin />
      <TextInput
        label="Montant en&nbsp;€ pour conversion&nbsp;:"
        autoComplete="off" // Keep autocomplete="off" to prevent incorrect suggestions.
        autoCapitalize="none"
        value={inputEuro}
        onChangeText={setInputEuro}
        keyboardType="numeric"
      />
      <StyledText>Franc Pacifique sans arrondi&nbsp;:</StyledText>
      <Typo.Title3>
        {convertEuroToPacificFranc(priceInEuro, pacificFrancToEuroRate)}&nbsp;F
      </Typo.Title3>
      <StyledText>Franc Pacifique avec l’arrondi à l’unité&nbsp;:</StyledText>
      <Typo.Title3>
        {convertEuroToPacificFranc(priceInEuro, pacificFrancToEuroRate, RoundUnit.UNITS)}&nbsp;F
      </Typo.Title3>
      <Separator.HorizontalWithMargin />
    </CheatcodesTemplateScreen>
  )
}

const StyledTitle3 = styled(Typo.Title3)<{ active: boolean }>(({ theme, active }) => ({
  color: active ? theme.designSystem.color.text.success : theme.designSystem.color.text.error,
}))

const StyledText = styled(Typo.Body)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
