import React from 'react'

import { IconRetryStep } from 'features/identityCheck/components/IconRetryStep'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { StepButton } from 'features/identityCheck/components/StepButton'
import {
  StepButtonState,
  DeprecatedStepConfig,
  StepDetails,
  IdentityCheckStep,
} from 'features/identityCheck/types'
import { render } from 'tests/utils'
import { theme } from 'theme'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { AccessibleIcon, IconInterface } from 'ui/svg/icons/types'

const label = 'Profil'
const DisabledIcon: React.FC<IconInterface> = () => (
  <BicolorProfile
    testID="disabled-icon"
    opacity={0.5}
    color={theme.colors.black}
    color2={theme.colors.black}
  />
)
const CurrentIcon: React.FC<IconInterface> = () => (
  <BicolorProfile
    testID="current-icon"
    opacity={0.5}
    color={theme.colors.black}
    color2={theme.colors.black}
  />
)
const CompletedIcon: React.FC<IconInterface> = () => (
  <BicolorProfile
    testID="completed-icon"
    opacity={0.5}
    color={theme.colors.black}
    color2={theme.colors.black}
  />
)
const step = {
  label,
  icon: { disabled: DisabledIcon, current: CurrentIcon, completed: CompletedIcon },
} as DeprecatedStepConfig

describe('StepButton with DeprecatedStepConfig', () => {
  describe('button is enabled/disabled', () => {
    it('should be disabled if step is "completed"', () => {
      const { getByTestId } = render(<StepButton step={step} state={StepButtonState.COMPLETED} />)
      expect(getByTestId(`${label} complété`).props.accessibilityState.disabled).toBe(true)
    })

    it('should be disabled if step is "disabled"', () => {
      const { getByTestId } = render(<StepButton step={step} state={StepButtonState.DISABLED} />)
      expect(getByTestId(`${label} non complété`).props.accessibilityState.disabled).toBe(true)
    })

    it('should be active if step is "current"', () => {
      const { getByTestId } = render(<StepButton step={step} state={StepButtonState.CURRENT} />)
      expect(getByTestId(`${label} non complété`).props.accessibilityState.disabled).toBe(false)
    })
  })

  describe('icons', () => {
    it('icon check is displaying when step is completed', () => {
      const { queryByTestId } = render(<StepButton step={step} state={StepButtonState.COMPLETED} />)

      expect(queryByTestId('completed-icon')).toBeTruthy()
      expect(queryByTestId('current-icon')).toBeFalsy()
      expect(queryByTestId('disabled-icon')).toBeFalsy()
    })

    it('icon check is not displaying when step is disabled', () => {
      const { queryByTestId } = render(<StepButton step={step} state={StepButtonState.DISABLED} />)

      expect(queryByTestId('disabled-icon')).toBeTruthy()
      expect(queryByTestId('completed-icon')).toBeFalsy()
      expect(queryByTestId('current-icon')).toBeFalsy()
    })

    it('icon check is not displaying when step is current', () => {
      const { queryByTestId } = render(<StepButton step={step} state={StepButtonState.CURRENT} />)

      expect(queryByTestId('current-icon')).toBeTruthy()
      expect(queryByTestId('completed-icon')).toBeFalsy()
      expect(queryByTestId('disabled-icon')).toBeFalsy()
    })
  })
})

describe('StepButton with StepDetails', () => {
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

      const stepButton = render(<StepButton state={stepState} step={identificationStep} />)

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
