import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CreditBlock } from 'features/onboarding/components/CreditBlock'
import { CreditBlockTitle } from 'features/onboarding/helpers/CreditBlockTitle'
import { getCreditStatusFromAge } from 'features/onboarding/helpers/getCreditStatusFromAge'
import { InternalStep } from 'features/profile/components/InternalStep/InternalStep'
import { StepVariant } from 'features/profile/components/VerticalStepper/types'
import { VerticalStepperProps } from 'features/profile/components/VerticalStepper/VerticalStepper'
import { analytics } from 'libs/analytics'
import LottieView from 'libs/lottie'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import OnboardingUnlock from 'ui/animations/onboarding_unlock.json'
import { Warning } from 'ui/svg/icons/BicolorWarning'
import { Lock } from 'ui/svg/icons/Lock'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  age: 15 | 16 | 17 | 18
}

export const OnboardingTimeline: FunctionComponent<Props> = ({ age }) => {
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

  const stepperProps = stepperPropsMapping.get(age)
  return (
    <StyledView>
      {stepperProps?.map((props, index) => {
        const blockDescription =
          props.creditStep === 18 ? 'Tu auras 2 ans pour utiliser tes 300\u00a0€' : undefined
        return (
          <InternalStep
            key={index}
            {...props}
            isFirst={index === 0}
            isLast={index === stepperProps.length - 1}>
            {props.creditStep === 'separator' ? (
              <StyledBody>Remise à 0 du crédit</StyledBody>
            ) : (
              <CreditBlock
                creditStatus={getCreditStatusFromAge(age, props.creditStep)}
                title={
                  <CreditBlockTitle
                    age={props.creditStep}
                    userAge={age}
                    deposit={depositsByAge.get(props.creditStep) ?? ''}
                  />
                }
                age={props.creditStep}
                description={blockDescription}
                onPress={() => analytics.logTrySelectDeposit(age)}
              />
            )}
            <Spacer.Column numberOfSpaces={2} />
          </InternalStep>
        )
      })}
    </StyledView>
  )
}

const StyledView = styled.View({
  flexGrow: 1,
  flexDirection: 'column',
})

const GreyLock = styled(Lock).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
}))({
  marginHorizontal: getSpacing(1.5),
})

const MediumGreyLock = styled(Lock).attrs(({ theme }) => ({
  color: theme.colors.greyMedium,
}))({
  marginHorizontal: getSpacing(1.5),
})

const GreyWarning = styled(Warning).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
  size: theme.icons.sizes.smaller,
}))({
  marginHorizontal: getSpacing(1.5),
})

const StyledLottieView = styled(LottieView)(({ theme }) => ({
  width: theme.icons.sizes.standard,
  height: theme.icons.sizes.standard,
}))

const StyledBody = styled(Typo.Body)({
  marginVertical: getSpacing(2),
  marginLeft: getSpacing(1.5),
  justifyContent: 'center',
})

const AnimatedBicolorUnlock = () => (
  <StyledLottieView source={OnboardingUnlock} autoPlay loop={false} />
)

type creditStep = 15 | 16 | 17 | 18 | 'separator'

type CreditComponentProps = VerticalStepperProps & { creditStep: creditStep }

const stepperPropsMapping = new Map<Props['age'], CreditComponentProps[]>([
  [
    15,
    [
      {
        creditStep: 15,
        variant: StepVariant.in_progress,
        iconComponent: <AnimatedBicolorUnlock />,
      },
      { creditStep: 16, variant: StepVariant.future, iconComponent: <GreyLock /> },
      { creditStep: 17, variant: StepVariant.future, iconComponent: <GreyLock /> },
      { creditStep: 'separator', variant: StepVariant.future, iconComponent: <GreyWarning /> },
      { creditStep: 18, variant: StepVariant.future, iconComponent: <GreyLock /> },
    ],
  ],
  [
    16,
    [
      { creditStep: 15, variant: StepVariant.complete, iconComponent: <MediumGreyLock /> },
      {
        creditStep: 16,
        variant: StepVariant.in_progress,
        iconComponent: <AnimatedBicolorUnlock />,
      },
      { creditStep: 17, variant: StepVariant.future, iconComponent: <GreyLock /> },
      { creditStep: 'separator', variant: StepVariant.future, iconComponent: <GreyWarning /> },
      { creditStep: 18, variant: StepVariant.future, iconComponent: <GreyLock /> },
    ],
  ],
  [
    17,
    [
      { creditStep: 15, variant: StepVariant.complete, iconComponent: <MediumGreyLock /> },
      { creditStep: 16, variant: StepVariant.complete, iconComponent: <MediumGreyLock /> },
      {
        creditStep: 17,
        variant: StepVariant.in_progress,
        iconComponent: <AnimatedBicolorUnlock />,
      },
      { creditStep: 'separator', variant: StepVariant.future, iconComponent: <GreyWarning /> },
      { creditStep: 18, variant: StepVariant.future, iconComponent: <GreyLock /> },
    ],
  ],
  [
    18,
    [
      { creditStep: 15, variant: StepVariant.complete, iconComponent: <MediumGreyLock /> },
      { creditStep: 16, variant: StepVariant.complete, iconComponent: <MediumGreyLock /> },
      { creditStep: 17, variant: StepVariant.complete, iconComponent: <MediumGreyLock /> },
      {
        creditStep: 18,
        variant: StepVariant.in_progress,
        iconComponent: <AnimatedBicolorUnlock />,
      },
    ],
  ],
])
