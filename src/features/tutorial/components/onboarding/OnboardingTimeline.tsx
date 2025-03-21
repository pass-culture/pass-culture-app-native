import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { CreditComponentProps, CreditTimeline } from 'features/tutorial/components/CreditTimeline'
import { TutorialTypes } from 'features/tutorial/enums'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { Spacer, Typo, getSpacing, getSpacingString } from 'ui/theme'

interface Props {
  age: 15 | 16 | 17 | 18
}

export const OnboardingTimeline: FunctionComponent<Props> = ({ age }) => {
  const { data: settings } = useSettingsContext()
  const enableCreditV3 = settings?.wipEnableCreditV3
  const stepperPropsMapping = enableCreditV3 ? stepperPropsMappingV2 : stepperPropsMappingV1

  const stepperProps = stepperPropsMapping.get(age)
  if (!stepperProps) return null

  return <CreditTimeline age={age} stepperProps={stepperProps} type={TutorialTypes.ONBOARDING} />
}

const CreditBlockContent: FunctionComponent<{ enableCreditV3: boolean }> = ({ enableCreditV3 }) => {
  const { eighteenYearsOldDeposit } = useDepositAmountsByAge()

  const description = enableCreditV3
    ? 'Tu as jusqu’à la veille de tes 21 ans pour utiliser tout ton crédit.'
    : `Tu auras 2 ans pour utiliser tes ${eighteenYearsOldDeposit}`

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={1} />
      <DescriptionText>{description}</DescriptionText>
    </React.Fragment>
  )
}

const CreditResetBlock = () => <StyledBody>Remise à 0 du crédit</StyledBody>

const stepperPropsMappingV1 = new Map<Props['age'], CreditComponentProps[]>([
  [
    15,
    [
      { creditStep: 15 },
      { creditStep: 16 },
      { creditStep: 17 },
      { creditStep: 'information', children: <CreditResetBlock /> },
      { creditStep: 18, children: <CreditBlockContent enableCreditV3={false} key={1} /> },
    ],
  ],
  [
    16,
    [
      { creditStep: 15 },
      { creditStep: 16 },
      { creditStep: 17 },
      { creditStep: 'information', children: <CreditResetBlock /> },
      { creditStep: 18, children: <CreditBlockContent enableCreditV3={false} key={2} /> },
    ],
  ],
  [
    17,
    [
      { creditStep: 15 },
      { creditStep: 16 },
      { creditStep: 17 },
      { creditStep: 'information', children: <CreditResetBlock /> },
      { creditStep: 18, children: <CreditBlockContent enableCreditV3={false} key={3} /> },
    ],
  ],
  [
    18,
    [
      { creditStep: 15 },
      { creditStep: 16 },
      { creditStep: 17 },
      { creditStep: 18, children: <CreditBlockContent enableCreditV3={false} key={4} /> },
    ],
  ],
])

const stepperPropsMappingV2 = new Map<Props['age'], CreditComponentProps[]>([
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

const StyledBody = styled(Typo.Body)({
  marginVertical: getSpacing(2),
  marginLeft: getSpacing(1.5),
  justifyContent: 'center',
})

const DescriptionText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  fontSize: theme.tabBar.fontSize,
  lineHeight: getSpacingString(3),
  color: theme.colors.greyDark,
}))
