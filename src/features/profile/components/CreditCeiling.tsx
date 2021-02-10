import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Expense, ExpenseDomain } from 'api/gen/api'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

import { ProgressBar } from '../../../ui/components/bars/ProgressBar'

import { CreditCeilingMapV1, CreditCeilingMapV2, ExpenseTypeAndVersion, ExpenseV2 } from './types'

type CreditCeilingProps = {
  amount: number
  max: number
} & ExpenseTypeAndVersion

export function CreditCeiling(props: CreditCeilingProps) {
  let ceilingConfig = null
  if (props.depositVersion === 1) {
    ceilingConfig = CreditCeilingMapV1[props.type]
  } else if (props.depositVersion === 2) {
    ceilingConfig = CreditCeilingMapV2[props.type]
  }

  if (!ceilingConfig || props.max <= 0) {
    return null
  }
  const amountLabel = `${props.amount} €`
  const progress = Number((props.amount / props.max).toFixed(2))
  const color = props.amount == 0 ? ColorsEnum.GREY_DARK : ceilingConfig.color

  return (
    <Container>
      <ProgressBar progress={progress} color={color} icon={ceilingConfig.icon} />
      <Amount color={color}>{amountLabel}</Amount>
      <View>
        <Label>{ceilingConfig.label}</Label>
      </View>
    </Container>
  )
}

export function getCreditCeilingProps(depositVersion: 1 | 2, expense: Expense | ExpenseV2) {
  let localProps: ExpenseTypeAndVersion
  if (depositVersion === 1) {
    localProps = {
      type: expense.domain as ExpenseDomain,
      depositVersion: depositVersion,
    }
  } else {
    localProps = {
      type: expense.domain as ExpenseV2['domain'],
      depositVersion: depositVersion,
    }
  }
  return localProps
}

const Container = styled.View({
  flex: 1,
  flexDirection: 'column',
  paddingHorizontal: getSpacing(1),
})

const Amount = styled(Typo.Title4)``

const Label = styled.Text({
  fontSize: 12,
  fontFamily: 'Montserrat-Medium',
})
