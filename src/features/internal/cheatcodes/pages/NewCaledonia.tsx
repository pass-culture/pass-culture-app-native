import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesHeader } from 'features/internal/cheatcodes/components/CheatcodesHeader'
import {
  DEFAULT_EURO_TO_CFP_RATE,
  useGetEuroToCFPRate,
} from 'libs/firebase/firestore/exchangeRates/useGetEuroToCFPRate'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { convertEuroToCFP, RoundUnit } from 'shared/currency/convertEuroToCFP'
import { TextInput } from 'ui/components/inputs/TextInput'
import { Separator } from 'ui/components/Separator'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'

export const NewCaledonia = () => {
  const euroToCFPRate = useGetEuroToCFPRate() || DEFAULT_EURO_TO_CFP_RATE
  const enablePacificFrancCurrency = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY
  )

  const [inputEuro, setInputEuro] = useState('')
  const priceInEuro = parseFloat(inputEuro) || 0

  return (
    <ScrollView>
      <CheatcodesHeader title="Nouvelle-Calédonie 🇳🇨" />
      <Container>
        <TypoDS.Body>État du featureFlag&nbsp;:</TypoDS.Body>
        <StyledTitle3 active={enablePacificFrancCurrency}>
          {enablePacificFrancCurrency === true ? 'Actif' : 'Inactif'}
        </StyledTitle3>
        <StyledSeparator />
        <TypoDS.Body>Taux de change sur Firestore&nbsp;:</TypoDS.Body>
        <TypoDS.Title3>{euroToCFPRate}</TypoDS.Title3>
        <StyledSeparator />
        <TypoDS.Body>Taux de change dans le code&nbsp;:</TypoDS.Body>
        <TypoDS.Title3>{DEFAULT_EURO_TO_CFP_RATE}</TypoDS.Title3>
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
        <TypoDS.Body>CFP sans arrondi&nbsp;:</TypoDS.Body>
        <TypoDS.Title3>{convertEuroToCFP(priceInEuro, euroToCFPRate)}&nbsp;CFP</TypoDS.Title3>
        <Spacer.Column numberOfSpaces={4} />
        <TypoDS.Body>CFP avec l’arrondi à l’unité&nbsp;:</TypoDS.Body>
        <TypoDS.Title3>
          {convertEuroToCFP(priceInEuro, euroToCFPRate, RoundUnit.UNITS)}&nbsp;CFP
        </TypoDS.Title3>
        <Spacer.Column numberOfSpaces={4} />
        <TypoDS.Body>CFP avec l’arrondi à la dizaine&nbsp;:</TypoDS.Body>
        <TypoDS.Title3>
          {convertEuroToCFP(priceInEuro, euroToCFPRate, RoundUnit.TENS)}&nbsp;CFP
        </TypoDS.Title3>
        <Spacer.Column numberOfSpaces={4} />
        <TypoDS.Body>CFP avec l’arrondi à la centaine&nbsp;:</TypoDS.Body>
        <TypoDS.Title3>
          {convertEuroToCFP(priceInEuro, euroToCFPRate, RoundUnit.HUNDREDS)}&nbsp;CFP
        </TypoDS.Title3>
        <StyledSeparator />
      </Container>
      <Spacer.BottomScreen />
    </ScrollView>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: getSpacing(6),
}))

const StyledTitle3 = styled(TypoDS.Title3)<{ active: boolean }>(({ theme, active }) => ({
  color: active ? theme.colors.greenValid : theme.colors.error,
}))

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(4),
})
