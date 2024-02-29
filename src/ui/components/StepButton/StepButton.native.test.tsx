import React from 'react'

import { IconRetryStep } from 'features/identityCheck/components/IconRetryStep'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { StepButton } from 'ui/components/StepButton/StepButton'
import { StepButtonState, StepDetails } from 'ui/components/StepButton/types'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { AccessibleIcon } from 'ui/svg/icons/types'

describe('StepButton', () => {
  it('should disable the StepButton for COMPLETED state', () => {
    renderStepButton(StepButtonState.COMPLETED)

    expect(screen.getByTestId('Identification complété')).toBeDisabled()
  })

  it('should enable the StepButton for CURRENT state', () => {
    renderStepButton(StepButtonState.CURRENT)

    expect(screen.getByTestId('Identification non complété')).toBeEnabled()
  })

  it('should disable StepButton for DISABLED state', () => {
    renderStepButton(StepButtonState.DISABLED)

    expect(screen.getByTestId('Identification non complété')).toBeDisabled()
  })

  it('should disable the StepButton for CURRENT state when it has no behavior on press', () => {
    renderStepButton(StepButtonState.CURRENT, {})

    expect(screen.getByTestId('Identification non complété')).toBeDisabled()
  })

  it('should enable StepButton for RETRY state', () => {
    renderStepButton(StepButtonState.RETRY)

    expect(screen.getByTestId('Identification à essayer de nouveau')).toBeEnabled()
  })

  it('should show the right StepButton for COMPLETED state', () => {
    renderStepButton(StepButtonState.COMPLETED)

    expect(screen.getByTestId('Identification complété')).toBeOnTheScreen()
  })

  it('should show the right StepButton for CURRENT state', () => {
    renderStepButton(StepButtonState.CURRENT)

    expect(screen.getByTestId('Identification non complété')).toBeOnTheScreen()
  })

  it('should show the right StepButton for DISABLED state', () => {
    renderStepButton(StepButtonState.DISABLED)

    expect(screen.getByTestId('Identification non complété')).toBeOnTheScreen()
  })

  it('should show the right StepButton for RETRY state', () => {
    renderStepButton(StepButtonState.RETRY)

    expect(screen.getByTestId('Identification à essayer de nouveau')).toBeOnTheScreen()
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

function renderStepButton(
  stepState: StepButtonState,
  additionalProps: { navigateTo?: InternalNavigationProps['navigateTo']; onPress?: () => void } = {
    navigateTo: { screen: 'IdentificationFork' },
  }
) {
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
  render(<StepButton step={identificationStep} {...additionalProps} />)
}
