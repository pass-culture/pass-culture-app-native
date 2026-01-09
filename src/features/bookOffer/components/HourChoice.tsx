import React from 'react'
import styled from 'styled-components/native'

import { getHourWording } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { RadioSelector } from 'ui/components/radioSelector/RadioSelector'

interface Props {
  radioGroupLabel: string
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
  radioGroupLabel,
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
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()

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

  const joinedFeatures = features.join(' ')
  const accessibilityLabel = `${hour} ${joinedFeatures} ${priceWording}`

  return (
    <Wrapper index={index}>
      <RadioSelector
        radioGroupLabel={radioGroupLabel}
        label={hour}
        description={joinedFeatures}
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
