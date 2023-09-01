import React, { FunctionComponent } from 'react'

import { CreditComponentProps, CreditTimeline } from 'features/tutorial/components/CreditTimeline'

interface Props {
  age: 15 | 16 | 17 | 18
}

export const OnboardingTimeline: FunctionComponent<Props> = ({ age }) => {
  const stepperProps = stepperPropsMapping.get(age)
  if (!stepperProps) return null

  return <CreditTimeline age={age} stepperProps={stepperProps} type="onboarding" />
}

const stepperPropsMapping = new Map<Props['age'], CreditComponentProps[]>([
  [
    15,
    [
      { creditStep: 15 },
      { creditStep: 16 },
      { creditStep: 17 },
      { creditStep: 'separator' },
      { creditStep: 18, description: 'Tu auras 2 ans pour utiliser tes 300\u00a0€' },
    ],
  ],
  [
    16,
    [
      { creditStep: 15 },
      { creditStep: 16 },
      { creditStep: 17 },
      { creditStep: 'separator' },
      { creditStep: 18, description: 'Tu auras 2 ans pour utiliser tes 300\u00a0€' },
    ],
  ],
  [
    17,
    [
      { creditStep: 15 },
      { creditStep: 16 },
      { creditStep: 17 },
      { creditStep: 'separator' },
      { creditStep: 18, description: 'Tu auras 2 ans pour utiliser tes 300\u00a0€' },
    ],
  ],
  [
    18,
    [
      { creditStep: 15 },
      { creditStep: 16 },
      { creditStep: 17 },
      { creditStep: 18, description: 'Tu auras 2 ans pour utiliser tes 300\u00a0€' },
    ],
  ],
])
