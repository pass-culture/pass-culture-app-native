import React from 'react'

import { IconRetryStep } from 'features/identityCheck/components/IconRetryStep'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { StepButton } from 'features/identityCheck/components/StepButton'
import { StepButtonState, StepDetails, IdentityCheckStep } from 'features/identityCheck/types'
import { render } from 'tests/utils'
import { theme } from 'theme'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { AccessibleIcon } from 'ui/svg/icons/types'

describe('StepButton', () => {
  it.each`
    stepState                    | stepTestId                               | isDisabled
    ${StepButtonState.COMPLETED} | ${'Identification complété'}             | ${true}
    ${StepButtonState.CURRENT}   | ${'Identification non complété'}         | ${false}
    ${StepButtonState.DISABLED}  | ${'Identification non complété'}         | ${true}
    ${StepButtonState.RETRY}     | ${'Identification à essayer de nouveau'} | ${false}
  `(
    'should return the correct StepButton depending on StepButtonState',
    ({ stepState, stepTestId, isDisabled }) => {
      const identificationStep: StepDetails = {
        name: IdentityCheckStep.IDENTIFICATION,
        screens: ['SelectIDOrigin'],
        stepState: stepState,
        title: 'Identification',
        icon: {
          disabled: DisabledIdCardIcon,
          current: BicolorIdCard,
          completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
          retry: () => <IconRetryStep Icon={BicolorIdCard} testID="identification-retry-step" />,
        },
      }

      const stepButton = render(<StepButton step={identificationStep} />)
      expect(stepButton.getByTestId(stepTestId).props.accessibilityState.disabled).toBe(isDisabled)
    }
  )
  it.each`
    stepState                    | stepTestId
    ${StepButtonState.COMPLETED} | ${'Identification complété'}
    ${StepButtonState.CURRENT}   | ${'Identification non complété'}
    ${StepButtonState.DISABLED}  | ${'Identification non complété'}
    ${StepButtonState.RETRY}     | ${'Identification à essayer de nouveau'}
  `(
    'should return the correct StepButton depending on StepButtonState',
    ({ stepState, stepTestId }) => {
      const identificationStep: StepDetails = {
        name: IdentityCheckStep.IDENTIFICATION,
        screens: ['SelectIDOrigin'],
        stepState: stepState,
        title: 'Identification',
        icon: {
          disabled: DisabledIdCardIcon,
          current: BicolorIdCard,
          completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
          retry: () => <IconRetryStep Icon={BicolorIdCard} testID="identification-retry-step" />,
        },
      }

      const stepButton = render(<StepButton step={identificationStep} />)

      expect(stepButton.queryByTestId(stepTestId)).toBeTruthy()
    }
  )
})

const DisabledIdCardIcon: React.FC<AccessibleIcon> = () => (
  <BicolorIdCard
    size={24}
    color={theme.colors.greyMedium}
    color2={theme.colors.greyMedium}
    testID="DisabledIdCardIcon"
  />
)
