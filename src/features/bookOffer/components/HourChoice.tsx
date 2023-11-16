import React from 'react'
import styled from 'styled-components/native'

import { getHourWording } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { RadioSelector } from 'ui/components/radioSelector/RadioSelector'
import { getSpacing } from 'ui/theme'

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
}: Readonly<Props>) {
  const enoughCredit = price <= offerCredit
  const disabled = !isBookable || !enoughCredit
  const priceWording = getHourWording(price, isBookable, enoughCredit, hasSeveralPrices)

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

const Wrapper = styled.View<{ index?: number }>(({ index = 0 }) => ({
  marginTop: index > 0 ? getSpacing(2) : undefined,
}))
