import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { useParseCurrencyFromCents } from 'libs/parsers/parseCurrencyFromCents'
import { Spacer } from 'ui/theme'
import { TypoDS } from 'ui/theme/designSystemTypographie'

type CreditInfoProps = {
  totalCredit: DomainsCredit['all']
}

export function CreditInfo({ totalCredit }: PropsWithChildren<CreditInfoProps>) {
  return (
    <View testID="credit-info">
      <Title>{useParseCurrencyFromCents(totalCredit.remaining)}</Title>
      <Spacer.Column numberOfSpaces={3} />
      <CreditProgressBar progress={totalCredit.remaining / totalCredit.initial} />
    </View>
  )
}

const Title = styled(TypoDS.Title1)(({ theme }) => ({
  color: theme.colors.secondary,
}))
