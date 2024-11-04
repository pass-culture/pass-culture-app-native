import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesHeader } from 'features/internal/cheatcodes/components/CheatcodesHeader'
import {
  DEFAULT_EURO_TO_CFP_RATE,
  useGetEuroToCFPRate,
} from 'libs/firebase/firestore/exchangeRates/useGetEuroToCFPRate'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Separator } from 'ui/components/Separator'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'

export const NewCaledonia = () => {
  const euroToCFPRate = useGetEuroToCFPRate()
  const enablePacificFrancCurrency = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY
  )

  return (
    <ScrollView>
      <CheatcodesHeader title="Nouvelle-Calédonie 🇳🇨" />
      <Container>
        <TypoDS.Body>État du featureFlag&nbsp;:</TypoDS.Body>
        <StyledText active={enablePacificFrancCurrency}>
          {enablePacificFrancCurrency === true ? 'Actif' : 'Inactif'}
        </StyledText>
        <StyledSeparator />
        <TypoDS.Body>Taux de change sur Firestore&nbsp;:</TypoDS.Body>
        <TypoDS.Title3>{euroToCFPRate}</TypoDS.Title3>
        <StyledSeparator />
        <TypoDS.Body>Taux de change dans le code&nbsp;:</TypoDS.Body>
        <TypoDS.Title3>{DEFAULT_EURO_TO_CFP_RATE}</TypoDS.Title3>
      </Container>
      <Spacer.BottomScreen />
    </ScrollView>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: getSpacing(6),
}))

const StyledText = styled(TypoDS.Title3)<{ active: boolean }>(({ theme, active }) => ({
  color: active ? theme.colors.greenValid : theme.colors.error,
}))

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(4),
})
