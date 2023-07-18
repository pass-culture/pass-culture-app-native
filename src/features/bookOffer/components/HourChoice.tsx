import React from 'react'
import styled from 'styled-components/native'

import { getHourWording } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { SelectableListItem } from 'features/offer/components/SelectableListItem/SelectableListItem'
import { getSpacing, Typo } from 'ui/theme'

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
    <SelectableListItem
      onSelect={onPress}
      isSelected={selected}
      disabled={disabled}
      render={() => (
        <Container>
          <LeftContent>
            <Hour disabled={disabled} testID={`${testID}-hour`}>
              {hour}
            </Hour>
            {
              features.length ? (
                <Tags disabled={disabled}>{features.join(' ')}</Tags>
              ) : null /* conditionally render tags since it applies a margin even when nothing is displayed */
            }
          </LeftContent>

          <PriceTag disabled={disabled} testID={`${testID}-price`}>
            {priceWording}
          </PriceTag>
        </Container>
      )}
      accessibilityLabel={selected ? `${accessibilityLabel} sélectionné` : accessibilityLabel}
      testID={testID}
    />
  )
}

const Container = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
})

const LeftContent = styled.View({
  flex: 1,
  marginVertical: getSpacing(4),
})

const Hour = styled(Typo.ButtonText)(({ theme, disabled }) => ({
  color: disabled ? theme.colors.greyDark : undefined,
}))

const Tags = styled(Typo.Caption)(({ theme, disabled }) => ({
  marginTop: getSpacing(1),
  color: disabled ? theme.colors.greySemiDark : theme.colors.greyDark,
}))

const PriceTag = styled(Typo.Body)(({ theme, disabled }) => ({
  color: disabled ? theme.colors.greyDark : theme.colors.black,
}))
