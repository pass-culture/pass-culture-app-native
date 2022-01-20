import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { formatToFrenchDecimal } from 'libs/parsers'
import { getSpacing, Typo } from 'ui/theme'

import { ChoiceBloc, useTextColor } from './ChoiceBloc'

const getWording = (price: number, isBookable: boolean, enoughCredit: boolean): string => {
  if (!enoughCredit) return t`crédit insuffisant`
  if (isBookable) return formatToFrenchDecimal(price).replace(' ', '')
  return t`épuisé`
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
  const textColor = useTextColor(selected, disabled)
  const wording = getWording(price, isBookable, enoughCredit)

  return (
    <ChoiceBloc onPress={onPress} testID={testID} selected={selected} disabled={disabled}>
      <Container>
        <Typo.ButtonText testID={`${testID}-hour`} color={textColor}>
          {hour}
        </Typo.ButtonText>

        <Caption testID={`${testID}-price`} color={textColor}>
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

const Caption = styled(Typo.Caption)({ textAlign: 'center' })
