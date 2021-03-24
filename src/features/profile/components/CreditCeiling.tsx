import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ExpenseDomain } from 'api/gen/api'
import { OfferDigital } from 'ui/svg/icons/OfferDigital'
import { OfferOutings } from 'ui/svg/icons/OfferOutings'
import { OfferOutingsPhysical } from 'ui/svg/icons/OfferOutingsPhysical'
import { OfferPhysical } from 'ui/svg/icons/OfferPhysical'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

import { ProgressBar } from '../../../ui/components/bars/ProgressBar'

type CreditCeilingProps = {
  amount: number
  initial: number
  domain: ExpenseDomain
  hasPhysicalCeiling: boolean
}

const CreditCeilingMapWithPhysical = {
  [ExpenseDomain.All]: {
    label: 'en sorties (concerts...)',
    color: ColorsEnum.ACCENT,
    icon: OfferOutings,
  },
  [ExpenseDomain.Physical]: {
    label: 'en offres physiques (livres...)',
    color: ColorsEnum.SECONDARY,
    icon: OfferPhysical,
  },
  [ExpenseDomain.Digital]: {
    label: 'en offres numériques (streaming...)',
    color: ColorsEnum.PRIMARY,
    icon: OfferDigital,
  },
}

const CreditCeilingMapWithoutPhysical = {
  [ExpenseDomain.All]: {
    label: 'en sorties & biens physiques (concerts, livres...)',
    color: ColorsEnum.PRIMARY,
    icon: OfferOutingsPhysical,
  },
  [ExpenseDomain.Digital]: {
    label: 'en offres numériques (streaming...)',
    color: ColorsEnum.SECONDARY,
    icon: OfferDigital,
  },
  [ExpenseDomain.Physical]: null,
}

export function CreditCeiling(props: CreditCeilingProps) {
  let ceilingConfig = null
  ceilingConfig = props.hasPhysicalCeiling
    ? CreditCeilingMapWithPhysical[props.domain]
    : CreditCeilingMapWithoutPhysical[props.domain]

  if (!ceilingConfig || props.initial <= 0) {
    return null
  }
  const amountLabel = `${props.amount} €`
  const progress = Number((props.amount / props.initial).toFixed(2))
  const color = props.amount === 0 ? ColorsEnum.GREY_DARK : ceilingConfig.color

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
