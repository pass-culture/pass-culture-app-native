import React from 'react'

import {
  SubscriptionStep,
  SubscriptionStepCompletionState,
  SubscriptionStepperResponse,
  SubscriptionStepTitle,
} from 'api/gen'
import { IconRetryStep } from 'features/identityCheck/components/IconRetryStep'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { mapStepsDetails } from 'features/identityCheck/pages/helpers/mapStepsDetails'
import {
  IdentityCheckStep,
  StepButtonState,
  StepConfig,
  StepDetails,
} from 'features/identityCheck/types'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorLegal } from 'ui/svg/icons/BicolorLegal'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'

const stepsToComplete: SubscriptionStepperResponse['subscriptionStepsToDisplay'] = [
  {
    name: SubscriptionStep['phone-validation'],
    completionState: SubscriptionStepCompletionState.current,
    title: SubscriptionStepTitle['Numéro de téléphone'],
    subtitle: 'Sous-titre Numéro de téléphone',
  },
  {
    name: SubscriptionStep['identity-check'],
    completionState: SubscriptionStepCompletionState.retry,
    title: SubscriptionStepTitle['Identification'],
    subtitle: 'Sous-titre Identification',
  },
  {
    name: SubscriptionStep['maintenance'],
    completionState: SubscriptionStepCompletionState.completed,
    title: SubscriptionStepTitle['Confirmation'],
    subtitle: 'Maintenance',
  },
  {
    name: SubscriptionStep['honor-statement'],
    completionState: SubscriptionStepCompletionState.disabled,
    title: SubscriptionStepTitle['Confirmation'],
    subtitle: 'Confirmation',
  },
]
describe('mapStepsDetails', () => {
  const stepsConfig: StepConfig[] = [
    {
      screens: ['SetPhoneNumber'],
      name: IdentityCheckStep.PHONE_VALIDATION,
      icon: {
        disabled: BicolorSmartphone,
        current: BicolorSmartphone,
        completed: () => (
          <IconStepDone Icon={BicolorSmartphone} testID="phone-validation-step-done" />
        ),
        retry: () => <IconRetryStep Icon={BicolorProfile} testID="phone-validation-retry-step" />,
      },
    },
    {
      screens: ['SetName'],
      name: IdentityCheckStep.PROFILE,
      icon: {
        disabled: BicolorProfile,
        current: BicolorProfile,
        completed: () => <IconStepDone Icon={BicolorProfile} testID="profile-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorProfile} testID="profile-retry-step" />,
      },
    },
    {
      screens: ['SelectIDOrigin'],
      name: IdentityCheckStep.IDENTIFICATION,
      icon: {
        disabled: BicolorIdCard,
        current: BicolorIdCard,
        completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorProfile} testID="identification-retry-step" />,
      },
    },
    {
      screens: ['IdentityCheckHonor'],
      name: IdentityCheckStep.CONFIRMATION,
      icon: {
        disabled: BicolorLegal,
        current: BicolorLegal,
        completed: () => <IconStepDone Icon={BicolorLegal} testID="Confirmation-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorProfile} testID="Confirmation-retry-step" />,
      },
    },
  ]

  const expectedStepsDetails: StepDetails[] = [
    {
      name: IdentityCheckStep.PHONE_VALIDATION,
      icon: {
        disabled: BicolorSmartphone,
        current: BicolorSmartphone,
        completed: expect.any(Function),
        retry: expect.any(Function),
      },
      screens: ['SetPhoneNumber'],
      title: 'Numéro de téléphone',
      subtitle: 'Sous-titre Numéro de téléphone',
      stepState: StepButtonState.CURRENT,
    },
    {
      name: IdentityCheckStep.IDENTIFICATION,
      icon: {
        disabled: BicolorIdCard,
        current: BicolorIdCard,
        completed: expect.any(Function),
        retry: expect.any(Function),
      },
      screens: ['SelectIDOrigin'],
      title: 'Identification',
      subtitle: 'Sous-titre Identification',
      stepState: StepButtonState.RETRY,
    },
    {
      name: IdentityCheckStep.CONFIRMATION,
      icon: {
        disabled: BicolorLegal,
        current: BicolorLegal,
        completed: expect.any(Function),
        retry: expect.any(Function),
      },
      screens: ['IdentityCheckHonor'],
      title: 'Confirmation',
      subtitle: 'Confirmation',
      stepState: StepButtonState.DISABLED,
    },
  ]

  it('should map steps info from the back with steps config from the front ', () => {
    const result = mapStepsDetails(stepsToComplete, stepsConfig)
    expect(result).toEqual(expectedStepsDetails)
  })

  it('should only return steps when the associated config exists in-app', () => {
    const result = mapStepsDetails(stepsToComplete, stepsConfig)
    expect(stepsToComplete.length).toEqual(4)
    expect(result.length).toEqual(3)
  })
})
