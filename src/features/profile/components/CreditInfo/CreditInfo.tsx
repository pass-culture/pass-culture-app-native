import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { Spacer } from 'ui/theme'
import { Typo } from 'ui/theme/typography'

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

const Title = styled(Typo.Title1)(({ theme }) => ({
  color: theme.colors.secondary,
}))
