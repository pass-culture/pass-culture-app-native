import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ExpenseDomain } from 'api/gen/api'
import { formatPriceInEuroToDisplayPrice } from 'libs/parsers'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { OfferDigital } from 'ui/svg/icons/OfferDigital'
import { OfferEvent } from 'ui/svg/icons/OfferEvent'
import { OfferPhysical } from 'ui/svg/icons/OfferPhysical'
import { Offers } from 'ui/svg/icons/Offers'
import { getSpacing, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { ProgressBar } from '../../../ui/components/bars/ProgressBar'

type CreditCeilingProps = {
  amount: number
  initial: number
  domain: ExpenseDomain
  hasPhysicalCeiling: boolean
  isUserUnderageBeneficiary: boolean
}

const CreditCeilingMapWithPhysical = {
  [ExpenseDomain.all]: {
    label: 'en sorties (concerts...)',
    color: ColorsEnum.ACCENT,
    icon: OfferEvent,
  },
  [ExpenseDomain.physical]: {
    label: 'en offres physiques (livres...)',
    color: ColorsEnum.SECONDARY,
    icon: OfferPhysical,
  },
  [ExpenseDomain.digital]: {
    label: 'en offres numériques (streaming...)',
    color: ColorsEnum.PRIMARY,
    icon: OfferDigital,
  },
}

const CreditCeilingMapWithoutPhysical = {
  [ExpenseDomain.all]: {
    label: 'en sorties & biens physiques (concerts, livres...)',
    color: ColorsEnum.PRIMARY,
    icon: Offers,
  },
  [ExpenseDomain.digital]: {
    label: 'en offres numériques (streaming...)',
    color: ColorsEnum.SECONDARY,
    icon: OfferDigital,
  },
  [ExpenseDomain.physical]: null,
}

const underageBeneficiaryCeilingConfig = {
  ...CreditCeilingMapWithoutPhysical[ExpenseDomain.all],
  icon: BicolorLogo,
}

export function CreditCeiling(props: CreditCeilingProps) {
  let ceilingConfig = null
  const beneficiaryCeilingConfig = props.hasPhysicalCeiling
    ? CreditCeilingMapWithPhysical[props.domain]
    : CreditCeilingMapWithoutPhysical[props.domain]
  ceilingConfig = props.isUserUnderageBeneficiary
    ? underageBeneficiaryCeilingConfig
    : beneficiaryCeilingConfig

  if (!ceilingConfig || props.initial <= 0) {
    return null
  }
  const amountLabel = formatPriceInEuroToDisplayPrice(props.amount)
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

const Amount = styled(Typo.Title4)<{ color: ColorsEnum }>(({ color }) => ({ color }))

const Label = styled.Text({
  fontSize: 12,
  fontFamily: 'Montserrat-Medium',
})
