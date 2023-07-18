import React from 'react'

import { getHourWording } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
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
}: Props) {
  const enoughCredit = price <= offerCredit
  const disabled = !isBookable || !enoughCredit
  const priceWording = getHourWording(price, isBookable, enoughCredit, hasSeveralPrices)

  const accessibilityLabel = `${hour} ${priceWording}`

  return (
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
  )
}
