import React from 'react'
import { View } from 'react-native'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

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
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

import { AnimatedProgressBar } from '../../../ui/components/bars/AnimatedProgressBar'

type CreditCeilingProps = {
  amount: number
  initial: number
  domain: ExpenseDomain
  hasPhysicalCeiling: boolean
  isUserUnderageBeneficiary: boolean
}

const CreditCeilingMapWithPhysical = (theme: DefaultTheme) => ({
  [ExpenseDomain.all]: {
    label: 'en sorties (concerts...)',
    color: theme.colors.accent,
    icon: OfferEvent,
  },
  [ExpenseDomain.physical]: {
    label: 'en offres physiques (livres...)',
    color: theme.colors.secondary,
    icon: OfferPhysical,
  },
  [ExpenseDomain.digital]: {
    label: 'en offres numériques (streaming...)',
    color: theme.colors.primary,
    icon: OfferDigital,
  },
})

const CreditCeilingMapWithoutPhysical = (theme: DefaultTheme) => ({
  [ExpenseDomain.all]: {
    label: 'en sorties & biens physiques (concerts, livres...)',
    color: theme.colors.primary,
    icon: Offers,
  },
  [ExpenseDomain.digital]: {
    label: 'en offres numériques (streaming...)',
    color: theme.colors.secondary,
    icon: OfferDigital,
  },
  [ExpenseDomain.physical]: null,
})

const underageBeneficiaryCeilingConfig = (theme: DefaultTheme) => ({
  ...CreditCeilingMapWithoutPhysical(theme)[ExpenseDomain.all],
  icon: BicolorLogo,
})

export function CreditCeiling(props: CreditCeilingProps) {
  const theme = useTheme()
  let ceilingConfig = null
  const beneficiaryCeilingConfig = props.hasPhysicalCeiling
    ? CreditCeilingMapWithPhysical(theme)[props.domain]
    : CreditCeilingMapWithoutPhysical(theme)[props.domain]
  ceilingConfig = props.isUserUnderageBeneficiary
    ? underageBeneficiaryCeilingConfig(theme)
    : beneficiaryCeilingConfig

  if (!ceilingConfig || props.initial <= 0) {
    return null
  }
  const amountLabel = formatPriceInEuroToDisplayPrice(props.amount)
  const progress = Number((props.amount / props.initial).toFixed(2))
  const color = props.amount === 0 ? theme.colors.greyDark : ceilingConfig.color

  return (
    <Container>
      <AnimatedProgressBar progress={progress} color={color} icon={ceilingConfig.icon} />
      <Amount color={color}>{amountLabel}</Amount>
      <View>
        <Typo.Caption>{ceilingConfig.label}</Typo.Caption>
      </View>
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  flexDirection: 'column',
  paddingHorizontal: getSpacing(1),
})

const Amount = styled(Typo.Title4).attrs(getNoHeadingAttrs())<{ color: ColorsEnum }>(
  ({ color }) => ({
    color,
  })
)
