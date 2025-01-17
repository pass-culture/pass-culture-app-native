/* eslint-disable local-rules/no-currency-symbols */
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { convertEuroToPacificFranc, RoundUnit } from 'shared/currency/convertEuroToPacificFranc'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { TextInput } from 'ui/components/inputs/TextInput'
import { Separator } from 'ui/components/Separator'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export const CheatcodesScreenNewCaledonia = () => {
  const pacificFrancToEuroRate = useGetPacificFrancToEuroRate()
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
      <TypoDS.Body>
        FeatureFlag
        {SPACE}
        <TypoDS.Title4>enablePacificFrancCurrency</TypoDS.Title4>
        &nbsp;:
      </TypoDS.Body>
      <StyledTitle3 active={enablePacificFrancCurrency}>
        {enablePacificFrancCurrency === true ? 'Actif' : 'Inactif'}
      </StyledTitle3>
      <StyledSeparator />
      <TypoDS.Body>Localisation de l’utilisateur&nbsp;:</TypoDS.Body>
      <TypoDS.Title3>{selectedPlace ? selectedPlace?.info : 'Non localisé'}</TypoDS.Title3>
      <TypoDS.Body>Code postal renseigné par l’utilisateur&nbsp;:</TypoDS.Body>
      <TypoDS.Title3>
        {user ? (user.postalCode ? `${user.postalCode}` : 'Non renseigné') : 'Non connecté'}
      </TypoDS.Title3>
      <TypoDS.Body>Devise renvoyé par l’API&nbsp;:</TypoDS.Body>
      <TypoDS.Title3>{user?.currency ? `${user.currency}` : 'Non connecté'}</TypoDS.Title3>
      <StyledSeparator />
      <TypoDS.Body>Devise affichée à l’utilisateur&nbsp;:</TypoDS.Body>
      <TypoDS.Title3>{currency}</TypoDS.Title3>
      <StyledSeparator />
      <TypoDS.Body>Taux de change depuis le backend&nbsp;:</TypoDS.Body>
      <TypoDS.Title3>{pacificFrancToEuroRate}</TypoDS.Title3>
      <StyledSeparator />
      <TypoDS.Body>Taux de change par défaut côté frontend&nbsp;:</TypoDS.Body>
      <TypoDS.Title3>{DEFAULT_PACIFIC_FRANC_TO_EURO_RATE}</TypoDS.Title3>
      <StyledSeparator />
      <TextInput
        label="Montant en&nbsp;€ pour conversion&nbsp;:"
        autoComplete="off"
        autoCapitalize="none"
        value={inputEuro}
        onChangeText={setInputEuro}
        keyboardType="numeric"
        placeholder="Entrez le montant en&nbsp;€"
        textContentType="none"
      />
      <Spacer.Column numberOfSpaces={4} />
      <TypoDS.Body>Franc Pacifique sans arrondi&nbsp;:</TypoDS.Body>
      <TypoDS.Title3>
        {convertEuroToPacificFranc(priceInEuro, pacificFrancToEuroRate)}&nbsp;F
      </TypoDS.Title3>
      <Spacer.Column numberOfSpaces={4} />
      <TypoDS.Body>Franc Pacifique avec l’arrondi à l’unité&nbsp;:</TypoDS.Body>
      <TypoDS.Title3>
        {convertEuroToPacificFranc(priceInEuro, pacificFrancToEuroRate, RoundUnit.UNITS)}&nbsp;F
      </TypoDS.Title3>
      <StyledSeparator />
    </CheatcodesTemplateScreen>
  )
}

const StyledTitle3 = styled(TypoDS.Title3)<{ active: boolean }>(({ theme, active }) => ({
  color: active ? theme.colors.greenValid : theme.colors.error,
}))

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(4),
})
