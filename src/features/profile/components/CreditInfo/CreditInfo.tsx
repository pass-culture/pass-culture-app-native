import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { useGetPacificFrancToEuroRate } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { formatCurrencyFromCents } from 'libs/parsers/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { Spacer } from 'ui/theme'
import { TypoDS } from 'ui/theme/designSystemTypographie'

type CreditInfoProps = {
  totalCredit: DomainsCredit['all']
}

export function CreditInfo({ totalCredit }: PropsWithChildren<CreditInfoProps>) {
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const totalCreditWithCurrency = formatCurrencyFromCents(
    totalCredit.remaining,
    currency,
    euroToPacificFrancRate
  )

  return (
    <View testID="credit-info">
      <Title>{totalCreditWithCurrency}</Title>
      <Spacer.Column numberOfSpaces={3} />
      <CreditProgressBar progress={totalCredit.remaining / totalCredit.initial} />
    </View>
  )
}

const Title = styled(TypoDS.Title1)(({ theme }) => ({
  color: theme.colors.secondary,
}))
