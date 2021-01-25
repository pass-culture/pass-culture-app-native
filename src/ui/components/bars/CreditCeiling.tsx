import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

import { ProgressBar } from './ProgressBar'
import { CreditCeilingMapV1, CreditCeilingMapV2 } from './types'

type CreditCeilingProps = {
  amount: number
  max: number
} & (
  | {
      type: keyof typeof CreditCeilingMapV1
      depositVersion: 1
    }
  | {
      type: keyof typeof CreditCeilingMapV2
      depositVersion: 2
    }
)

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

  return (
    <Container>
      <ProgressBar progress={progress} color={ceilingConfig.color} icon={ceilingConfig.icon} />
      <Amount color={ceilingConfig.color}>{amountLabel}</Amount>
      <View>
        <Label>{ceilingConfig.label}</Label>
      </View>
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  flexDirection: 'column',
})

const Amount = styled(Typo.Title4)``

const Label = styled.Text({
  fontSize: 12,
  fontFamily: 'Montserrat-Medium',
})
