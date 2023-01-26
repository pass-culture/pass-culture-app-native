import React from 'react'
import styled from 'styled-components/native'

import { ChoiceBloc, getTextColor } from 'features/bookOffer/components/ChoiceBloc'
import { formatToFrenchDecimal } from 'libs/parsers'
import { getSpacing, Typo } from 'ui/theme'

const getWording = (price: number, isBookable: boolean, enoughCredit: boolean): string => {
  if (!enoughCredit) return 'crédit insuffisant'
  if (isBookable) return formatToFrenchDecimal(price).replace(' ', '')
  return 'épuisé'
}

interface Props {
  hour: string
  price: number
  selected: boolean
  onPress: () => void
  testID: string
  isBookable: boolean
  offerCredit: number
}

export const HourChoice: React.FC<Props> = ({
  hour,
  price,
  selected,
  onPress,
  testID,
  isBookable,
  offerCredit,
}) => {
  const enoughCredit = price <= offerCredit
  const disabled = !isBookable || !enoughCredit
  const wording = getWording(price, isBookable, enoughCredit)

  const accessibilityLabel = `${hour} ${wording}`
  return (
    <ChoiceBloc
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      selected={selected}
      disabled={disabled}>
      <Container>
        <ButtonText testID={`${testID}-hour`} selected={selected} disabled={disabled}>
          {hour}
        </ButtonText>

        <Caption testID={`${testID}-price`} selected={selected} disabled={disabled}>
          {wording}
        </Caption>
      </Container>
    </ChoiceBloc>
  )
}

const Container = styled.View({
  minHeight: getSpacing(20),
  alignItems: 'center',
  justifyContent: 'center',
})

interface TypoProps {
  selected: boolean
  disabled: boolean
}

const ButtonText = styled(Typo.ButtonText)<TypoProps>(({ selected, disabled, theme }) => ({
  color: getTextColor(theme, selected, disabled),
}))

const Caption = styled(Typo.Caption)<TypoProps>(({ selected, disabled, theme }) => ({
  color: getTextColor(theme, selected, disabled),
  textAlign: 'center',
}))
