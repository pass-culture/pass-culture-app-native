import React from 'react'
import styled from 'styled-components/native'

import { AgeCreditBlock } from 'features/onboarding/components/AgeCreditBlock'
import { CreditBlock } from 'features/onboarding/components/CreditBlock'
import { OnboardingCreditBlockTitle } from 'features/onboarding/components/OnboardingCreditBlockTitle'
import { CreditStatus } from 'features/onboarding/enums'
import { getCreditStatusFromAge } from 'features/onboarding/helpers/getCreditStatusFromAge'
import { getStepperIconFromCreditStatus } from 'features/onboarding/helpers/getStepperIconFromCreditStatus'
import { getStepperVariantFromCreditStatus } from 'features/onboarding/helpers/getStepperVariantFromCreditStatus'
import { analytics } from 'libs/analytics/provider'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { InternalStep } from 'ui/components/InternalStep/InternalStep'
import { StepVariant } from 'ui/components/VerticalStepper/types'
import { Warning } from 'ui/svg/icons/Warning'
import { Spacer, getSpacing } from 'ui/theme'

type Age = 15 | 16 | 17 | 18

type CreditStep = 15 | 16 | 17 | 18 | 'information' | 'pastStep'

export type CreditComponentProps = {
  creditStep: CreditStep
  iconComponent?: React.JSX.Element
  children?: React.ReactNode
}

interface Props {
  age: Age
  stepperProps: CreditComponentProps[]
  testID?: string
}

export const CreditTimeline = ({ stepperProps, age, testID }: Props) => {
  const {
    fifteenYearsOldDeposit,
    sixteenYearsOldDeposit,
    seventeenYearsOldDeposit,
    eighteenYearsOldDeposit,
  } = useDepositAmountsByAge()

  const depositsByAge = new Map<Props['age'], string>([
    [15, fifteenYearsOldDeposit],
    [16, sixteenYearsOldDeposit],
    [17, seventeenYearsOldDeposit],
    [18, eighteenYearsOldDeposit],
  ])

  return (
    <Container testID={testID}>
      {stepperProps.map((props, index) => {
        const isLast = index === stepperProps.length - 1
        const isFirst = index === 0
        if (props.creditStep === 'information') {
          const iconComponent = props.iconComponent ?? <GreyWarning />
          return (
            <InternalStep
              key={'information ' + index}
              variant={StepVariant.future}
              isLast={isLast}
              iconComponent={iconComponent}>
              <Spacer.Column numberOfSpaces={2} />
              {props.children}
              <Spacer.Column numberOfSpaces={2} />
            </InternalStep>
          )
        }

        if (props.creditStep === 'pastStep') {
          const iconComponent =
            props.iconComponent ?? getStepperIconFromCreditStatus(CreditStatus.GONE)
          return (
            <InternalStep
              key={'pastStep ' + index}
              variant={StepVariant.complete}
              isFirst={isFirst}
              iconComponent={iconComponent}>
              <Spacer.Column numberOfSpaces={2} />
              <CreditBlock creditStatus={CreditStatus.GONE}>{props.children}</CreditBlock>
              <Spacer.Column numberOfSpaces={2} />
            </InternalStep>
          )
        }
        const creditStatus = getCreditStatusFromAge(age, props.creditStep)
        const stepVariant = getStepperVariantFromCreditStatus(creditStatus)

        return (
          <InternalStep
            key={'step ' + index}
            variant={stepVariant}
            iconComponent={getStepperIconFromCreditStatus(creditStatus)}
            isFirst={isFirst}
            isLast={isLast}>
            <Spacer.Column numberOfSpaces={2} />
            <AgeCreditBlock
              creditStatus={creditStatus}
              age={props.creditStep}
              onPress={() => analytics.logTrySelectDeposit(age)}>
              <OnboardingCreditBlockTitle
                age={props.creditStep}
                userAge={age}
                deposit={depositsByAge.get(props.creditStep) ?? ''}
              />
              {props.children}
            </AgeCreditBlock>

            <Spacer.Column numberOfSpaces={2} />
          </InternalStep>
        )
      })}
    </Container>
  )
}

const Container = styled.View({
  flexGrow: 1,
  flexDirection: 'column',
})

const GreyWarning = styled(Warning).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
  size: theme.icons.sizes.smaller,
}))({
  marginHorizontal: getSpacing(1.5),
})
