import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
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
    <ViewGap gap={3} testID="credit-info">
      <Title>{totalCreditWithCurrency}</Title>
      <CreditProgressBar progress={totalCredit.remaining / totalCredit.initial} />
    </ViewGap>
  )
}

const Title = styled(Typo.Title1)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))
