import React from 'react'

import { IconRetryStep } from 'features/identityCheck/components/IconRetryStep'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { StepButton } from 'ui/components/StepButton/StepButton'
import { StepButtonState, StepDetails } from 'ui/components/StepButton/types'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { AccessibleIcon } from 'ui/svg/icons/types'

describe('StepButton', () => {
  it('should disable the StepButton for COMPLETED state', () => {
    renderStepButton(StepButtonState.COMPLETED)

    expect(
      screen.getByTestId('Identification complété').props.accessibilityState.disabled
    ).toBeTruthy()
  })

  it('should enable the StepButton for CURRENT state', () => {
    renderStepButton(StepButtonState.CURRENT)

    expect(
      screen.queryByTestId('Identification non complété')?.props.accessibilityState.disabled
    ).toBeFalsy()
  })

  it('should disable StepButton for DISABLED state', () => {
    renderStepButton(StepButtonState.DISABLED)

    expect(
      screen.getByTestId('Identification non complété').props.accessibilityState.disabled
    ).toBeTruthy()
  })

  it('should enable StepButton for RETRY state', () => {
    renderStepButton(StepButtonState.RETRY)

    expect(
      screen.queryByTestId('Identification à essayer de nouveau')?.props.accessibilityState.disabled
    ).toBeFalsy()
  })

  it('should show the right StepButton for COMPLETED state', () => {
    renderStepButton(StepButtonState.COMPLETED)

    expect(screen.queryByTestId('Identification complété')).toBeOnTheScreen()
  })

  it('should show the right StepButton for CURRENT state', () => {
    renderStepButton(StepButtonState.CURRENT)

    expect(screen.queryByTestId('Identification non complété')).toBeOnTheScreen()
  })

  it('should show the right StepButton for DISABLED state', () => {
    renderStepButton(StepButtonState.DISABLED)

    expect(screen.queryByTestId('Identification non complété')).toBeOnTheScreen()
  })

  it('should show the right StepButton for RETRY state', () => {
    renderStepButton(StepButtonState.RETRY)

    expect(screen.queryByTestId('Identification à essayer de nouveau')).toBeOnTheScreen()
  })
})

const DisabledIdCardIcon: React.FC<AccessibleIcon> = () => (
  <BicolorIdCard
    size={24}
    color={theme.colors.greyMedium}
    color2={theme.colors.greyMedium}
    testID="DisabledIdCardIcon"
  />
)

function renderStepButton(stepState: StepButtonState) {
  const identificationStep: StepDetails = {
    stepState,
    title: 'Identification',
    icon: {
      disabled: DisabledIdCardIcon,
      current: BicolorIdCard,
      completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
      retry: () => <IconRetryStep Icon={BicolorIdCard} testID="identification-retry-step" />,
    },
  }
  render(<StepButton step={identificationStep} />)
}
