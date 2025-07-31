import React from 'react'
import styled from 'styled-components/native'

import { getHourWording } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { RadioSelector } from 'ui/components/radioSelector/RadioSelector'

interface Props {
  hour: string
  price: number
  selected: boolean
  onPress: () => void
  testID: string
  isBookable: boolean
  offerCredit: number
  hasSeveralPrices?: boolean
  features: string[]
  index?: number
}

export function HourChoice({
  hour,
  price,
  selected,
  onPress,
  testID,
  isBookable,
  offerCredit,
  hasSeveralPrices,
  features,
  index,
}: Props) {
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const enoughCredit = price <= offerCredit
  const disabled = !isBookable || !enoughCredit
  const priceWording = getHourWording(
    price,
    isBookable,
    enoughCredit,
    currency,
    euroToPacificFrancRate,
    hasSeveralPrices
  )

  const accessibilityLabel = `${hour} ${priceWording}`

  return (
    <Wrapper index={index}>
      <RadioSelector
        label={hour}
        description={features.join(' ')}
        rightText={priceWording}
        onPress={onPress}
        checked={selected}
        disabled={disabled}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
      />
    </Wrapper>
  )
}

const Wrapper = styled.View<{ index?: number }>(({ index = 0, theme }) => ({
  marginTop: index > 0 ? theme.designSystem.size.spacing.s : undefined,
}))
