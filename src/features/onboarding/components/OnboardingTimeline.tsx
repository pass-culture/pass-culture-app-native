import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CreditComponentProps, CreditTimeline } from 'features/onboarding/components/CreditTimeline'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { Typo, getSpacingString } from 'ui/theme'

interface Props {
  age: 15 | 16 | 17 | 18
}

export const OnboardingTimeline: FunctionComponent<Props> = ({ age }) => {
  const stepperProps = stepperPropsMapping.get(age)
  if (!stepperProps) return null

  return <CreditTimeline age={age} stepperProps={stepperProps} />
}

const CreditBlockContent: FunctionComponent<{ enableCreditV3: boolean }> = ({ enableCreditV3 }) => {
  const { eighteenYearsOldDeposit } = useDepositAmountsByAge()

  const description = enableCreditV3
    ? 'Tu as jusqu’à la veille de tes 21 ans pour utiliser tout ton crédit.'
    : `Tu auras 2 ans pour utiliser tes ${eighteenYearsOldDeposit}`

  return <DescriptionText>{description}</DescriptionText>
}

const stepperPropsMapping = new Map<Props['age'], CreditComponentProps[]>([
  [
    17,
    [
      { creditStep: 17 },
      { creditStep: 18, children: <CreditBlockContent enableCreditV3 key={1} /> },
    ],
  ],
  [
    18,
    [
      { creditStep: 17 },
      { creditStep: 18, children: <CreditBlockContent enableCreditV3 key={2} /> },
    ],
  ],
])

const DescriptionText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  fontSize: theme.tabBar.fontSize,
  lineHeight: getSpacingString(3),
  marginTop: theme.designSystem.size.spacing.xs,
  color: theme.designSystem.color.text.subtle,
}))
