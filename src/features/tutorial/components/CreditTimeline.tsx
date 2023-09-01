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
import { Spacer, Typo, getSpacing } from 'ui/theme'

type Age = 15 | 16 | 17 | 18

type CreditStep = 15 | 16 | 17 | 18 | 'separator'

export type CreditComponentProps = { creditStep: CreditStep; description?: string }

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
        if (props.creditStep === 'separator') return <EigtheenSeparator key={index} />
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
              title={
                <CreditBlockTitle
                  age={props.creditStep}
                  userAge={age}
                  deposit={depositsByAge.get(props.creditStep) ?? ''}
                />
              }
              age={props.creditStep}
              description={props.description}
              onPress={() => analytics.logTrySelectDeposit(age)}
            />

            <Spacer.Column numberOfSpaces={2} />
          </InternalStep>
        )
      })}
    </Container>
  )
}

const EigtheenSeparator = () => {
  return (
    <React.Fragment>
      <InternalStep key={'separator'} variant={StepVariant.future} iconComponent={<GreyWarning />}>
        <StyledBody>Remise à 0 du crédit</StyledBody>
        <Spacer.Column numberOfSpaces={2} />
      </InternalStep>
    </React.Fragment>
  )
}

const Container = styled.View({
  flexGrow: 1,
  flexDirection: 'column',
})

const StyledBody = styled(Typo.Body)({
  marginVertical: getSpacing(2),
  marginLeft: getSpacing(1.5),
  justifyContent: 'center',
})

const GreyWarning = styled(Warning).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
  size: theme.icons.sizes.smaller,
}))({
  marginHorizontal: getSpacing(1.5),
})
