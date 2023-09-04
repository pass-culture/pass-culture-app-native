import React from 'react'
import styled from 'styled-components/native'

import { InternalStep } from 'features/profile/components/InternalStep/InternalStep'
import { StepVariant } from 'features/profile/components/VerticalStepper/types'
import { CreditBlock } from 'features/tutorial/components/CreditBlock'
import { CreditBlockTitle } from 'features/tutorial/helpers/CreditBlockTitle'
import { getCreditStatusFromAge } from 'features/tutorial/helpers/getCreditStatusFromAge'
import { getStepperIconFromCreditStatus } from 'features/tutorial/helpers/getStepperIconFromCreditStatus'
import { getStepperVariantFromCreditStatus } from 'features/tutorial/helpers/getStepperVariantFromCreditStatus'
import { analytics } from 'libs/analytics'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { Warning } from 'ui/svg/icons/BicolorWarning'
import { Spacer, getSpacing } from 'ui/theme'

type Age = 15 | 16 | 17 | 18

type CreditStep = 15 | 16 | 17 | 18 | 'information'

export type CreditComponentProps = {
  creditStep: CreditStep
  iconComponent?: React.JSX.Element
  children?: React.ReactNode
}

type Props = {
  age: Age
  stepperProps: CreditComponentProps[]
  type: 'onboarding' | 'profileTutorial'
}

export const CreditTimeline = ({ stepperProps, age }: Props) => {
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
    <Container>
      {stepperProps.map((props, index) => {
        const iconComponent = props.iconComponent ?? <GreyWarning />
        if (props.creditStep === 'information')
          return (
            <InternalStep
              key={'information ' + index}
              variant={StepVariant.future}
              isLast={index === stepperProps.length - 1}
              iconComponent={iconComponent}>
              {props.children}
              <Spacer.Column numberOfSpaces={2} />
            </InternalStep>
          )
        const creditStatus = getCreditStatusFromAge(age, props.creditStep)
        const stepVariant = getStepperVariantFromCreditStatus(creditStatus)

        return (
          <InternalStep
            key={index}
            variant={stepVariant}
            iconComponent={getStepperIconFromCreditStatus(creditStatus)}
            isFirst={index === 0}
            isLast={index === stepperProps.length - 1}>
            <CreditBlock
              creditStatus={creditStatus}
              age={props.creditStep}
              onPress={() => analytics.logTrySelectDeposit(age)}>
              <CreditBlockTitle
                age={props.creditStep}
                userAge={age}
                deposit={depositsByAge.get(props.creditStep) ?? ''}
              />
              {props.children}
            </CreditBlock>

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
  color: theme.colors.greySemiDark,
  size: theme.icons.sizes.smaller,
}))({
  marginHorizontal: getSpacing(1.5),
})
