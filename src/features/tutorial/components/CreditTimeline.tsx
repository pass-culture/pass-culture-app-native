import React from 'react'
import styled from 'styled-components/native'

import { InternalStep } from 'features/profile/components/InternalStep/InternalStep'
import { StepVariant } from 'features/profile/components/VerticalStepper/types'
import { AgeCreditBlock } from 'features/tutorial/components/AgeCreditBlock'
import { CreditBlock } from 'features/tutorial/components/CreditBlock'
import { OnboardingCreditBlockTitle } from 'features/tutorial/components/onboarding/OnboardingCreditBlockTitle'
import { ProfileTutorialCreditBlockTitle } from 'features/tutorial/components/profileTutorial/ProfileTutorialCreditBlockTitle'
import { CreditStatus, Tutorial } from 'features/tutorial/enums'
import { getCreditStatusFromAge } from 'features/tutorial/helpers/getCreditStatusFromAge'
import { getStepperIconFromCreditStatus } from 'features/tutorial/helpers/getStepperIconFromCreditStatus'
import { getStepperVariantFromCreditStatus } from 'features/tutorial/helpers/getStepperVariantFromCreditStatus'
import { TutorialType } from 'features/tutorial/types'
import { analytics } from 'libs/analytics'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { Warning } from 'ui/svg/icons/BicolorWarning'
import { Spacer, getSpacing } from 'ui/theme'

type Age = 15 | 16 | 17 | 18

type CreditStep = 15 | 16 | 17 | 18 | 'information' | 'pastStep'

export type CreditComponentProps = {
  creditStep: CreditStep
  iconComponent?: React.JSX.Element
  children?: React.ReactNode
}

interface Props extends TutorialType {
  age: Age
  stepperProps: CreditComponentProps[]
  testID?: string
}

export const CreditTimeline = ({ stepperProps, age, type, testID }: Props) => {
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
  const SpaceBetweenBlock = type === Tutorial.ONBOARDING ? 1 : 3

  const CreditBlockTitle =
    type === Tutorial.ONBOARDING ? OnboardingCreditBlockTitle : ProfileTutorialCreditBlockTitle

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
              <Spacer.Column numberOfSpaces={SpaceBetweenBlock} />
              {props.children}
              <Spacer.Column numberOfSpaces={SpaceBetweenBlock} />
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
              <Spacer.Column numberOfSpaces={SpaceBetweenBlock} />
              <CreditBlock creditStatus={CreditStatus.GONE}>{props.children}</CreditBlock>
              <Spacer.Column numberOfSpaces={SpaceBetweenBlock} />
            </InternalStep>
          )
        }
        const creditStatus = getCreditStatusFromAge(age, props.creditStep)
        const stepVariant = getStepperVariantFromCreditStatus(creditStatus)

        return (
          <InternalStep
            key={index}
            variant={stepVariant}
            iconComponent={getStepperIconFromCreditStatus(creditStatus)}
            isFirst={isFirst}
            isLast={isLast}>
            <Spacer.Column numberOfSpaces={SpaceBetweenBlock} />
            <AgeCreditBlock
              creditStatus={creditStatus}
              age={props.creditStep}
              onPress={() => analytics.logTrySelectDeposit(age)}>
              <CreditBlockTitle
                age={props.creditStep}
                userAge={age}
                deposit={depositsByAge.get(props.creditStep) ?? ''}
              />
              {props.children}
            </AgeCreditBlock>

            <Spacer.Column numberOfSpaces={SpaceBetweenBlock} />
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
