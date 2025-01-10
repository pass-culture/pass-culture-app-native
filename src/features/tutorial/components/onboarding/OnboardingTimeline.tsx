import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CreditComponentProps, CreditTimeline } from 'features/tutorial/components/CreditTimeline'
import { TutorialTypes } from 'features/tutorial/enums'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { Spacer, TypoDS, getSpacing, getSpacingString } from 'ui/theme'

interface Props {
  age: 15 | 16 | 17 | 18
}

export const OnboardingTimeline: FunctionComponent<Props> = ({ age }) => {
  const stepperProps = stepperPropsMapping.get(age)
  if (!stepperProps) return null

  return <CreditTimeline age={age} stepperProps={stepperProps} type={TutorialTypes.ONBOARDING} />
}

const DescriptionText = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  fontSize: theme.tabBar.fontSize,
  lineHeight: getSpacingString(3),
  color: theme.colors.greyDark,
}))

const CreditBlockContent = () => {
  const { eighteenYearsOldDeposit } = useDepositAmountsByAge()
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={1} />
      <DescriptionText>Tu auras 2 ans pour utiliser tes {eighteenYearsOldDeposit}</DescriptionText>
    </React.Fragment>
  )
}

const CreditResetBlock = () => <StyledBody>Remise à 0 du crédit</StyledBody>

const StyledBody = styled(TypoDS.Body)({
  marginVertical: getSpacing(2),
  marginLeft: getSpacing(1.5),
  justifyContent: 'center',
})

const stepperPropsMapping = new Map<Props['age'], CreditComponentProps[]>([
  [
    15,
    [
      { creditStep: 15 },
      { creditStep: 16 },
      { creditStep: 17 },
      { creditStep: 'information', children: <CreditResetBlock /> },
      { creditStep: 18, children: <CreditBlockContent /> },
    ],
  ],
  [
    16,
    [
      { creditStep: 15 },
      { creditStep: 16 },
      { creditStep: 17 },
      { creditStep: 'information', children: <CreditResetBlock /> },
      { creditStep: 18, children: <CreditBlockContent /> },
    ],
  ],
  [
    17,
    [
      { creditStep: 15 },
      { creditStep: 16 },
      { creditStep: 17 },
      { creditStep: 'information', children: <CreditResetBlock /> },
      { creditStep: 18, children: <CreditBlockContent /> },
    ],
  ],
  [
    18,
    [
      { creditStep: 15 },
      { creditStep: 16 },
      { creditStep: 17 },
      { creditStep: 18, children: <CreditBlockContent /> },
    ],
  ],
])
